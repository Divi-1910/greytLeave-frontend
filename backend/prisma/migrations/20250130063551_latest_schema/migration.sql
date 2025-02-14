/*
  Warnings:

  - Added the required column `has_children` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "has_children" BOOLEAN NOT NULL;
