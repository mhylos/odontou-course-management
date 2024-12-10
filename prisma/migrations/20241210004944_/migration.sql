-- CreateTable
CREATE TABLE "Logger" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rut" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    CONSTRAINT "Logger_rut_fkey" FOREIGN KEY ("rut") REFERENCES "User" ("rut") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Enrolled" (
    "student_fk" INTEGER NOT NULL,
    "course_fk" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "payment_type" TEXT NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "ticket_num" INTEGER,
    "payment_date" DATETIME,
    "total" INTEGER NOT NULL,
    "observation" TEXT NOT NULL,

    PRIMARY KEY ("student_fk", "course_fk"),
    CONSTRAINT "Enrolled_student_fk_fkey" FOREIGN KEY ("student_fk") REFERENCES "Student" ("rut") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Enrolled_course_fk_fkey" FOREIGN KEY ("course_fk") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Enrolled" ("course_fk", "discount", "observation", "payment_date", "payment_type", "status", "student_fk", "ticket_num", "total") SELECT "course_fk", "discount", "observation", "payment_date", "payment_type", "status", "student_fk", "ticket_num", "total" FROM "Enrolled";
DROP TABLE "Enrolled";
ALTER TABLE "new_Enrolled" RENAME TO "Enrolled";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;