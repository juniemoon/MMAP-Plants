/*
  Warnings:

  - Made the column `wateringMaxWeeks` on table `Plant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `wateringMinWeeks` on table `Plant` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '/placeholder.jpg',
    "status" TEXT NOT NULL DEFAULT 'unknown',
    "illness" TEXT,
    "location" TEXT NOT NULL,
    "wateringMinWeeks" REAL NOT NULL,
    "wateringMaxWeeks" REAL NOT NULL,
    "sunlight" TEXT,
    "humidity" INTEGER
);
INSERT INTO "new_Plant" ("humidity", "id", "illness", "image", "location", "name", "status", "sunlight", "wateringMaxWeeks", "wateringMinWeeks") SELECT "humidity", "id", "illness", "image", "location", "name", "status", "sunlight", "wateringMaxWeeks", "wateringMinWeeks" FROM "Plant";
DROP TABLE "Plant";
ALTER TABLE "new_Plant" RENAME TO "Plant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
