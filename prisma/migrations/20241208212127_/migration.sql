/*
  Warnings:

  - Added the required column `total` to the `Enrolled` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Enrolled" (
    "student_fk" INTEGER NOT NULL,
    "course_fk" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "paid" BOOLEAN NOT NULL,
    "payment_type" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "ticket_num" INTEGER NOT NULL,
    "payment_date" DATETIME NOT NULL,
    "total" INTEGER NOT NULL,

    PRIMARY KEY ("student_fk", "course_fk"),
    CONSTRAINT "Enrolled_student_fk_fkey" FOREIGN KEY ("student_fk") REFERENCES "Student" ("rut") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Enrolled_course_fk_fkey" FOREIGN KEY ("course_fk") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Enrolled" ("course_fk", "discount", "paid", "payment_date", "payment_type", "status", "student_fk", "ticket_num") SELECT "course_fk", "discount", "paid", "payment_date", "payment_type", "status", "student_fk", "ticket_num" FROM "Enrolled";
DROP TABLE "Enrolled";
ALTER TABLE "new_Enrolled" RENAME TO "Enrolled";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;