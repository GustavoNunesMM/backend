/*
  Warnings:

  - You are about to drop the `_ClassContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ContentUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_teacherId_fkey";

-- DropForeignKey
ALTER TABLE "_ClassContent" DROP CONSTRAINT "_ClassContent_A_fkey";

-- DropForeignKey
ALTER TABLE "_ClassContent" DROP CONSTRAINT "_ClassContent_B_fkey";

-- DropForeignKey
ALTER TABLE "_ContentUser" DROP CONSTRAINT "_ContentUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContentUser" DROP CONSTRAINT "_ContentUser_B_fkey";

-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "teacherId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "contato" TEXT,
ADD COLUMN     "endereco" TEXT;

-- DropTable
DROP TABLE "_ClassContent";

-- DropTable
DROP TABLE "_ContentUser";

-- CreateTable
CREATE TABLE "ContentClass" (
    "ContentId" INTEGER NOT NULL,
    "classId" INTEGER NOT NULL,

    CONSTRAINT "ContentClass_pkey" PRIMARY KEY ("ContentId","classId")
);

-- CreateTable
CREATE TABLE "UserContent" (
    "ContentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserContent_pkey" PRIMARY KEY ("ContentId","userId")
);

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentClass" ADD CONSTRAINT "ContentClass_ContentId_fkey" FOREIGN KEY ("ContentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentClass" ADD CONSTRAINT "ContentClass_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserContent" ADD CONSTRAINT "UserContent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserContent" ADD CONSTRAINT "UserContent_ContentId_fkey" FOREIGN KEY ("ContentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
