"use client";
import Link from "next/link";
import { deletePlant, updatePlant } from "@/app/actions";
import type { Plant, WateringLog, FertilizingLog, RepottingLog } from "@/generated/prisma/client";
import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlantSchema, type PlantInput } from "@/schemas";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Droplet } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function PlantCard({ item }: { item: Plant & { wateringLogs: WateringLog[]; fertilizingLogs: FertilizingLog[]; repottingLogs: RepottingLog[] } }) {
  const [editing, setEditing] = useState(false);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<PlantInput>({
    resolver: zodResolver(PlantSchema),
    defaultValues: {
      name: item.name,
      location: item.location ?? "",
      status: item.status as PlantInput["status"],
      wateringMinWeeks: item.wateringMinWeeks ?? 1,
      wateringMaxWeeks: item.wateringMaxWeeks ?? 2,
      sunlight: item.sunlight ?? "",
      humidity: item.humidity ?? 50,
      illness: item.illness ?? "",
    },
  });

  const status = watch("status");

  const { isOverdue, daysOverdue } = useMemo(() => {
    let isOverdue = false;
    let daysOverdue = 0;
    if (item.wateringMaxWeeks !== null && item.wateringMaxWeeks !== undefined && item.wateringLogs.length > 0) {
      const lastWateringDate = new Date(item.wateringLogs[0].wateredAt);
      const maxWateringIntervalDays = item.wateringMaxWeeks * 7;
      const overdueThresholdDate = new Date(lastWateringDate.getTime() + maxWateringIntervalDays * 24 * 60 * 60 * 1000);
      const now = new Date();
      if (now > overdueThresholdDate) {
        isOverdue = true;
        daysOverdue = Math.floor((now.getTime() - overdueThresholdDate.getTime()) / (1000 * 60 * 60 * 24));
      }
    }
    return { isOverdue, daysOverdue };
  }, [item.wateringMaxWeeks, item.wateringLogs]);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (confirm(`${item.name} wirklich löschen?`)) {
      await deletePlant(item.id);
    }
  }

  async function onSubmit(data: PlantInput) {
    await updatePlant(
      item.id,
      data.name,
      data.location,
      data.status,
      data.wateringMinWeeks,
      data.wateringMaxWeeks,
      data.sunlight ?? "",
      data.humidity ?? 50,
      item.image ?? undefined,
      status === "healthy" ? "" : (data.illness ?? "")
    );
    setEditing(false);
  }

  if (editing) return (
    <Card className="p-4 shadow-sm border">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2 text-zinc-700">
        <div className="grid gap-1">
          <Input {...register("name")} placeholder="Name" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="grid gap-1">
          <Input {...register("location")} placeholder="Standort" />
          {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2 pl-2">
          <Label className="whitespace-nowrap">Gießen: Alle</Label>
          <Controller
            control={control}
            name="wateringMinWeeks"
            render={({ field }) => (
              <Select onValueChange={(v) => field.onChange(Number(v))} defaultValue={field.value?.toString()}>
                <SelectTrigger className="w-auto"><SelectValue placeholder="Min" /></SelectTrigger>
                <SelectContent>
                  {[1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8].map((v) => (
                    <SelectItem key={v} value={v.toString()}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <span className="whitespace-nowrap">bis</span>
          <Controller
            control={control}
            name="wateringMaxWeeks"
            render={({ field }) => (
              <Select onValueChange={(v) => field.onChange(Number(v))} defaultValue={field.value?.toString()}>
                <SelectTrigger className="w-auto"><SelectValue placeholder="Max" /></SelectTrigger>
                <SelectContent>
                  {[1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8].map((v) => (
                    <SelectItem key={v} value={v.toString()}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <span className="whitespace-nowrap">Wochen</span>
        </div>
        {errors.wateringMaxWeeks && <p className="text-xs text-red-500">{errors.wateringMaxWeeks.message}</p>}

        <div className="grid gap-1">
          <Input {...register("sunlight")} placeholder="Licht" />
          {errors.sunlight && <p className="text-xs text-red-500">{errors.sunlight.message}</p>}
        </div>

        <div className="grid gap-1">
          <Input {...register("humidity")} type="number" placeholder="Luftfeuchtigkeit (%)" className="w-20 self-start" />
          {errors.humidity && <p className="text-xs text-red-500">{errors.humidity.message}</p>}
        </div>

        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger><SelectValue placeholder="Status wählen" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="idk">Unbekannt</SelectItem>
                <SelectItem value="healthy">Gesund</SelectItem>
                <SelectItem value="sick">Krank/Schädlinge</SelectItem>
                <SelectItem value="recovering">in Genesung</SelectItem>
                <SelectItem value="critical">Kritisch</SelectItem>
              </SelectContent>
            </Select>
          )}
        />

        <Input
          {...register("illness")}
          placeholder="Krankheit / Schädlinge"
          disabled={status === "healthy"}
        />

        <div className="flex gap-2 mt-8 justify-end">
          <Button type="button" variant="secondary" onClick={() => setEditing(false)}>Abbrechen</Button>
          <Button type="submit" variant="default">Speichern</Button>
        </div>
      </form>
    </Card>
  );

  return (
    <Card className="relative overflow-hidden shadow-sm border group">
      {isOverdue && (
        <div className="absolute top-3 right-4 z-10">
          <div className="w-8 h-8 rounded-full bg-[#f7b013] flex items-center justify-center transition-all duration-300 cursor-help group-hover:w-auto group-hover:px-3 group-hover:shadow-sm border border-amber-500/20">
            <Droplet className="h-5 w-5 text-white group-hover:hidden" />
            {daysOverdue === 0 && <span className="hidden group-hover:block text-white whitespace-nowrap text-xs font-medium">Gießen heute fällig</span>}
            {daysOverdue === 1 && <span className="hidden group-hover:block text-white whitespace-nowrap text-xs font-medium">Gießen seit 1 Tag überfällig</span>}
            {daysOverdue > 1 && <span className="hidden group-hover:block text-white whitespace-nowrap text-xs font-medium">Gießen seit {daysOverdue} Tagen überfällig</span>}
          </div>
        </div>
      )}
      <Link href={`/items/${item.id}`} className="block">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-zinc-700">{item.name}</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <img src={item.image || undefined} alt={item.name} className="w-full h-48 object-contain transition-transform group-hover:scale-105" />
          <p className="text-sm text-muted-foreground mt-2">{item.location}</p>
          {item.wateringMinWeeks && item.wateringMaxWeeks && (
            <p className="text-xs text-muted-foreground">
              Gießen: Alle {item.wateringMinWeeks} bis {item.wateringMaxWeeks} Wochen
            </p>
          )}
        </CardContent>
      </Link>
      <CardFooter className="flex justify-end gap-2 items-center">
        <Button size="icon" variant="secondary" className="cursor-pointer" onClick={(e) => { e.preventDefault(); setEditing(true); }}>
          <Pencil className="h-4 w-4 text-blue-600" />
        </Button>
        <Button size="icon" variant="secondary" className="cursor-pointer" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </CardFooter>
    </Card>
  );
}