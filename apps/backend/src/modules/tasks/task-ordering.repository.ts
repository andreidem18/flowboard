import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@repo/shared";
import { NotFoundError } from "elysia";
import { Prisma } from "generated/prisma/client";

export const taskOrderingRepository = {
  async reorder(id: number, newPosition: number, newStatus: TaskStatus) {
    return prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({
        where: { id },
      });

      if (!task) {
        throw new NotFoundError("Task not found");
      }

      const { projectId, status: oldStatus, position: oldPosition } = task;

      const isSameColumn = oldStatus === newStatus;

      const noChanges = isSameColumn && oldPosition === newPosition;

      if (noChanges) {
        return task;
      }

      // temporarily move the task to a position that won't interfere with the reordering
      await this.updateTaskPosition(tx, id, -1, oldStatus);

      if (isSameColumn) {
        await this.reorderInSameColumn(
          tx,
          projectId,
          oldStatus,
          oldPosition,
          newPosition,
        );
      } else {
        await this.moveToDifferentColumn(
          tx,
          projectId,
          oldStatus,
          oldPosition,
          newStatus,
          newPosition,
        );
      }

      return this.updateTaskPosition(tx, id, newPosition, newStatus);
    });
  },

  async reorderInSameColumn(
    tx: Prisma.TransactionClient,
    projectId: number,
    status: TaskStatus,
    oldPosition: number,
    newPosition: number,
  ) {
    if (newPosition < oldPosition) {
      // Move UP: rows in [newPosition, oldPosition) shift up by 1
      await this.shiftPositions(
        tx,
        { projectId, status, position: { gte: newPosition, lt: oldPosition } },
        +1,
      );
    } else {
      // Move DOWN: rows in (oldPosition, newPosition] shift down by 1
      await this.shiftPositions(
        tx,
        { projectId, status, position: { gt: oldPosition, lte: newPosition } },
        -1,
      );
    }
  },

  async moveToDifferentColumn(
    tx: Prisma.TransactionClient,
    projectId: number,
    oldStatus: TaskStatus,
    oldPosition: number,
    newStatus: TaskStatus,
    newPosition: number,
  ) {
    await this.closeGap(tx, projectId, oldStatus, oldPosition);

    await this.makeRoom(tx, projectId, newStatus, newPosition);
  },

  async closeGap(
    tx: Prisma.TransactionClient,
    projectId: number,
    status: TaskStatus,
    position: number,
  ) {
    await this.shiftPositions(
      tx,
      { projectId, status, position: { gt: position } },
      -1,
    );
  },

  async makeRoom(
    tx: Prisma.TransactionClient,
    projectId: number,
    status: TaskStatus,
    position: number,
  ) {
    await this.shiftPositions(
      tx,
      { projectId, status, position: { gte: position } },
      +1,
    );
  },

  // Shifts `position` of every row matching `where` by `delta` (±1) without
  // tripping the UNIQUE (projectId, status, position) index. Pass 1 parks the
  // affected rows in a far-negative range, disjoint from both the active range
  // and the -1 stash used by `reorder`; pass 2 brings them back at the target
  // positions. Net effect equals `delta` with no colliding intermediate state.
  async shiftPositions(
    tx: Prisma.TransactionClient,
    where: Prisma.TaskWhereInput,
    delta: 1 | -1,
  ) {
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

  updateTaskPosition(
    tx: Prisma.TransactionClient,
    id: number,
    position: number,
    status: TaskStatus,
  ) {
    return tx.task.update({
      where: { id },
      data: {
        position,
        status,
      },
    });
  },
};
