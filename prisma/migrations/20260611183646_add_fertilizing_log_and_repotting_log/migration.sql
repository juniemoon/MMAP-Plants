-- AlterTable
ALTER TABLE "Plant" ADD COLUMN "illness" TEXT;

-- CreateTable
CREATE TABLE "FertilizingLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "plantId" INTEGER NOT NULL,
    "fertilizedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fertilizerType" TEXT,
    "amount" TEXT,
    "note" TEXT,
    CONSTRAINT "FertilizingLog_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RepottingLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "plantId" INTEGER NOT NULL,
    "repottedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "soilType" TEXT,
    "oldPotSize" INTEGER,
    "newPotSize" INTEGER,
    "plantDivided" BOOLEAN,
    "note" TEXT,
    CONSTRAINT "RepottingLog_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
