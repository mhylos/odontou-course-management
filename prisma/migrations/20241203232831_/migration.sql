/*
  Warnings:

  - You are about to drop the column `department` on the `Academic` table. All the data in the column will be lost.
  - Added the required column `department_fk` to the `Academic` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Academic" (
    "user_fk" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "department_fk" INTEGER NOT NULL,
    "isFOUCH" BOOLEAN NOT NULL,
    CONSTRAINT "Academic_department_fk_fkey" FOREIGN KEY ("department_fk") REFERENCES "Department" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Academic_user_fk_fkey" FOREIGN KEY ("user_fk") REFERENCES "User" ("rut") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Academic" ("isFOUCH", "user_fk") SELECT "isFOUCH", "user_fk" FROM "Academic";
DROP TABLE "Academic";
ALTER TABLE "new_Academic" RENAME TO "Academic";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
