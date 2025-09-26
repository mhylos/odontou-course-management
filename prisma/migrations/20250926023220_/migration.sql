/*
  Warnings:

  - Made the column `multiply` on table `Expenses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Expenses" ALTER COLUMN "multiply" SET NOT NULL,
ALTER COLUMN "multiply" SET DEFAULT 'manual';
