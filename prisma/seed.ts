import { prisma } from "@/lib/prisma";
//const prisma = new PrismaClient();

async function main() {
  // Bestehende Daten löschen
  await prisma.wateringLog.deleteMany();
  await prisma.plant.deleteMany();

  // Testdaten einfügen
  const plant1 = await prisma.plant.create({
    data: {
      name: "Monstera",
      image: "/monstera.jpg",
      status: "healthy",
      location: "Wohnzimmer",
      wateringMinWeeks: 1,
      wateringMaxWeeks: 1.5,
      sunlight: "indirektes Licht",
      humidity: 60,
    },
  });

  const plant2 = await prisma.plant.create({
    data: {
      name: "Bogenhanf",
      image: "/bogenhanf.jpg",
      status: "healthy",
      location: "Schlafzimmer",
      wateringMinWeeks: 3,
      wateringMaxWeeks: 4,
      sunlight: "sonnig bis indirektes Licht",
      humidity: 50,
    },
  });

  const wateringLog1 = await prisma.wateringLog.create({
    data: {
        plantId: plant1.id,
        waterAmount: 500,
        note: "Angießen nach dem Einpflanzen",
    },
  });

  console.log("Seed-Daten erstellt:", { plant1, plant2, wateringLog1 });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());