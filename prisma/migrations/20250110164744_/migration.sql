/*
  Warnings:

  - A unique constraint covering the columns `[honorarium_fk,participation_fk,function]` on the table `AcademicHonorarium` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[honorarium_fk,function]` on the table `ResponsibleHonorarium` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `function` on the `AcademicHonorarium` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `function` on the `ResponsibleHonorarium` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ResponsibleFunctions" AS ENUM ('director', 'coordinator');

-- CreateEnum
CREATE TYPE "AcademicFunctions" AS ENUM ('instructor', 'tutor');

-- AlterTable
ALTER TABLE "AcademicHonorarium" DROP COLUMN "function",
ADD COLUMN     "function" "AcademicFunctions" NOT NULL;

-- AlterTable
ALTER TABLE "ResponsibleHonorarium" DROP COLUMN "function",
ADD COLUMN     "function" "ResponsibleFunctions" NOT NULL;

-- DropEnum
DROP TYPE "AcademicFuntions";

-- DropEnum
DROP TYPE "ResponsibleFuntions";

-- CreateIndex
CREATE UNIQUE INDEX "AcademicHonorarium_honorarium_fk_participation_fk_function_key" ON "AcademicHonorarium"("honorarium_fk", "participation_fk", "function");

-- CreateIndex
CREATE UNIQUE INDEX "ResponsibleHonorarium_honorarium_fk_function_key" ON "ResponsibleHonorarium"("honorarium_fk", "function");
