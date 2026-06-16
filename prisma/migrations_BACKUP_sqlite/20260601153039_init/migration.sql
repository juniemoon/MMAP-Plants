-- CreateTable
CREATE TABLE "WateringLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "plantId" INTEGER NOT NULL,
    "wateredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    CONSTRAINT "WateringLog_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Plant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '/placeholder.jpg',
    "status" TEXT NOT NULL DEFAULT 'unknown',
    "location" TEXT NOT NULL,
    "watering" TEXT,
    "sunlight" TEXT,
    "humidity" INTEGER
);
INSERT INTO "new_Plant" ("humidity", "id", "image", "location", "name", "status", "sunlight", "watering") SELECT "humidity", "id", "image", "location", "name", "status", "sunlight", "watering" FROM "Plant";
DROP TABLE "Plant";
ALTER TABLE "new_Plant" RENAME TO "Plant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
