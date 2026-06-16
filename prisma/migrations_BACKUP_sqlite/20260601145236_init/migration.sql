-- CreateTable
CREATE TABLE "Plant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '/placeholder.jpg',
    "status" TEXT NOT NULL DEFAULT 'unknown',
    "location" TEXT NOT NULL,
    "watering" TEXT NOT NULL,
    "sunlight" TEXT NOT NULL,
    "humidity" INTEGER NOT NULL
);
