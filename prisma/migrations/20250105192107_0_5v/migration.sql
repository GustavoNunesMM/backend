/*
  Warnings:

  - You are about to drop the column `series` on the `Class` table. All the data in the column will be lost.
  - The primary key for the `ContentClass` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ContentId` on the `ContentClass` table. All the data in the column will be lost.
  - The primary key for the `UserContent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ContentId` on the `UserContent` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContentClass" DROP CONSTRAINT "ContentClass_ContentId_fkey";

-- DropForeignKey
ALTER TABLE "UserContent" DROP CONSTRAINT "UserContent_ContentId_fkey";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "series",
ADD COLUMN     "serie" TEXT,
ALTER COLUMN "name" SET DEFAULT 'Turma sem nome';

-- AlterTable
ALTER TABLE "ContentClass" DROP CONSTRAINT "ContentClass_pkey",
DROP COLUMN "ContentId",
ADD COLUMN     "contentId" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "ContentClass_pkey" PRIMARY KEY ("contentId", "classId");

-- AlterTable
ALTER TABLE "UserContent" DROP CONSTRAINT "UserContent_pkey",
DROP COLUMN "ContentId",
ADD COLUMN     "contentId" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "UserContent_pkey" PRIMARY KEY ("contentId", "userId");

-- AddForeignKey
ALTER TABLE "ContentClass" ADD CONSTRAINT "ContentClass_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserContent" ADD CONSTRAINT "UserContent_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
