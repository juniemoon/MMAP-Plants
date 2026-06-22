import { notFound } from "next/navigation";
import { getPlant } from "@/app/actions";
import AddWateringLogForm from "@/app/src/components/AddWateringLogForm";
import AddFertilizingLogForm from "@/app/src/components/AddFertilizingLogForm";
import AddRepottingLogForm from "@/app/src/components/AddRepottingLogForm";
import { Droplet } from "lucide-react";
import WateringLogEntry from "@/app/src/components/WateringLogEntry";
import FertilizingLogEntry from "@/app/src/components/FertilizingLogEntry";
import RepottingLogEntry from "@/app/src/components/RepottingLogEntry";
import PlantDetailHeader from "@/app/src/components/PlantDetailHeader";
type Props = { params: Promise<{ id: string }> };

export default async function PlantDetailPage({ params }: Props) {
  const { id } = await params;
  const plant = await getPlant(Number(id));

  if (!plant) {
    notFound();
  }

  // Client-side logic for overdue watering
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
    idk: "Unbekannt",
    healthy: "Gesund",
    sick: "Krank/Schädlinge",
    recovering: "in Genesung",
    critical: "Kritisch",
  };

  return (
    <div className="flex flex-col gap-6 text-zinc-700">
      <PlantDetailHeader plant={plant} />
      {isOverdue && (
        <div className="bg-[#f7b013] text-white px-4 py-2 rounded-lg flex items-center gap-2 self-start font-medium shadow-sm">
          <Droplet className="h-5 w-5 text-white" />
          {daysOverdue === 0 && <span>Gießen heute fällig</span>}
          {daysOverdue === 1 && <span>Gießen seit 1 Tag überfällig</span>}
          {daysOverdue > 1 && <span>Gießen seit {daysOverdue} Tagen überfällig</span>}
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-2">
        <AddWateringLogForm plantId={plant.id} />
        <AddFertilizingLogForm plantId={plant.id} />
        <AddRepottingLogForm plantId={plant.id} />
      </div>
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
      {plant.fertilizingLogs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-black mb-2">Düngeprotokoll</h2>
          <div className="flex flex-col gap-2">
            {plant.fertilizingLogs.map((log) => (
              <FertilizingLogEntry key={log.id} log={log} />
            ))}
          </div>
        </div>
      )}
      {plant.repottingLogs.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-black mb-2">Umtopfprotokoll</h2>
          <div className="flex flex-col gap-2">
            {plant.repottingLogs.map((log) => (
              <RepottingLogEntry key={log.id} log={log} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}