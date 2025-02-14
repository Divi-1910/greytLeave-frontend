/*
  Warnings:

  - You are about to drop the column `annualLeaves` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `businessUnitHeadId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `carryForwarded` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `remainingLeaves` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `usedLeaves` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Holiday` table. All the data in the column will be lost.
  - You are about to drop the column `holidayDate` on the `Holiday` table. All the data in the column will be lost.
  - You are about to drop the column `documentLink` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `leaveTypeId` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `requestedLeaveDays` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `canCarryForward` on the `LeaveType` table. All the data in the column will be lost.
  - You are about to drop the column `isOptional` on the `LeaveType` table. All the data in the column will be lost.
  - You are about to drop the column `maxAllowedDays` on the `LeaveType` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CountryLeave` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `Country` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Country` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Country` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `Holiday` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Holiday` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Holiday` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leavePolicyId` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestedNumberOfDays` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `LeaveType` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CountryLeave" DROP CONSTRAINT "CountryLeave_countryId_fkey";

-- DropForeignKey
ALTER TABLE "CountryLeave" DROP CONSTRAINT "CountryLeave_leaveTypeId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_businessUnitHeadId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_roleId_fkey";

-- DropForeignKey
ALTER TABLE "LeaveRequest" DROP CONSTRAINT "LeaveRequest_leaveTypeId_fkey";

-- DropIndex
DROP INDEX "Country_id_idx";

-- DropIndex
DROP INDEX "Department_id_idx";

-- DropIndex
DROP INDEX "LeaveRequest_leaveTypeId_idx";

-- DropIndex
DROP INDEX "LeaveType_id_idx";

-- AlterTable
ALTER TABLE "Country" ADD COLUMN     "code" VARCHAR(3) NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "annualLeaves",
DROP COLUMN "businessUnitHeadId",
DROP COLUMN "carryForwarded",
DROP COLUMN "remainingLeaves",
DROP COLUMN "usedLeaves",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "roleId" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Holiday" DROP COLUMN "description",
DROP COLUMN "holidayDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "name" VARCHAR(200) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "LeaveRequest" DROP COLUMN "documentLink",
DROP COLUMN "leaveTypeId",
DROP COLUMN "requestedLeaveDays",
ADD COLUMN     "approvalDate" TIMESTAMP(3),
ADD COLUMN     "approvedById" INTEGER,
ADD COLUMN     "leavePolicyId" INTEGER NOT NULL,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "requestedNumberOfDays" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "supportingDoc" TEXT;

-- AlterTable
ALTER TABLE "LeaveType" DROP COLUMN "canCarryForward",
DROP COLUMN "isOptional",
DROP COLUMN "maxAllowedDays",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "CountryLeave";

-- CreateTable
CREATE TABLE "LeaveBalance" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "entitledDays" DOUBLE PRECISION NOT NULL,
    "usedDays" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "remainingDays" DOUBLE PRECISION NOT NULL,
    "carryForwardDays" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "employeeId" INTEGER NOT NULL,
    "leavePolicyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeavePolicy" (
    "id" SERIAL NOT NULL,
    "allowedDays" INTEGER NOT NULL,
    "maxCarryForward" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "countryId" INTEGER NOT NULL,
    "leaveTypeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeavePolicy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeaveBalance_employeeId_idx" ON "LeaveBalance"("employeeId");

-- CreateIndex
CREATE INDEX "LeaveBalance_leavePolicyId_idx" ON "LeaveBalance"("leavePolicyId");

-- CreateIndex
CREATE UNIQUE INDEX "LeaveBalance_employeeId_leavePolicyId_year_key" ON "LeaveBalance"("employeeId", "leavePolicyId", "year");

-- CreateIndex
CREATE INDEX "LeavePolicy_countryId_idx" ON "LeavePolicy"("countryId");

-- CreateIndex
CREATE INDEX "LeavePolicy_leaveTypeId_idx" ON "LeavePolicy"("leaveTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "LeavePolicy_countryId_leaveTypeId_key" ON "LeavePolicy"("countryId", "leaveTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "Country_code_key" ON "Country"("code");

-- CreateIndex
CREATE INDEX "Employee_managerId_idx" ON "Employee"("managerId");

-- CreateIndex
CREATE INDEX "Employee_isActive_idx" ON "Employee"("isActive");

-- CreateIndex
CREATE INDEX "Holiday_date_idx" ON "Holiday"("date");

-- CreateIndex
CREATE INDEX "LeaveRequest_leavePolicyId_idx" ON "LeaveRequest"("leavePolicyId");

-- CreateIndex
CREATE INDEX "LeaveRequest_approvedById_idx" ON "LeaveRequest"("approvedById");

-- CreateIndex
CREATE INDEX "LeaveRequest_status_idx" ON "LeaveRequest"("status");

-- CreateIndex
CREATE INDEX "LeaveRequest_startDate_endDate_idx" ON "LeaveRequest"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "LeaveType_isActive_idx" ON "LeaveType"("isActive");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveBalance" ADD CONSTRAINT "LeaveBalance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveBalance" ADD CONSTRAINT "LeaveBalance_leavePolicyId_fkey" FOREIGN KEY ("leavePolicyId") REFERENCES "LeavePolicy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_leavePolicyId_fkey" FOREIGN KEY ("leavePolicyId") REFERENCES "LeavePolicy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeavePolicy" ADD CONSTRAINT "LeavePolicy_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeavePolicy" ADD CONSTRAINT "LeavePolicy_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES "LeaveType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
