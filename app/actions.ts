"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// READ: Alle Pflanzen laden
export async function getAllPlants() {
  return prisma.plant.findMany();
}

// READ: Einzelne Pflanze + zugehörige Watering Logs laden
export async function getPlant(id: number) {
  return prisma.plant.findUnique({
    where: { id },
    include: { wateringLogs: { orderBy: { wateredAt: "desc" } } },
  });
}

// CREATE: Neue Pflanze erstellen
export async function createPlant(name: string, location: string, status: string, wateringMinWeeks: number, wateringMaxWeeks: number,sunlight: string, humidity: number, image?: string, ) {
  await prisma.plant.create({
    data: { name, location, status, wateringMinWeeks, wateringMaxWeeks, sunlight, humidity, image },
  });
  revalidatePath("/items"); // Seite aktualisieren!
}

// UPDATE: Pflanze ändern/aktualisieren
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
) {
  await prisma.plant.update({
    where: { id },
    data: { name, location, status, wateringMinWeeks, wateringMaxWeeks, sunlight, humidity, image },
  });
  revalidatePath("/items");
  revalidatePath(`/items/${id}`);
}

// DELETE: Pflanze löschen
export async function deletePlant(id: number) {
  await prisma.wateringLog.deleteMany({ where: { plantId: id } });
  await prisma.plant.delete({ where: { id } });
  revalidatePath("/items");
}