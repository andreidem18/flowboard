/*
  Warnings:

  - A unique constraint covering the columns `[projectId,status,position]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tasks_projectId_status_position_key" ON "tasks"("projectId", "status", "position");
