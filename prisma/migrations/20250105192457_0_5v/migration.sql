/*
  Warnings:

  - Made the column `serie` on table `Class` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Class" ALTER COLUMN "name" DROP DEFAULT,
ALTER COLUMN "serie" SET NOT NULL;

-- AlterTable
ALTER TABLE "ContentClass" ALTER COLUMN "contentId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserContent" ALTER COLUMN "contentId" DROP DEFAULT;
