-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "enroll_value" INTEGER NOT NULL,
    "direct_hours" DOUBLE PRECISION NOT NULL,
    "indirect_hours" DOUBLE PRECISION NOT NULL,
    "inperson_hours" DOUBLE PRECISION NOT NULL,
    "online_hours" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "additional_comments" TEXT NOT NULL,
    "date_from" TIMESTAMP(3) NOT NULL,
    "date_to" TIMESTAMP(3) NOT NULL,
    "hour_value" INTEGER NOT NULL,
    "department_fk" INTEGER NOT NULL,
    "program_fk" INTEGER NOT NULL,
    "course_director_fk" INTEGER NOT NULL,
    "coordinator_fk" INTEGER NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "rut" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("rut")
);

-- CreateTable
CREATE TABLE "Enrolled" (
    "student_fk" INTEGER NOT NULL,
    "course_fk" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "payment_type" TEXT NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "ticket_num" INTEGER,
    "payment_date" TIMESTAMP(3),
    "total" INTEGER NOT NULL,
    "observation" TEXT NOT NULL,

    CONSTRAINT "Enrolled_pkey" PRIMARY KEY ("student_fk","course_fk")
);

-- CreateTable
CREATE TABLE "Expenses" (
    "course_fk" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "unit_value" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "Expenses_pkey" PRIMARY KEY ("name","course_fk")
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

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Manages" (
    "academic_fk" INTEGER NOT NULL,
    "course_fk" INTEGER NOT NULL,
    "dedicated_hours" INTEGER NOT NULL,
    "contract_hours" INTEGER NOT NULL,
    "hierarchy_type" TEXT NOT NULL,
    "percentage" INTEGER NOT NULL,
    "paid" INTEGER NOT NULL,

    CONSTRAINT "Manages_pkey" PRIMARY KEY ("academic_fk","course_fk")
);

-- CreateTable
CREATE TABLE "Academic" (
    "user_fk" INTEGER NOT NULL,
    "department_fk" INTEGER NOT NULL,
    "isFOUCH" BOOLEAN NOT NULL,

    CONSTRAINT "Academic_pkey" PRIMARY KEY ("user_fk")
);

-- CreateTable
CREATE TABLE "Administrator" (
    "user_fk" INTEGER NOT NULL,

    CONSTRAINT "Administrator_pkey" PRIMARY KEY ("user_fk")
);

-- CreateTable
CREATE TABLE "User" (
    "rut" INTEGER NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("rut")
);

-- CreateTable
CREATE TABLE "Logger" (
    "id" SERIAL NOT NULL,
    "user_fk" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Logger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_program_fk_fkey" FOREIGN KEY ("program_fk") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_department_fk_fkey" FOREIGN KEY ("department_fk") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_course_director_fk_fkey" FOREIGN KEY ("course_director_fk") REFERENCES "User"("rut") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_coordinator_fk_fkey" FOREIGN KEY ("coordinator_fk") REFERENCES "User"("rut") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrolled" ADD CONSTRAINT "Enrolled_student_fk_fkey" FOREIGN KEY ("student_fk") REFERENCES "Student"("rut") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrolled" ADD CONSTRAINT "Enrolled_course_fk_fkey" FOREIGN KEY ("course_fk") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expenses" ADD CONSTRAINT "Expenses_course_fk_fkey" FOREIGN KEY ("course_fk") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_director_fk_fkey" FOREIGN KEY ("director_fk") REFERENCES "User"("rut") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manages" ADD CONSTRAINT "Manages_academic_fk_fkey" FOREIGN KEY ("academic_fk") REFERENCES "Academic"("user_fk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manages" ADD CONSTRAINT "Manages_course_fk_fkey" FOREIGN KEY ("course_fk") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Academic" ADD CONSTRAINT "Academic_department_fk_fkey" FOREIGN KEY ("department_fk") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Academic" ADD CONSTRAINT "Academic_user_fk_fkey" FOREIGN KEY ("user_fk") REFERENCES "User"("rut") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administrator" ADD CONSTRAINT "Administrator_user_fk_fkey" FOREIGN KEY ("user_fk") REFERENCES "User"("rut") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Logger" ADD CONSTRAINT "Logger_user_fk_fkey" FOREIGN KEY ("user_fk") REFERENCES "User"("rut") ON DELETE RESTRICT ON UPDATE CASCADE;
