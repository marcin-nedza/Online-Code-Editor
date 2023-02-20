/*
  Warnings:

  - You are about to drop the `_ColaboratorsOnProject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ColaboratorsOnProject" DROP CONSTRAINT "_ColaboratorsOnProject_A_fkey";

-- DropForeignKey
ALTER TABLE "_ColaboratorsOnProject" DROP CONSTRAINT "_ColaboratorsOnProject_B_fkey";

-- DropTable
DROP TABLE "_ColaboratorsOnProject";
