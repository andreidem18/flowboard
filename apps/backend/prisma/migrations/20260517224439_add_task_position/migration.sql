/*
  Warnings:

  - Added the required column `position` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tasks" ADD COLUMN     "position" INTEGER;

WITH ranked_tasks AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY status, "projectId"
      ORDER BY "createdAt"
    ) AS new_position
  FROM "tasks"
)
UPDATE "tasks"
SET "position" = ranked_tasks.new_position
FROM ranked_tasks
WHERE "tasks".id = ranked_tasks.id;

ALTER TABLE "tasks"
ALTER COLUMN "position" SET NOT NULL;
