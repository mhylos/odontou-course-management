/*
  Warnings:

  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `coordinator_fk` to the `Course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `course_director_fk` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Account";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Course" (
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
    "course_director_fk" INTEGER NOT NULL,
    "coordinator_fk" INTEGER NOT NULL,
    CONSTRAINT "Course_program_fk_fkey" FOREIGN KEY ("program_fk") REFERENCES "Program" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Course_department_fk_fkey" FOREIGN KEY ("department_fk") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Course_course_director_fk_fkey" FOREIGN KEY ("course_director_fk") REFERENCES "User" ("rut") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Course_coordinator_fk_fkey" FOREIGN KEY ("coordinator_fk") REFERENCES "User" ("rut") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Course" ("additional_comments", "date_from", "date_to", "department_fk", "direct_hours", "enroll_value", "hour_value", "id", "indirect_hours", "inperson_hours", "name", "objective", "online_hours", "program_fk") SELECT "additional_comments", "date_from", "date_to", "department_fk", "direct_hours", "enroll_value", "hour_value", "id", "indirect_hours", "inperson_hours", "name", "objective", "online_hours", "program_fk" FROM "Course";
DROP TABLE "Course";
ALTER TABLE "new_Course" RENAME TO "Course";
CREATE TABLE "new_Department" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "director_fk" INTEGER,
    CONSTRAINT "Department_director_fk_fkey" FOREIGN KEY ("director_fk") REFERENCES "User" ("rut") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Department" ("id", "name") SELECT "id", "name" FROM "Department";
DROP TABLE "Department";
ALTER TABLE "new_Department" RENAME TO "Department";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
