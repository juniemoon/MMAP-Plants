import { prisma } from "@/lib/prisma";
import type { Plant } from "@/generated/prisma/client";

type Props = { params: Promise<{ id: string }> };

async function getItem(id: string): Promise<Plant> {
  const plant = await prisma.plant.findUnique({
    where: { id: Number(id) },
  });
  if (!plant) throw new Error(`Plant with id ${id} not found`);
  return plant;
}

export default async function ItemDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await getItem(id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-black">{item.name}</h1>
      <div className="flex gap-8 items-start">
        <img src={item.image} alt={item.name} className="w-48 h-64 object-contain" />
        <div className="flex flex-col gap-3 text-zinc-700">
          <p><span className="font-semibold">Standort:</span> {item.location}</p>
          <p><span className="font-semibold">Gießen:</span> {item.watering}</p>
          <p><span className="font-semibold">Licht:</span> {item.sunlight}</p>
          <p><span className="font-semibold">Luftfeuchtigkeit:</span> {item.humidity}%</p>
          <p><span className="font-semibold">Status:</span> {item.status}</p>
        </div>
      </div>
    </div>
  );
}