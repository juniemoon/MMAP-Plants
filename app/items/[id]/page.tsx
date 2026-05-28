// app/items/[id]/page.tsx
import { PlantItem } from "../page";

type Props = { params: Promise<{ id: string }> };

async function getItem(id: string): Promise<PlantItem> {
  const response = await fetch(`http://localhost:3000/api/items`, { cache: "no-store" });
  const items: PlantItem[] = await response.json();
  return items.find(item => item.id === Number(id))!;
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