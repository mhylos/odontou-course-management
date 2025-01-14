/*
  Warnings:

  - You are about to drop the `HonorariumPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HonorariumPayment" DROP CONSTRAINT "HonorariumPayment_honorarium_fk_fkey";

-- DropTable
DROP TABLE "HonorariumPayment";

-- CreateTable
CREATE TABLE "ResponsiblePayment" (
    "id" SERIAL NOT NULL,
    "responsible_honorarium_fk" INTEGER NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "observation" TEXT NOT NULL,

    CONSTRAINT "ResponsiblePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicPayment" (
    "id" SERIAL NOT NULL,
    "academic_honorarium_fk" INTEGER NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "observation" TEXT NOT NULL,

    CONSTRAINT "AcademicPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResponsiblePayment" ADD CONSTRAINT "ResponsiblePayment_id_fkey" FOREIGN KEY ("id") REFERENCES "ResponsibleHonorarium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicPayment" ADD CONSTRAINT "AcademicPayment_id_fkey" FOREIGN KEY ("id") REFERENCES "AcademicHonorarium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
