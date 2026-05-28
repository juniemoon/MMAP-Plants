import type { PlantItem } from "@/app/items/page";

export async function GET() {
  const items: PlantItem[] = [
    { id: 1, name: "Monstera", image: "/monstera.jpg", status: "healthy", location: "Wohnzimmer", watering: "alle 7 - 10 Tage", sunlight: "indirektes Licht", humidity: 60 },
    { id: 2, name: "Bogenhanf", image: "/bogenhanf.jpg", status: "thirsty", location: "Schlafzimmer", watering: "alle 3 - 4 Wochen", sunlight: "sonnig bis indirektes Licht", humidity: 50 },
  //   { id: 3, name: "Philodendron", image: "/philodendron.jpg", status: "needs-sunlight", location: "Büro", watering: "alle 7 - 10 Tage", sunlight: "helles, indirektes Licht", humidity: 60 }
  ];

  return Response.json(items);
}