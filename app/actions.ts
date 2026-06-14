"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import path from "path"

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

    // Einzigartiger Dateiname
    const filename = `${Date.now()}-${imageFile.name.replaceAll(" ", "_")}`;
    const fullPath = path.join(uploadDir, filename);
    
    await writeFile(fullPath, buffer);
    imagePath = `/uploads/${filename}`;
  }
  
  // Wenn Status gesund, dann Krankheit leeren
  const finalIllness = status === "healthy" ? null : illness;

  await prisma.plant.create({
    data: { 
      name, 
      location, 
      status, 
      wateringMinWeeks, 
      wateringMaxWeeks, 
      sunlight, 
      humidity, 
      image: imagePath, 
      illness: finalIllness 
    },
  })

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
  let imagePath: string | undefined = undefined;

  // Wenn neues File hochgeladen wurde Prozess wie oben
  if (image instanceof File && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public/uploads");
    await mkdir(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${image.name.replaceAll(" ", "_")}`;
    await writeFile(path.join(uploadDir, filename), buffer);
    imagePath = `/uploads/${filename}`;
  }

  // Wenn Status gesund, dann Krankheit leeren
  const finalIllness = status === "healthy" ? null : illness;

  await prisma.plant.update({
    where: { id },
    data: { 
      name, 
      location, 
      status, 
      wateringMinWeeks, 
      wateringMaxWeeks, 
      sunlight, 
      humidity, 
      ...(imagePath && { image: imagePath }), // Nur updaten wenn ein Pfad vorhanden ist
      illness: finalIllness 
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

export async function updateWateringLog(id: number, waterAmount?: number, note?: string, wateredAt?: Date) {
  const log = await prisma.wateringLog.update({
    where: { id },
    data: { 
      waterAmount, 
      note,
     ...(wateredAt && { wateredAt }),  // nur setzen wenn angegeben
    },
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