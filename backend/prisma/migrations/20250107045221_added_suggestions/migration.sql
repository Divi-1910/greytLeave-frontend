/*
  Warnings:

  - You are about to drop the column `leaveType` on the `LeaveRequest` table. All the data in the column will be lost.
  - Added the required column `leaveDays` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leaveTypeId` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proofRequired` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "carryForwarded" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "noticePeriod" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "probationEndDate" TIMESTAMP(3),
ALTER COLUMN "totalLeaves" SET DEFAULT 0,
ALTER COLUMN "remainingLeaves" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "LeaveRequest" DROP COLUMN "leaveType",
ADD COLUMN     "leaveDays" INTEGER NOT NULL,
ADD COLUMN     "leaveTypeId" INTEGER NOT NULL,
ADD COLUMN     "proofRequired" BOOLEAN NOT NULL,
ADD COLUMN     "proofSubmitted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "LeaveType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(250),
    "maxDays" INTEGER,
    "requiresProof" BOOLEAN NOT NULL DEFAULT false,
    "carryForward" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "LeaveType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountryLeave" (
    "id" SERIAL NOT NULL,
    "countryId" INTEGER NOT NULL,
    "leaveTypeId" INTEGER NOT NULL,
    "maxDays" INTEGER NOT NULL,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CountryLeave_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeaveType_name_key" ON "LeaveType"("name");

-- CreateIndex
CREATE INDEX "LeaveType_id_idx" ON "LeaveType"("id");

-- CreateIndex
CREATE INDEX "LeaveRequest_leaveTypeId_idx" ON "LeaveRequest"("leaveTypeId");

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES "LeaveType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryLeave" ADD CONSTRAINT "CountryLeave_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("countryId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CountryLeave" ADD CONSTRAINT "CountryLeave_leaveTypeId_fkey" FOREIGN KEY ("leaveTypeId") REFERENCES "LeaveType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
