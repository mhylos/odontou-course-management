/*
  Warnings:

  - You are about to drop the column `rut` on the `Logger` table. All the data in the column will be lost.
  - Added the required column `user_fk` to the `Logger` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Logger" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_fk" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    CONSTRAINT "Logger_user_fk_fkey" FOREIGN KEY ("user_fk") REFERENCES "User" ("rut") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Logger" ("action", "description", "id", "timestamp") SELECT "action", "description", "id", "timestamp" FROM "Logger";
DROP TABLE "Logger";
ALTER TABLE "new_Logger" RENAME TO "Logger";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
