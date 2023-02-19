-- CreateTable
CREATE TABLE "_ColaboratorsOnProject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ColaboratorsOnProject_AB_unique" ON "_ColaboratorsOnProject"("A", "B");

-- CreateIndex
CREATE INDEX "_ColaboratorsOnProject_B_index" ON "_ColaboratorsOnProject"("B");

-- AddForeignKey
ALTER TABLE "_ColaboratorsOnProject" ADD CONSTRAINT "_ColaboratorsOnProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ColaboratorsOnProject" ADD CONSTRAINT "_ColaboratorsOnProject_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
