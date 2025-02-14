-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "BUHeadId" INTEGER;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_BUHeadId_fkey" FOREIGN KEY ("BUHeadId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
