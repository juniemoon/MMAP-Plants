import { notFound } from "next/navigation";
import { getPlant } from "@/app/actions";
import AddWateringLogForm from "@/app/src/components/AddWateringLogForm";
import { Droplet } from "lucide-react";
import WateringLogEntry from "@/app/src/components/WateringLogEntry";
import PlantDetailHeader from "@/app/src/components/PlantDetailHeader";
import { useMemo } from "react";
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