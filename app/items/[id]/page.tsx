import { notFound } from "next/navigation";
import { getPlant } from "@/app/actions";
import AddWateringLogForm from "@/app/src/components/AddWateringLogForm";
import WateringLogEntry from "@/app/src/components/WateringLogEntry";

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
          <p><span className="font-semibold">Gießen: </span><p className="inline">Alle {plant.wateringMinWeeks} bis {plant.wateringMaxWeeks} Wochen</p></p>
          <p><span className="font-semibold">Licht:</span> {plant.sunlight}</p>
          <p><span className="font-semibold">Luftfeuchtigkeit:</span> {plant.humidity}%</p>
          <p><span className="font-semibold">Status:</span> {plant.status}</p>
        </div>
      </div>

      <AddWateringLogForm plantId={plant.id} />

      {plant.wateringLogs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-black mb-2">Gießprotokoll</h2>
          <div className="flex flex-col gap-2">
            {plant.wateringLogs.map((log) => (
              <WateringLogEntry key={log.id} log={log} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}