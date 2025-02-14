/*
  Warnings:

  - Added the required column `Gender` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "Gender" "Gender" NOT NULL;
