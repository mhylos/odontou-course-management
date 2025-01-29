-- CreateEnum
CREATE TYPE "Genres" AS ENUM ('femenino', 'masculino');

-- CreateEnum
CREATE TYPE "EnrollTypes" AS ENUM ('convenio', 'autofinanciado', 'becado');

-- CreateEnum
CREATE TYPE "MultiplierTypes" AS ENUM ('percentage', 'unit_cost');

-- CreateEnum
CREATE TYPE "MultiplyWith" AS ENUM ('students_enrolled', 'enroll_incomes', 'elearning_incomes');

-- CreateEnum
CREATE TYPE "ResponsibleFunctions" AS ENUM ('director', 'coordinator');

-- CreateEnum
CREATE TYPE "AcademicFunctions" AS ENUM ('instructor', 'tutor');

-- CreateEnum
CREATE TYPE "Actions" AS ENUM ('create', 'update', 'delete', 'login', 'logout');

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "enroll_value" INTEGER NOT NULL,
    "direct_hours" DECIMAL(5,2) NOT NULL,
    "indirect_hours" DECIMAL(5,2) NOT NULL,
    "inperson_hours" DECIMAL(5,2) NOT NULL,
    "online_hours" DECIMAL(5,2) NOT NULL,
    "name" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "additional_comments" TEXT,
    "date_from" TIMESTAMP(3) NOT NULL,
    "date_to" TIMESTAMP(3) NOT NULL,
    "department_fk" INTEGER NOT NULL,
    "program_fk" INTEGER NOT NULL,
    "course_director_fk" INTEGER NOT NULL,
    "coordinator_fk" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distribution" (
    "id" SERIAL NOT NULL,
    "course_fk" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "percentage" DECIMAL(6,3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Distribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Income" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "course_fk" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "comment" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "rut" INTEGER NOT NULL,
    "genre" "Genres",
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("rut")
);

-- CreateTable
CREATE TABLE "PaymentTypes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PaymentTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refund" (
    "id" SERIAL NOT NULL,
    "enrolled_fk" INTEGER NOT NULL,
    "refund_date" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "observation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrolled" (
    "id" SERIAL NOT NULL,
    "student_fk" INTEGER NOT NULL,
    "course_fk" INTEGER NOT NULL,
    "payment_type_fk" INTEGER,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "discount" DECIMAL(6,3) NOT NULL DEFAULT 0,
    "ticket_num" INTEGER,
    "payment_date" TIMESTAMP(3),
    "total" INTEGER NOT NULL,
    "observation" TEXT NOT NULL,
    "installments" INTEGER DEFAULT 1,
    "paid" INTEGER DEFAULT 0,
    "file" TEXT,
    "enroll_type" "EnrollTypes" NOT NULL DEFAULT 'autofinanciado',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enrolled_pkey" PRIMARY KEY ("student_fk","course_fk")
);

-- CreateTable
CREATE TABLE "Expenses" (
    "id" SERIAL NOT NULL,
    "course_fk" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MultiplierTypes" NOT NULL,
    "multiplier" DECIMAL(10,2) NOT NULL,
    "multiply" "MultiplyWith",
    "amount" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "director_fk" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HierarchyTypes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "HierarchyTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponsiblePayment" (
    "id" SERIAL NOT NULL,
    "responsible_honorarium_fk" INTEGER NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "next_payment_date" TIMESTAMP(3) NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "amount" INTEGER NOT NULL,
    "observation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResponsiblePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicPayment" (
    "id" SERIAL NOT NULL,
    "academic_honorarium_fk" INTEGER NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "next_payment_date" TIMESTAMP(3) NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "amount" INTEGER NOT NULL,
    "observation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponsibleHonorarium" (
    "id" SERIAL NOT NULL,
    "honorarium_fk" INTEGER NOT NULL,
    "percentage" DECIMAL(6,3) NOT NULL DEFAULT 0,
    "function" "ResponsibleFunctions" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResponsibleHonorarium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicHonorarium" (
    "id" SERIAL NOT NULL,
    "honorarium_fk" INTEGER NOT NULL,
    "participation_fk" INTEGER NOT NULL,
    "hours" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "function" "AcademicFunctions" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicHonorarium_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Honorarium" (
    "id" SERIAL NOT NULL,
    "course_fk" INTEGER NOT NULL,
    "academic_fk" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Honorarium_pkey" PRIMARY KEY ("course_fk","academic_fk")
);

-- CreateTable
CREATE TABLE "Participation" (
    "id" SERIAL NOT NULL,
    "academic_fk" INTEGER NOT NULL,
    "course_fk" INTEGER NOT NULL,
    "hierarchy_type_fk" INTEGER NOT NULL,
    "dedicated_hours" INTEGER,
    "contract_hours" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participation_pkey" PRIMARY KEY ("academic_fk","course_fk")
);

-- CreateTable
CREATE TABLE "Academic" (
    "user_fk" INTEGER NOT NULL,
    "department_fk" INTEGER NOT NULL,
    "isFOUCH" BOOLEAN NOT NULL,
    "phone" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Academic_pkey" PRIMARY KEY ("user_fk")
);

-- CreateTable
CREATE TABLE "Administrator" (
    "user_fk" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Administrator_pkey" PRIMARY KEY ("user_fk")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "rut" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "email_verified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logger" (
    "id" SERIAL NOT NULL,
    "user_fk" TEXT NOT NULL,
    "action" "Actions" NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Logger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateIndex
CREATE UNIQUE INDEX "Distribution_name_course_fk_key" ON "Distribution"("name", "course_fk");

-- CreateIndex
CREATE UNIQUE INDEX "Income_name_course_fk_key" ON "Income"("name", "course_fk");

-- CreateIndex
CREATE UNIQUE INDEX "Enrolled_id_key" ON "Enrolled"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Expenses_name_course_fk_key" ON "Expenses"("name", "course_fk");

-- CreateIndex
CREATE UNIQUE INDEX "ResponsibleHonorarium_honorarium_fk_function_key" ON "ResponsibleHonorarium"("honorarium_fk", "function");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicHonorarium_honorarium_fk_participation_fk_function_key" ON "AcademicHonorarium"("honorarium_fk", "participation_fk", "function");

-- CreateIndex
CREATE UNIQUE INDEX "Honorarium_id_key" ON "Honorarium"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Participation_id_key" ON "Participation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_rut_key" ON "User"("rut");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_program_fk_fkey" FOREIGN KEY ("program_fk") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_department_fk_fkey" FOREIGN KEY ("department_fk") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_course_director_fk_fkey" FOREIGN KEY ("course_director_fk") REFERENCES "User"("rut") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_coordinator_fk_fkey" FOREIGN KEY ("coordinator_fk") REFERENCES "User"("rut") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Distribution" ADD CONSTRAINT "Distribution_course_fk_fkey" FOREIGN KEY ("course_fk") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_course_fk_fkey" FOREIGN KEY ("course_fk") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_enrolled_fk_fkey" FOREIGN KEY ("enrolled_fk") REFERENCES "Enrolled"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrolled" ADD CONSTRAINT "Enrolled_student_fk_fkey" FOREIGN KEY ("student_fk") REFERENCES "Student"("rut") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrolled" ADD CONSTRAINT "Enrolled_course_fk_fkey" FOREIGN KEY ("course_fk") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrolled" ADD CONSTRAINT "Enrolled_payment_type_fk_fkey" FOREIGN KEY ("payment_type_fk") REFERENCES "PaymentTypes"("id") ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_course_fk_fkey" FOREIGN KEY ("course_fk") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_director_fk_fkey" FOREIGN KEY ("director_fk") REFERENCES "User"("rut") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsiblePayment" ADD CONSTRAINT "ResponsiblePayment_responsible_honorarium_fk_fkey" FOREIGN KEY ("responsible_honorarium_fk") REFERENCES "ResponsibleHonorarium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicPayment" ADD CONSTRAINT "AcademicPayment_academic_honorarium_fk_fkey" FOREIGN KEY ("academic_honorarium_fk") REFERENCES "AcademicHonorarium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponsibleHonorarium" ADD CONSTRAINT "ResponsibleHonorarium_honorarium_fk_fkey" FOREIGN KEY ("honorarium_fk") REFERENCES "Honorarium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicHonorarium" ADD CONSTRAINT "AcademicHonorarium_honorarium_fk_fkey" FOREIGN KEY ("honorarium_fk") REFERENCES "Honorarium"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicHonorarium" ADD CONSTRAINT "AcademicHonorarium_participation_fk_fkey" FOREIGN KEY ("participation_fk") REFERENCES "Participation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Honorarium" ADD CONSTRAINT "Honorarium_course_fk_fkey" FOREIGN KEY ("course_fk") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Honorarium" ADD CONSTRAINT "Honorarium_academic_fk_fkey" FOREIGN KEY ("academic_fk") REFERENCES "Academic"("user_fk") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_academic_fk_fkey" FOREIGN KEY ("academic_fk") REFERENCES "Academic"("user_fk") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_course_fk_fkey" FOREIGN KEY ("course_fk") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_hierarchy_type_fk_fkey" FOREIGN KEY ("hierarchy_type_fk") REFERENCES "HierarchyTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Academic" ADD CONSTRAINT "Academic_department_fk_fkey" FOREIGN KEY ("department_fk") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Academic" ADD CONSTRAINT "Academic_user_fk_fkey" FOREIGN KEY ("user_fk") REFERENCES "User"("rut") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administrator" ADD CONSTRAINT "Administrator_user_fk_fkey" FOREIGN KEY ("user_fk") REFERENCES "User"("rut") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logger" ADD CONSTRAINT "Logger_user_fk_fkey" FOREIGN KEY ("user_fk") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
