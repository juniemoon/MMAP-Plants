import { notFound } from "next/navigation";
import { getPlant } from "@/app/actions";

type Props = { params: Promise<{ id: string }> };

export default async function PlantDetailPage({ params }: Props) {
  const { id } = await params;
  const plant = await getPlant(Number(id));

  if (!plant) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-black">{plant.name}</h1>
      <div className="flex gap-8 plants-start">
        <img src={plant.image} alt={plant.name} className="w-48 h-64 object-contain" />
        <div className="flex flex-col gap-3 text-zinc-700">
          <p><span className="font-semibold">Standort:</span> {plant.location}</p>
          <p><span className="font-semibold">Gießen:</span> {plant.watering}</p>
          <p><span className="font-semibold">Licht:</span> {plant.sunlight}</p>
          <p><span className="font-semibold">Luftfeuchtigkeit:</span> {plant.humidity}%</p>
          <p><span className="font-semibold">Status:</span> {plant.status}</p>
        </div>
      </div>
      {plant.wateringLogs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-black mb-2">Gießprotokoll</h2>
          <div className="flex flex-col gap-2">
            {plant.wateringLogs.map((log) => (
              <div key={log.id} className="border rounded px-3 py-2 text-sm text-zinc-700">
                <p>
                  <span className="font-semibold">Datum:</span> {new Date(log.wateredAt).toLocaleString("de-DE")}
                  {log.waterAmount !== null && <span> · <span className="font-semibold">Menge:</span> {log.waterAmount} ml</span>}
                </p>
                {log.note && <p><span className="font-semibold">Notiz:</span> {log.note}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}