/*
  Warnings:

  - Changed the type of `permissionLevel` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PermissionLevel" AS ENUM ('PROFESSOR', 'ALUNO', 'SUPERVISAO', 'ADMINISTRACAO');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "permissionLevel",
ADD COLUMN     "permissionLevel" "PermissionLevel" NOT NULL;
