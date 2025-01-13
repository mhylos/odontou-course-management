/*
  Warnings:

  - The primary key for the `Honorarium` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `function` on the `Honorarium` table. All the data in the column will be lost.
  - You are about to drop the column `hours` on the `Honorarium` table. All the data in the column will be lost.
  - You are about to drop the column `participation_fk` on the `Honorarium` table. All the data in the column will be lost.
  - You are about to drop the column `percentage` on the `Honorarium` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ResponsibleFuntions" AS ENUM ('director', 'coordinator');

-- CreateEnum
CREATE TYPE "AcademicFuntions" AS ENUM ('instructor', 'tutor');

-- DropForeignKey
ALTER TABLE "Honorarium" DROP CONSTRAINT "Honorarium_participation_fk_fkey";

-- AlterTable
ALTER TABLE "Honorarium" DROP CONSTRAINT "Honorarium_pkey",
DROP COLUMN "function",
DROP COLUMN "hours",
DROP COLUMN "participation_fk",
DROP COLUMN "percentage",
ADD CONSTRAINT "Honorarium_pkey" PRIMARY KEY ("course_fk", "academic_fk");

-- DropEnum
DROP TYPE "FunctionTypes";

-- CreateTable
CREATE TABLE "ResponsibleHonorarium" (
    "id" SERIAL NOT NULL,
    "honorarium_fk" INTEGER NOT NULL,
    "percentage" DECIMAL(6,3) NOT NULL DEFAULT 0,
    "function" "ResponsibleFuntions" NOT NULL,

    CONSTRAINT "ResponsibleHonorarium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicHonorarium" (
    "id" SERIAL NOT NULL,
    "honorarium_fk" INTEGER NOT NULL,
    "participation_fk" INTEGER NOT NULL,
    "hours" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "function" "AcademicFuntions" NOT NULL,

    CONSTRAINT "AcademicHonorarium_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResponsibleHonorarium" ADD CONSTRAINT "ResponsibleHonorarium_honorarium_fk_fkey" FOREIGN KEY ("honorarium_fk") REFERENCES "Honorarium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicHonorarium" ADD CONSTRAINT "AcademicHonorarium_honorarium_fk_fkey" FOREIGN KEY ("honorarium_fk") REFERENCES "Honorarium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicHonorarium" ADD CONSTRAINT "AcademicHonorarium_participation_fk_fkey" FOREIGN KEY ("participation_fk") REFERENCES "Participation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
