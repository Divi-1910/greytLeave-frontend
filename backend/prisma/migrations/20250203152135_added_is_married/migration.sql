/*
  Warnings:

  - A unique constraint covering the columns `[emailAddress]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `isMarried` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "isMarried" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Employee_emailAddress_key" ON "Employee"("emailAddress");
