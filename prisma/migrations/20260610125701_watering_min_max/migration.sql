/*
  Warnings:

  - You are about to drop the column `watering` on the `Plant` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '/placeholder.jpg',
    "status" TEXT NOT NULL DEFAULT 'unknown',
    "location" TEXT NOT NULL,
    "wateringMinWeeks" REAL,
    "wateringMaxWeeks" REAL,
    "sunlight" TEXT,
    "humidity" INTEGER
);
INSERT INTO "new_Plant" ("humidity", "id", "image", "location", "name", "status", "sunlight") SELECT "humidity", "id", "image", "location", "name", "status", "sunlight" FROM "Plant";
DROP TABLE "Plant";
ALTER TABLE "new_Plant" RENAME TO "Plant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
