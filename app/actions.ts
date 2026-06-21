"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { PlantSchema, WateringLogSchema, FertilizingLogSchema, RepottingLogSchema } from "@/schemas";

// ========================================
// ============ PLANTS ACTIONS ============
// ========================================

export async function getAllPlants() {
  return prisma.plant.findMany({
    include: { wateringLogs: { orderBy: { wateredAt: "desc" } }, fertilizingLogs: { orderBy: { fertilizedAt: "desc" } }, repottingLogs: { orderBy: { repottedAt: "desc" } } },
  });
}

export async function getPlant(id: number) {
  return prisma.plant.findUnique({
    where: { id },
    include: { wateringLogs: { orderBy: { wateredAt: "desc" } }, fertilizingLogs: { orderBy: { fertilizedAt: "desc" } }, repottingLogs: { orderBy: { repottedAt: "desc" } } },
  });
}

export async function createPlant(
  name: string,
  location: string,
  status: string,
  wateringMinWeeks: number,
  wateringMaxWeeks: number,
  sunlight: string,
  humidity: number,
  imageFile?: File | null,
  illness?: string
) {
  // Validierung
  const validated = PlantSchema.parse({
    name,
    location,
    status,
    wateringMinWeeks,
    wateringMaxWeeks,
    sunlight,
    humidity,
    illness,
  });

  let imagePath: string | undefined = undefined;
  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      console.error("Fehler beim Erstellen des Upload-Verzeichnisses:", e);
      return;
    }

    const filename = `${Date.now()}-${imageFile.name.replaceAll(" ", "_")}`;
    const fullPath = path.join(uploadDir, filename);

    await writeFile(fullPath, buffer);
    imagePath = `/uploads/${filename}`;
  }

  const finalIllness = validated.status === "healthy" ? null : validated.illness;

  await prisma.plant.create({
    data: {
      name: validated.name,
      location: validated.location,
      status: validated.status,
      wateringMinWeeks: validated.wateringMinWeeks,
      wateringMaxWeeks: validated.wateringMaxWeeks,
      sunlight: validated.sunlight,
      humidity: validated.humidity,
      image: imagePath,
      illness: finalIllness,
    },
  });

  revalidatePath("/items");
}

export async function updatePlant(
  id: number,
  name: string,
  location: string,
  status: string,
  wateringMinWeeks: number,
  wateringMaxWeeks: number,
  sunlight: string,
  humidity: number,
  image?: string | File | null,
  illness?: string
) {
  // Validierung
  const validated = PlantSchema.parse({
    name,
    location,
    status,
    wateringMinWeeks,
    wateringMaxWeeks,
    sunlight,
    humidity,
    illness,
  });

  let imagePath: string | undefined = undefined;

  if (image instanceof File && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${image.name.replaceAll(" ", "_")}`;
    await writeFile(path.join(uploadDir, filename), buffer);
    imagePath = `/uploads/${filename}`;
  }

  const finalIllness = validated.status === "healthy" ? null : validated.illness;

  await prisma.plant.update({
    where: { id },
    data: {
      name: validated.name,
      location: validated.location,
      status: validated.status,
      wateringMinWeeks: validated.wateringMinWeeks,
      wateringMaxWeeks: validated.wateringMaxWeeks,
      sunlight: validated.sunlight,
      humidity: validated.humidity,
      ...(imagePath && { image: imagePath }),
      illness: finalIllness,
    },
  });

  revalidatePath("/items");
  revalidatePath(`/items/${id}`);
}

export async function deletePlant(id: number) {
  await prisma.wateringLog.deleteMany({ where: { plantId: id } });
  await prisma.plant.delete({ where: { id } });
  revalidatePath("/items");
}

// =========================================
// ========= WATERING LOGS ACTIONS =========
// =========================================

export async function addWateringLog(plantId: number, waterAmount?: number, note?: string, wateredAt?: Date) {
  // Validierung
  WateringLogSchema.parse({ plantId, waterAmount, note, wateredAt });

  await prisma.wateringLog.create({
    data: {
      plantId,
      waterAmount,
      note,
      ...(wateredAt && { wateredAt }),
    },
  });
  revalidatePath(`/items/${plantId}`);
}

export async function updateWateringLog(id: number, waterAmount?: number, note?: string, wateredAt?: Date) {
  const log = await prisma.wateringLog.update({
    where: { id },
    data: {
      waterAmount,
      note,
      ...(wateredAt && { wateredAt }),
    },
  });
  revalidatePath(`/items/${log.plantId}`);
}

// ============================================
// ========= FERTILIZING LOGS ACTIONS =========
// ============================================

export async function addFertilizingLog(plantId: number, fertilizerType?: string, amount?: string, note?: string, fertilizedAt?: Date) {
  FertilizingLogSchema.parse({ plantId, fertilizerType, amount, note, fertilizedAt });

  await prisma.fertilizingLog.create({
    data: {
      plantId,
      fertilizerType,
      amount,
      note,
      ...(fertilizedAt && { fertilizedAt }),
    },
  });
  revalidatePath(`/items/${plantId}`);
}

export async function updateFertilizingLog(id: number, fertilizerType?: string, amount?: string, note?: string, fertilizedAt?: Date) {
  const log = await prisma.fertilizingLog.update({
    where: { id },
    data: {
      fertilizerType,
      amount,
      note,
      ...(fertilizedAt && { fertilizedAt }),
    },
  });
  revalidatePath(`/items/${log.plantId}`);
}

// ==========================================
// ========= REPOTTING LOGS ACTIONS =========
// ==========================================

export async function addRepottingLog(plantId: number, repottedAt?: Date, soilType?: string, oldPotSize?: number, newPotSize?: number, plantDivided?: boolean, note?: string) {
  RepottingLogSchema.parse({ plantId, repottedAt, soilType, oldPotSize, newPotSize, plantDivided, note });

  await prisma.repottingLog.create({
    data: {
      plantId,
      soilType,
      oldPotSize,
      newPotSize,
      plantDivided,
      note,
      ...(repottedAt && { repottedAt }),
    },
  });
  revalidatePath(`/items/${plantId}`);
}

export async function updateRepottingLog(id: number, repottedAt?: Date, soilType?: string, oldPotSize?: number, newPotSize?: number, plantDivided?: boolean, note?: string) {
  const log = await prisma.repottingLog.update({
    where: { id },
    data: {
      soilType,
      oldPotSize,
      newPotSize,
      plantDivided,
      note,
      ...(repottedAt && { repottedAt }),
    },
  });
  revalidatePath(`/items/${log.plantId}`);
}