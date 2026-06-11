import { notFound } from "next/navigation";
import { getPlant } from "@/app/actions";
import AddWateringLogForm from "@/app/src/components/AddWateringLogForm";
import { Droplet } from "lucide-react";
import WateringLogEntry from "@/app/src/components/WateringLogEntry";

type Props = { params: Promise<{ id: string }> };

export default async function PlantDetailPage({ params }: Props) {
  const { id } = await params;
  const plant = await getPlant(Number(id));

  if (!plant) {
    notFound();
  }

  const { isOverdue, daysOverdue } = (() => {
    let isOverdue = false;
    let daysOverdue = 0;

    if (plant.wateringMaxWeeks !== null && plant.wateringMaxWeeks !== undefined && plant.wateringLogs.length > 0) {
      const lastWateringDate = new Date(plant.wateringLogs[0].wateredAt);
      const maxWateringIntervalDays = plant.wateringMaxWeeks * 7;
      const overdueThresholdDate = new Date(lastWateringDate.getTime() + maxWateringIntervalDays * 24 * 60 * 60 * 1000);
      const now = new Date();

      if (now > overdueThresholdDate) {
        isOverdue = true;
        daysOverdue = Math.floor((now.getTime() - overdueThresholdDate.getTime()) / (1000 * 60 * 60 * 24));
      }
    }
    return { isOverdue, daysOverdue };
  })();

  const statusLabels: Record<string, string> = {
    unknown: "Unbekannt",
    healthy: "Gesund",
    sick: "Krank/Schädlinge",
    recovering: "in Genesung",
    critical: "Kritisch",
  };

  return (
    <div className="flex flex-col gap-6 text-zinc-700">
      <h1 className="text-3xl font-semibold text-black">{plant.name}</h1>
      <div className="flex gap-8 plants-start">
        <img src={plant.image} alt={plant.name} className="w-48 h-64 object-contain" />
        <div className="flex flex-col gap-3 text-zinc-700">
          <p><span className="font-semibold">Standort:</span> {plant.location}</p>
          <p><span className="font-semibold">Gießen: </span><p className="inline">Alle {plant.wateringMinWeeks} bis {plant.wateringMaxWeeks} Wochen</p></p>
          <p><span className="font-semibold">Licht:</span> {plant.sunlight}</p>
          <p><span className="font-semibold">Luftfeuchtigkeit:</span> {plant.humidity}%</p>
          <p><span className="font-semibold">Status:</span> {statusLabels[plant.status] ?? plant.status}</p>
          <p><span className="font-semibold">Krankheit/Schädlinge:</span> {plant.illness || "keine"}</p>
        </div>
      </div>

      {isOverdue && (
        <div className="bg-[#f7b013] text-white px-4 py-2 rounded-lg flex items-center gap-2 self-start font-medium">
          <Droplet className="h-5 w-5 text-white" /> 
          {daysOverdue === 0 && ( <span>Gießen heute fällig</span> )}
          {daysOverdue === 1 && ( <span>Gießen seit 1 Tag überfällig</span> )}
          {daysOverdue > 1 && ( <span>Gießen seit {daysOverdue} Tagen überfällig</span> )}
        </div>
      )}

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