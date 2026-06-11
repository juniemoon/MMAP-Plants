"use client";
import Link from "next/link";
import { deletePlant, updatePlant } from "@/app/actions";
import type { Plant, WateringLog } from "@/generated/prisma/client";
import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Droplet } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function PlantCard({ item }: { item: Plant & { wateringLogs: WateringLog[] } }) {
  const [editing, setEditing] = useState(false);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const status = data.get("status") as string;
    await updatePlant(
      item.id,
      data.get("name") as string,
      data.get("location") as string,
      status,
      Number(data.get("wateringMinWeeks") || 1),
      Number(data.get("wateringMaxWeeks") || 2),
      data.get("sunlight") as string,
      Number(data.get("humidity")),
      item.image ?? undefined,
    );
    setEditing(false);
  }

  if (editing) return (
    <Card className="p-4 shadow-sm border">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 text-zinc-700">
        <Input required name="name" defaultValue={item.name} placeholder="Name"/>
        <Input required name="location" defaultValue={item.location || ""} placeholder="Standort"/>

        <div className="flex flex-wrap items-center gap-2 pl-2">
          <Label htmlFor="wateringMinWeeks" className="whitespace-nowrap">
            Gießen: Alle
          </Label>
          <Select name="wateringMinWeeks" defaultValue={item.wateringMinWeeks?.toString() || "1"}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              {[1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="whitespace-nowrap">bis</span>
          <Select name="wateringMaxWeeks" defaultValue={item.wateringMaxWeeks?.toString() || "2"}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Max" />
            </SelectTrigger>
            <SelectContent>
              {[1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="whitespace-nowrap">Wochen</span>
        </div>

        <Input required name="sunlight" defaultValue={item.sunlight ?? ""} placeholder="Licht"/>
        <Input required name="humidity" type="number" defaultValue={item.humidity ?? 50} placeholder="Luftfeuchtigkeit (%)" className="w-20 self-start" />
        <Select name="status" defaultValue={item.status}>
          <SelectTrigger>
            <SelectValue placeholder="Status wählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unknown">Unbekannt</SelectItem>
            <SelectItem value="healthy">Gesund</SelectItem>
            <SelectItem value="thirsty">Durstig</SelectItem>
            <SelectItem value="needs-sunlight">Braucht Sonne</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2 mt-8 justify-end">
          <Button type="submit" variant="default" className="bg-lime-300 hover:bg-lime-400 text-zinc-700 hover:text-black">Speichern</Button>
          <Button type="button" variant="ghost" className="text-zinc-700 hover:text-black" onClick={() => setEditing(false)}>Abbrechen</Button>
        </div>
      </form>
    </Card>
  );

  return (
    <Card className="relative overflow-hidden shadow-sm border">
      {isOverdue && ( // isOverdue already checks for wateringLogs.length > 0
        <div className="absolute top-3 right-4 group/badge z-10">
          <div className="w-8 h-8 rounded-full bg-[#f7b013] flex items-center justify-center transition-all duration-300 cursor-help group-hover/badge:w-auto group-hover/badge:px-3 group-hover/badge:shadow-sm border border-amber-500/20">
            <Droplet className="h-5 w-5 text-white group-hover/badge:hidden" />
            <span className="hidden group-hover/badge:block text-white whitespace-nowrap text-xs font-medium">
              Gießen seit {daysOverdue} Tagen überfällig
            </span>
          </div>
        </div>
      )}

      <Link href={`/items/${item.id}`} className="block group">
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
        <Button size="icon" variant="ghost" className="cursor-pointer" onClick={(e) => { e.preventDefault(); setEditing(true); }}>
          <Pencil className="h-4 w-4 text-blue-600" />
        </Button>
        <Button size="icon" variant="ghost" className="cursor-pointer" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </CardFooter>
    </Card>
  );
}