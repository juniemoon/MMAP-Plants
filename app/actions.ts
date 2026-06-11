"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ========================================
// ============ PLANTS ACTIONS ============
// ========================================

export async function getAllPlants() {
  return prisma.plant.findMany({
    include: { wateringLogs: { orderBy: { wateredAt: "desc" } } },
  });
}

export async function getPlant(id: number) {
  return prisma.plant.findUnique({
    where: { id },
    include: { wateringLogs: { orderBy: { wateredAt: "desc" } } },
  });
}

export async function createPlant(name: string, location: string, status: string, wateringMinWeeks: number, wateringMaxWeeks: number, sunlight: string, humidity: number, image?: string, illness?: string ) {
  await prisma.plant.create({
    data: { name, location, status, wateringMinWeeks, wateringMaxWeeks, sunlight, humidity, image },
  });
  revalidatePath("/items"); // Seite aktualisieren!
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
  image?: string,
  illness?: string
) {
  await prisma.plant.update({
    where: { id },
    data: { name, location, status, wateringMinWeeks, wateringMaxWeeks, sunlight, humidity, image, illness },
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
  await prisma.wateringLog.create({
    data: {
      plantId,
      waterAmount,
      note,
      ...(wateredAt && { wateredAt }),  // nur setzen wenn angegeben
    },
  });
  revalidatePath(`/items/${plantId}`);
}

export async function updateWateringLog(id: number, waterAmount?: number, note?: string) {
  const log = await prisma.wateringLog.update({
    where: { id },
    data: { waterAmount, note },
  });
  revalidatePath(`/items/${log.plantId}`);
}

// ==========================================
// ======== FERTILIZING LOGS ACTIONS ========
// ==========================================

// tbd

// ==========================================
// ========= REPOTTING LOGS ACTIONS =========
// ==========================================

// tbd