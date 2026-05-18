import { describe, it, expect, beforeEach, vi } from "vitest";
import { NotFoundError } from "elysia";
import { taskOrderingRepository } from "@/modules/tasks/task-ordering.repository";
import { prisma } from "@/lib/prisma";
import { mockTaskWithDates } from "./mockData";

type TransactionCallback = (prismaParam: typeof prisma) => Promise<unknown>;

vi.mock("@/lib/prisma", () => ({
  prisma: {
    task: {
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    $transaction: async (callback: TransactionCallback) =>
      await callback(prisma),
  },
}));

const OFFSET = 1_000_000;

describe("taskOrderingRepository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("shiftPositions", () => {
    it("emits two updateMany calls: park in negative range, then settle at +delta", async () => {
      vi.mocked(prisma.task.updateMany).mockResolvedValue({ count: 0 });

      const where = {
        projectId: 1,
        status: "NEW" as const,
        position: { gt: 3 },
      };

      await taskOrderingRepository.shiftPositions(prisma, where, +1);

      expect(prisma.task.updateMany).toHaveBeenCalledTimes(2);

      expect(prisma.task.updateMany).toHaveBeenNthCalledWith(1, {
        where,
        data: { position: { decrement: OFFSET } },
      });

      expect(prisma.task.updateMany).toHaveBeenNthCalledWith(2, {
        where: { ...where, position: { lt: -500_000 } },
        data: { position: { increment: OFFSET + 1 } },
      });
    });

    it("uses OFFSET - 1 on the second pass when delta is -1", async () => {
      vi.mocked(prisma.task.updateMany).mockResolvedValue({ count: 0 });

      const where = {
        projectId: 7,
        status: "IN_PROGRESS" as const,
        position: { gte: 2 },
      };

      await taskOrderingRepository.shiftPositions(prisma, where, -1);

      expect(prisma.task.updateMany).toHaveBeenNthCalledWith(2, {
        where: { ...where, position: { lt: -500_000 } },
        data: { position: { increment: OFFSET - 1 } },
      });
    });

    it("preserves projectId and status on the second pass (does not leak across boards)", async () => {
      vi.mocked(prisma.task.updateMany).mockResolvedValue({ count: 0 });

      const where = {
        projectId: 42,
        status: "STOPPED" as const,
        position: { gt: 5 },
      };

      await taskOrderingRepository.shiftPositions(prisma, where, -1);

      const secondCall = vi.mocked(prisma.task.updateMany).mock.calls[1]![0];
      expect(secondCall.where).toMatchObject({
        projectId: 42,
        status: "STOPPED",
      });
      // The position filter from the first pass must be overridden, not merged.
      expect(secondCall.where!.position).toEqual({ lt: -500_000 });
    });
  });

  describe("closeGap", () => {
    it("shifts rows with position > P down by 1", async () => {
      vi.mocked(prisma.task.updateMany).mockResolvedValue({ count: 0 });

      await taskOrderingRepository.closeGap(prisma, 1, "NEW", 3);

      expect(prisma.task.updateMany).toHaveBeenNthCalledWith(1, {
        where: { projectId: 1, status: "NEW", position: { gt: 3 } },
        data: { position: { decrement: OFFSET } },
      });

      expect(prisma.task.updateMany).toHaveBeenNthCalledWith(2, {
        where: {
          projectId: 1,
          status: "NEW",
          position: { lt: -500_000 },
        },
        data: { position: { increment: OFFSET - 1 } },
      });
    });
  });

  describe("makeRoom", () => {
    it("shifts rows with position >= P up by 1", async () => {
      vi.mocked(prisma.task.updateMany).mockResolvedValue({ count: 0 });

      await taskOrderingRepository.makeRoom(prisma, 1, "NEW", 2);

      expect(prisma.task.updateMany).toHaveBeenNthCalledWith(1, {
        where: { projectId: 1, status: "NEW", position: { gte: 2 } },
        data: { position: { decrement: OFFSET } },
      });

      expect(prisma.task.updateMany).toHaveBeenNthCalledWith(2, {
        where: {
          projectId: 1,
          status: "NEW",
          position: { lt: -500_000 },
        },
        data: { position: { increment: OFFSET + 1 } },
      });
    });
  });

  describe("reorderInSameColumn", () => {
    it("moves rows up when newPosition < oldPosition", async () => {
      vi.mocked(prisma.task.updateMany).mockResolvedValue({ count: 0 });

      await taskOrderingRepository.reorderInSameColumn(prisma, 1, "NEW", 5, 2);

      expect(prisma.task.updateMany).toHaveBeenCalledTimes(2);
      expect(prisma.task.updateMany).toHaveBeenNthCalledWith(1, {
        where: {
          projectId: 1,
          status: "NEW",
          position: { gte: 2, lt: 5 },
        },
        data: { position: { decrement: OFFSET } },
      });
      expect(prisma.task.updateMany).toHaveBeenNthCalledWith(2, {
        where: {
          projectId: 1,
          status: "NEW",
          position: { lt: -500_000 },
        },
        data: { position: { increment: OFFSET + 1 } },
      });
    });

    it("moves rows down when newPosition > oldPosition", async () => {
      vi.mocked(prisma.task.updateMany).mockResolvedValue({ count: 0 });

      await taskOrderingRepository.reorderInSameColumn(prisma, 1, "NEW", 2, 5);

      expect(prisma.task.updateMany).toHaveBeenCalledTimes(2);
      expect(prisma.task.updateMany).toHaveBeenNthCalledWith(1, {
        where: {
          projectId: 1,
          status: "NEW",
          position: { gt: 2, lte: 5 },
        },
        data: { position: { decrement: OFFSET } },
      });
      expect(prisma.task.updateMany).toHaveBeenNthCalledWith(2, {
        where: {
          projectId: 1,
          status: "NEW",
          position: { lt: -500_000 },
        },
        data: { position: { increment: OFFSET - 1 } },
      });
    });
  });

  describe("moveToDifferentColumn", () => {
    it("closes the gap in the source column, then makes room in the target column", async () => {
      vi.mocked(prisma.task.updateMany).mockResolvedValue({ count: 0 });

      await taskOrderingRepository.moveToDifferentColumn(
        prisma,
        1,
        "NEW",
        2,
        "IN_PROGRESS",
        1,
      );

      // closeGap (2 calls) + makeRoom (2 calls) = 4 updateMany
      expect(prisma.task.updateMany).toHaveBeenCalledTimes(4);

      // closeGap on the source column
      expect(prisma.task.updateMany).toHaveBeenNthCalledWith(1, {
        where: { projectId: 1, status: "NEW", position: { gt: 2 } },
        data: { position: { decrement: OFFSET } },
      });
      expect(prisma.task.updateMany).toHaveBeenNthCalledWith(2, {
        where: {
          projectId: 1,
          status: "NEW",
          position: { lt: -500_000 },
        },
        data: { position: { increment: OFFSET - 1 } },
      });

      // makeRoom on the target column
      expect(prisma.task.updateMany).toHaveBeenNthCalledWith(3, {
        where: { projectId: 1, status: "IN_PROGRESS", position: { gte: 1 } },
        data: { position: { decrement: OFFSET } },
      });
      expect(prisma.task.updateMany).toHaveBeenNthCalledWith(4, {
        where: {
          projectId: 1,
          status: "IN_PROGRESS",
          position: { lt: -500_000 },
        },
        data: { position: { increment: OFFSET + 1 } },
      });
    });
  });

  describe("updateTaskPosition", () => {
    it("updates a single task's position and status", async () => {
      vi.mocked(prisma.task.update).mockResolvedValue(mockTaskWithDates);

      await taskOrderingRepository.updateTaskPosition(
        prisma,
        10,
        4,
        "FINISHED",
      );

      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: 10 },
        data: { position: 4, status: "FINISHED" },
      });
    });
  });

  describe("reorder", () => {
    it("throws NotFoundError when the task does not exist", async () => {
      vi.mocked(prisma.task.findUnique).mockResolvedValue(null);

      await expect(
        taskOrderingRepository.reorder(999, 0, "NEW"),
      ).rejects.toThrow(NotFoundError);

      expect(prisma.task.update).not.toHaveBeenCalled();
      expect(prisma.task.updateMany).not.toHaveBeenCalled();
    });

    it("short-circuits when oldPosition === newPosition and column is the same", async () => {
      const task = {
        ...mockTaskWithDates,
        position: 3,
        status: "NEW" as const,
      };
      vi.mocked(prisma.task.findUnique).mockResolvedValue(task);

      const result = await taskOrderingRepository.reorder(task.id, 3, "NEW");

      expect(result).toBe(task);
      expect(prisma.task.update).not.toHaveBeenCalled();
      expect(prisma.task.updateMany).not.toHaveBeenCalled();
    });

    it("same-column reorder: stashes at -1, shifts neighbors, then lands at newPosition", async () => {
      const task = {
        ...mockTaskWithDates,
        id: 7,
        projectId: 1,
        position: 5,
        status: "NEW" as const,
      };
      vi.mocked(prisma.task.findUnique).mockResolvedValue(task);
      vi.mocked(prisma.task.update).mockResolvedValue(task);
      vi.mocked(prisma.task.updateMany).mockResolvedValue({ count: 0 });

      await taskOrderingRepository.reorder(task.id, 2, "NEW");

      // Stash to -1 first.
      expect(prisma.task.update).toHaveBeenNthCalledWith(1, {
        where: { id: 7 },
        data: { position: -1, status: "NEW" },
      });

      // Then the two-pass shift from reorderInSameColumn (move UP).
      expect(prisma.task.updateMany).toHaveBeenCalledTimes(2);
      expect(prisma.task.updateMany).toHaveBeenNthCalledWith(1, {
        where: {
          projectId: 1,
          status: "NEW",
          position: { gte: 2, lt: 5 },
        },
        data: { position: { decrement: OFFSET } },
      });

      // Finally, settle the moved task at its new position.
      expect(prisma.task.update).toHaveBeenNthCalledWith(2, {
        where: { id: 7 },
        data: { position: 2, status: "NEW" },
      });
    });

    it("cross-column reorder: stashes, closes gap, makes room, then lands at the target", async () => {
      const task = {
        ...mockTaskWithDates,
        id: 9,
        projectId: 1,
        position: 2,
        status: "NEW" as const,
      };
      vi.mocked(prisma.task.findUnique).mockResolvedValue(task);
      vi.mocked(prisma.task.update).mockResolvedValue(task);
      vi.mocked(prisma.task.updateMany).mockResolvedValue({ count: 0 });

      await taskOrderingRepository.reorder(task.id, 1, "IN_PROGRESS");

      // Stash first.
      expect(prisma.task.update).toHaveBeenNthCalledWith(1, {
        where: { id: 9 },
        data: { position: -1, status: "NEW" },
      });

      // closeGap (source) + makeRoom (target) = 4 updateMany.
      expect(prisma.task.updateMany).toHaveBeenCalledTimes(4);

      // Final landing in the target column.
      expect(prisma.task.update).toHaveBeenNthCalledWith(2, {
        where: { id: 9 },
        data: { position: 1, status: "IN_PROGRESS" },
      });
    });
  });
});
