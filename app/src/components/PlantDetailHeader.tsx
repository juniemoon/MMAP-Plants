"use client";

import { useState } from "react";
import { updatePlant } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Pencil, Check, X, ImageIcon } from "lucide-react";
import type { Plant, WateringLog } from "@/generated/prisma/client";

interface PlantDetailHeaderProps {
  plant: Plant & { wateringLogs: WateringLog[] };
}

export default function PlantDetailHeader({ plant }: PlantDetailHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(plant.status);
  const [illness, setIllness] = useState(plant.illness || "");

  const statusLabels: Record<string, string> = {
    unknown: "Unbekannt",
    healthy: "Gesund",
    sick: "Krank/Schädlinge",
    recovering: "in Genesung",
    critical: "Kritisch",
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const file = data.get("image") as File;

    await updatePlant(
      plant.id,
      data.get("name") as string,
      data.get("location") as string,
      status,
      Number(data.get("wateringMinWeeks")),
      Number(data.get("wateringMaxWeeks")),
      data.get("sunlight") as string,
      Number(data.get("humidity")),
      file.size > 0 ? file : plant.image,
      status === "healthy" ? "" : illness
    );
    setEditing(false);
  }

  if (editing) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-6 animate-in fade-in duration-300">
        <div className="flex items-center gap-4">
          <Input required name="name" defaultValue={plant.name} className="text-3xl font-medium h-auto py-1 px-2 w-full max-w-md bg-white" placeholder="Name der Pflanze" />
        </div>

        <div className="flex gap-8 items-start flex-wrap sm:flex-nowrap">
          <div className="flex flex-col gap-3">
            <img src={plant.image} alt={plant.name} className="w-48 h-64 object-contain opacity-40 border rounded-lg bg-zinc-50" />
            <div className="flex flex-col gap-1.5 text-zinc-400">
              <Label htmlFor="image" className="text-xs uppercase font-bold text-zinc-400 flex items-center gap-1"><ImageIcon className="h-3 w-3" /> Bild ändern</Label>
              <Input id="image" name="image" type="file" accept="image/*" className=" file:text-zinc-500 w-48 text-xs cursor-pointer" />
            </div>
          </div>

          <div className="flex flex-col gap-4 flex-1 max-w-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Standort</Label>
                <Input required name="location" defaultValue={plant.location} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Lichtbedarf</Label>
                <Input required name="sunlight" defaultValue={plant.sunlight || ""} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Gießintervall (Wochen)</Label>
              <div className="flex items-center gap-2">
                <Select name="wateringMinWeeks" defaultValue={plant.wateringMinWeeks?.toString() || "1"}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>{[1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8].map(v => <SelectItem key={v} value={v.toString()}>{v}</SelectItem>)}</SelectContent>
                </Select>
                <span className="text-zinc-400">bis</span>
                <Select name="wateringMaxWeeks" defaultValue={plant.wateringMaxWeeks?.toString() || "2"}>
                  <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                  <SelectContent>{[1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8].map(v => <SelectItem key={v} value={v.toString()}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Luftfeuchtigkeit (%)</Label>
                <Input required type="number" name="humidity" defaultValue={plant.humidity || 50} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Status</Label>
                <Select name="status" value={status} onValueChange={(val) => { setStatus(val); if (val === "healthy") setIllness(""); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(statusLabels).map(([val, label]) => <SelectItem key={val} value={val}>{label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Krankheit / Schädlinge</Label>
              <Input name="illness" value={illness} onChange={(e) => setIllness(e.target.value)} disabled={status === "healthy"} placeholder={status === "healthy" ? "Keine" : "Beschreibung..."} />
            </div>

            <div className="flex justify-end gap-2 mt-2">
                <Button type="button" variant="secondary" onClick={() => setEditing(false)}><X/> Abbrechen</Button>
                <Button type="submit" variant="default"><Check/> Speichern</Button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-semibold text-black">{plant.name}</h1>
        <Button variant="secondary" size="sm" onClick={() => setEditing(true)} className="text-blue-600">
          <Pencil className="h-4 w-4 mr-2" /> Bearbeiten
        </Button>
      </div>

      <div className="flex gap-8 items-start">
        <img src={plant.image} alt={plant.name} className="w-48 h-64 object-contain" />
        <div className="flex flex-col gap-3 text-zinc-700">
          <p><span className="font-semibold">Standort:</span> {plant.location}</p>
          <p><span className="font-semibold">Gießen: </span>Alle {plant.wateringMinWeeks} bis {plant.wateringMaxWeeks} Wochen</p>
          <p><span className="font-semibold">Licht:</span> {plant.sunlight}</p>
          <p><span className="font-semibold">Luftfeuchtigkeit:</span> {plant.humidity}%</p>
          <p><span className="font-semibold">Status:</span> {statusLabels[plant.status] ?? plant.status}</p>
          <p><span className="font-semibold">Krankheit/Schädlinge:</span> {plant.illness || "keine"}</p>
        </div>
      </div>
    </div>
  );
}