import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@repo/shared";
import { NotFoundError } from "elysia";
import { Prisma } from "generated/prisma/client";

export const taskOrderingRepository = {
  async reorder({ id, newPosition, newStatus }: ReorderParams) {
    return prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({ where: { id } });

      if (!task) throw new NotFoundError("Task not found");

      const { projectId, status: oldStatus, position: oldPosition } = task;
      const isSameColumn = oldStatus === newStatus;
      const noChanges = isSameColumn && oldPosition === newPosition;

      if (noChanges) return task;

      const stashPosition = -(id + 1);

      await this.updateTaskPosition({
        tx,
        id,
        position: stashPosition,
        status: oldStatus,
      });

      if (isSameColumn) {
        await this.reorderInSameColumn({
          tx,
          projectId,
          status: oldStatus,
          oldPosition,
          newPosition,
        });
      } else {
        await this.moveToDifferentColumn({
          tx,
          projectId,
          oldStatus,
          oldPosition,
          newStatus,
          newPosition,
        });
      }

      return this.updateTaskPosition({
        tx,
        id,
        position: newPosition,
        status: newStatus,
      });
    });
  },

  async reorderInSameColumn({
    tx,
    projectId,
    status,
    oldPosition,
    newPosition,
  }: ReorderInSameColumnParams) {
    if (newPosition < oldPosition) {
      await this.shiftPositions({
        tx,
        where: {
          projectId,
          status,
          position: { gte: newPosition, lt: oldPosition },
        },
        delta: +1,
      });
    } else {
      await this.shiftPositions({
        tx,
        where: {
          projectId,
          status,
          position: { gt: oldPosition, lte: newPosition },
        },
        delta: -1,
      });
    }
  },

  async moveToDifferentColumn({
    tx,
    projectId,
    oldStatus,
    oldPosition,
    newStatus,
    newPosition,
  }: MoveToDifferentColumnParams) {
    await this.closeGap({
      tx,
      projectId,
      status: oldStatus,
      position: oldPosition,
    });
    await this.makeRoom({
      tx,
      projectId,
      status: newStatus,
      position: newPosition,
    });
  },

  async closeGap({ tx, projectId, status, position }: ColumnShiftParams) {
    await this.shiftPositions({
      tx,
      where: { projectId, status, position: { gt: position } },
      delta: -1,
    });
  },

  async makeRoom({ tx, projectId, status, position }: ColumnShiftParams) {
    await this.shiftPositions({
      tx,
      where: { projectId, status, position: { gte: position } },
      delta: +1,
    });
  },

  // Shifts `position` of every row matching `where` by `delta` (±1) without
  // tripping the UNIQUE (projectId, status, position) index. Pass 1 parks the
  // affected rows in a far-negative range, disjoint from both the active range
  // and the -1 stash used by `reorder`; pass 2 brings them back at the target
  // positions. Net effect equals `delta` with no colliding intermediate state.
  async shiftPositions({ tx, where, delta }: ShiftPositionsParams) {
    const OFFSET = 1_000_000;

    await tx.task.updateMany({
      where,
      data: { position: { decrement: OFFSET } },
    });
    await tx.task.updateMany({
      where: { ...where, position: { lt: -500_000 } },
      data: { position: { increment: OFFSET + delta } },
    });
  },

  updateTaskPosition({ tx, id, position, status }: UpdateTaskPositionParams) {
    return tx.task.update({ where: { id }, data: { position, status } });
  },
};

interface UpdateTaskPositionParams {
  tx: Prisma.TransactionClient;
  id: number;
  position: number;
  status: TaskStatus;
}

interface ReorderParams {
  id: number;
  newPosition: number;
  newStatus: TaskStatus;
}

interface ReorderInSameColumnParams {
  tx: Prisma.TransactionClient;
  projectId: number;
  status: TaskStatus;
  oldPosition: number;
  newPosition: number;
}

interface MoveToDifferentColumnParams {
  tx: Prisma.TransactionClient;
  projectId: number;
  oldStatus: TaskStatus;
  oldPosition: number;
  newStatus: TaskStatus;
  newPosition: number;
}

interface ColumnShiftParams {
  tx: Prisma.TransactionClient;
  projectId: number;
  status: TaskStatus;
  position: number;
}

interface ShiftPositionsParams {
  tx: Prisma.TransactionClient;
  where: Prisma.TaskWhereInput;
  delta: 1 | -1;
}
