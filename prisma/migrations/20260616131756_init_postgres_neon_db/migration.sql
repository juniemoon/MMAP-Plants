-- CreateTable
CREATE TABLE "Plant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL DEFAULT '/placeholder.jpg',
    "status" TEXT NOT NULL DEFAULT 'unknown',
    "illness" TEXT,
    "location" TEXT NOT NULL,
    "wateringMinWeeks" DOUBLE PRECISION NOT NULL,
    "wateringMaxWeeks" DOUBLE PRECISION NOT NULL,
    "sunlight" TEXT,
    "humidity" INTEGER,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WateringLog" (
    "id" SERIAL NOT NULL,
    "plantId" INTEGER NOT NULL,
    "wateredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "waterAmount" INTEGER,
    "note" TEXT,

    CONSTRAINT "WateringLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FertilizingLog" (
    "id" SERIAL NOT NULL,
    "plantId" INTEGER NOT NULL,
    "fertilizedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fertilizerType" TEXT,
    "amount" TEXT,
    "note" TEXT,

    CONSTRAINT "FertilizingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepottingLog" (
    "id" SERIAL NOT NULL,
    "plantId" INTEGER NOT NULL,
    "repottedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "soilType" TEXT,
    "oldPotSize" INTEGER,
    "newPotSize" INTEGER,
    "plantDivided" BOOLEAN,
    "note" TEXT,

    CONSTRAINT "RepottingLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WateringLog" ADD CONSTRAINT "WateringLog_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FertilizingLog" ADD CONSTRAINT "FertilizingLog_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepottingLog" ADD CONSTRAINT "RepottingLog_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
