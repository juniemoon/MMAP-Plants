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
      watering: "alle 7 - 10 Tage",
      sunlight: "indirektes Licht",
      humidity: 60,
    },
  });

  const plant2 = await prisma.plant.create({
    data: {
      name: "Bogenhanf",
      image: "/bogenhanf.jpg",
      status: "thirsty",
      location: "Schlafzimmer",
      watering: "alle 3 - 4 Wochen",
      sunlight: "sonnig bis indirektes Licht",
      humidity: 50,
    },
  });

  const wateringLog1 = await prisma.wateringLog.create({
    data: {
        plantId: plant1.id,  // ← autogenerierte id von plant1
        waterAmount: 500,
        note: "Angießen nach dem Einpflanzen",
    },
  });

  console.log("Seed-Daten erstellt:", { plant1, plant2, wateringLog1 });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());