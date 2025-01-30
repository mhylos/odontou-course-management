/*
  Warnings:

  - You are about to drop the column `file` on the `Enrolled` table. All the data in the column will be lost.
  - You are about to drop the `Refund` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Refund" DROP CONSTRAINT "Refund_enrolled_fk_fkey";

-- AlterTable
ALTER TABLE "Enrolled" DROP COLUMN "file",
ADD COLUMN     "refund" BOOLEAN DEFAULT false;

-- DropTable
DROP TABLE "Refund";
