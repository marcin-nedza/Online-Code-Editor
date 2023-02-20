-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACCEPTED', 'REJECTED', 'PENDING');

-- CreateTable
CREATE TABLE "ColaboratorsOnProject" (
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "ColaboratorsOnProject_pkey" PRIMARY KEY ("userId","projectId")
);

-- AddForeignKey
ALTER TABLE "ColaboratorsOnProject" ADD CONSTRAINT "ColaboratorsOnProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColaboratorsOnProject" ADD CONSTRAINT "ColaboratorsOnProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
