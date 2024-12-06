-- CreateTable
CREATE TABLE "Course" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enroll_value" INTEGER NOT NULL,
    "direct_hours" REAL NOT NULL,
    "indirect_hours" REAL NOT NULL,
    "inperson_hours" REAL NOT NULL,
    "online_hours" REAL NOT NULL,
    "name" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "additional_comments" TEXT NOT NULL,
    "date_from" DATETIME NOT NULL,
    "date_to" DATETIME NOT NULL,
    "hour_value" INTEGER NOT NULL,
    "department_fk" INTEGER NOT NULL,
    "program_fk" INTEGER NOT NULL,
    CONSTRAINT "Course_program_fk_fkey" FOREIGN KEY ("program_fk") REFERENCES "Program" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Course_department_fk_fkey" FOREIGN KEY ("department_fk") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Student" (
    "rut" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "genre" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Enrolled" (
    "student_fk" INTEGER NOT NULL,
    "course_fk" INTEGER NOT NULL,
    "paid" BOOLEAN NOT NULL,
    "payment_type" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "ticket_num" INTEGER NOT NULL,
    "payment_date" DATETIME NOT NULL,

    PRIMARY KEY ("student_fk", "course_fk"),
    CONSTRAINT "Enrolled_student_fk_fkey" FOREIGN KEY ("student_fk") REFERENCES "Student" ("rut") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Enrolled_course_fk_fkey" FOREIGN KEY ("course_fk") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Expenses" (
    "course_fk" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "unit_value" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("name", "course_fk"),
    CONSTRAINT "Expenses_course_fk_fkey" FOREIGN KEY ("course_fk") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Program" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Department" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
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

    PRIMARY KEY ("academic_fk", "course_fk"),
    CONSTRAINT "Manages_academic_fk_fkey" FOREIGN KEY ("academic_fk") REFERENCES "Academic" ("user_fk") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Manages_course_fk_fkey" FOREIGN KEY ("course_fk") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Academic" (
    "user_fk" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "department" TEXT NOT NULL,
    "isFOUCH" BOOLEAN NOT NULL,
    CONSTRAINT "Academic_user_fk_fkey" FOREIGN KEY ("user_fk") REFERENCES "User" ("rut") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Administrator" (
    "user_fk" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    CONSTRAINT "Administrator_user_fk_fkey" FOREIGN KEY ("user_fk") REFERENCES "User" ("rut") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "rut" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Account" (
    "user_fk" INTEGER NOT NULL,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("provider", "providerAccountId"),
    CONSTRAINT "Account_user_fk_fkey" FOREIGN KEY ("user_fk") REFERENCES "User" ("rut") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
