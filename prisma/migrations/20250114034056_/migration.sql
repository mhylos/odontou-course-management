/*
  Warnings:

  - Added the required column `next_payment_date` to the `AcademicPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `next_payment_date` to the `ResponsiblePayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AcademicPayment" ADD COLUMN     "next_payment_date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ResponsiblePayment" ADD COLUMN     "next_payment_date" TIMESTAMP(3) NOT NULL;
