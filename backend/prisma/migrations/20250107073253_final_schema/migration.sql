/*
  Warnings:

  - The primary key for the `Country` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `countryId` on the `Country` table. All the data in the column will be lost.
  - You are about to drop the column `countryName` on the `Country` table. All the data in the column will be lost.
  - You are about to drop the column `isOptional` on the `CountryLeave` table. All the data in the column will be lost.
  - You are about to drop the column `maxDays` on the `CountryLeave` table. All the data in the column will be lost.
  - The primary key for the `Department` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `departmentId` on the `Department` table. All the data in the column will be lost.
  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `email` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `employeeId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `employeeType` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `joinDate` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `noticePeriod` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `totalLeaves` on the `Employee` table. All the data in the column will be lost.
  - The primary key for the `Holiday` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `Holiday` table. All the data in the column will be lost.
  - You are about to drop the column `holidayId` on the `Holiday` table. All the data in the column will be lost.
  - The primary key for the `LeaveRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `leaveDays` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `leaveRequestId` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `proofRequired` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `proofSubmitted` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `carryForward` on the `LeaveType` table. All the data in the column will be lost.
  - You are about to drop the column `maxDays` on the `LeaveType` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Country` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[employeeCode]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[emailAddress]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Country` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateOfJoining` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emailAddress` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeCode` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employmentType` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `holidayDate` to the `Holiday` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leavePeriod` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestedLeaveDays` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isOptional` to the `LeaveType` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LeavePeriod" AS ENUM ('FullDay', 'HalfDay', 'Mixed');

-- DropForeignKey
ALTER TABLE "CountryLeave" DROP CONSTRAINT "CountryLeave_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_countryId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_managerId_fkey";

-- DropForeignKey
ALTER TABLE "Holiday" DROP CONSTRAINT "Holiday_countryId_fkey";

-- DropForeignKey
ALTER TABLE "LeaveRequest" DROP CONSTRAINT "LeaveRequest_employeeId_fkey";

-- DropIndex
DROP INDEX "Country_countryId_idx";

-- DropIndex
DROP INDEX "Country_countryName_key";

-- DropIndex
DROP INDEX "Department_departmentId_idx";

-- DropIndex
DROP INDEX "Employee_email_key";

-- AlterTable
ALTER TABLE "Country" DROP CONSTRAINT "Country_pkey",
DROP COLUMN "countryId",
DROP COLUMN "countryName",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD CONSTRAINT "Country_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "CountryLeave" DROP COLUMN "isOptional",
DROP COLUMN "maxDays";

-- AlterTable
ALTER TABLE "Department" DROP CONSTRAINT "Department_pkey",
DROP COLUMN "departmentId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Department_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
DROP COLUMN "email",
DROP COLUMN "employeeId",
DROP COLUMN "employeeType",
DROP COLUMN "joinDate",
DROP COLUMN "name",
DROP COLUMN "noticePeriod",
DROP COLUMN "totalLeaves",
ADD COLUMN     "annualLeaves" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "businessUnitHeadId" TEXT,
ADD COLUMN     "dateOfJoining" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "emailAddress" TEXT NOT NULL,
ADD COLUMN     "employeeCode" TEXT NOT NULL,
ADD COLUMN     "employmentType" VARCHAR(250) NOT NULL,
ADD COLUMN     "fullName" VARCHAR(255) NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "isOnNoticePeriod" BOOLEAN NOT NULL DEFAULT false,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Holiday" DROP CONSTRAINT "Holiday_pkey",
DROP COLUMN "date",
DROP COLUMN "holidayId",
ADD COLUMN     "holidayDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Holiday_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LeaveRequest" DROP CONSTRAINT "LeaveRequest_pkey",
DROP COLUMN "leaveDays",
DROP COLUMN "leaveRequestId",
DROP COLUMN "proofRequired",
DROP COLUMN "proofSubmitted",
ADD COLUMN     "documentLink" TEXT,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "leavePeriod" "LeavePeriod" NOT NULL,
ADD COLUMN     "requestedLeaveDays" DOUBLE PRECISION NOT NULL,
ADD CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LeaveType" DROP COLUMN "carryForward",
DROP COLUMN "maxDays",
ADD COLUMN     "canCarryForward" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isOptional" BOOLEAN NOT NULL,
ADD COLUMN     "maxAllowedDays" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Country_name_key" ON "Country"("name");

-- CreateIndex
CREATE INDEX "Country_id_idx" ON "Country"("id");

-- CreateIndex
CREATE INDEX "Department_id_idx" ON "Department"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeCode_key" ON "Employee"("employeeCode");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_emailAddress_key" ON "Employee"("emailAddress");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_businessUnitHeadId_fkey" FOREIGN KEY ("businessUnitHeadId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryLeave" ADD CONSTRAINT "CountryLeave_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Holiday" ADD CONSTRAINT "Holiday_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;
