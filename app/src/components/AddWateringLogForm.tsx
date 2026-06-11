"use client";

import { useState } from "react";
import { addWateringLog } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplet } from "lucide-react";

export default function AddWateringLogForm({ plantId }: { plantId: number }) {
  const [editing, setEditing] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const waterAmountRaw = formData.get("waterAmount") as string;
    const waterAmount = waterAmountRaw ? Number(waterAmountRaw) : undefined;
    const note = formData.get("note") as string;

    await addWateringLog(plantId, waterAmount, note);
    setEditing(false);
  }

  if (!editing) {
    return (
      <Button 
        onClick={() => setEditing(true)} 
        className="bg-blue-100 hover:bg-blue-200 text-blue-700 self-start cursor-pointer"
      >
        <Droplet className="mr-2 h-4 w-4" /> Pflanze gießen
      </Button>
    );
  }

  return (
    <div className="border rounded-xl p-4 bg-zinc-50 flex flex-col gap-4 max-w-xs">
      <h3 className="font-semibold text-zinc-800 flex items-center gap-2">
        <Droplet className="h-4 w-4 text-blue-500" /> Neue Bewässerung
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid gap-1">
          <Label htmlFor="waterAmount" className="text-xs text-zinc-500">Menge (ml)</Label>
          <Input type="number" name="waterAmount" id="waterAmount" placeholder="Optional: Menge in ml" className="h-9 focus-visible:ring-blue-400 text-zinc-700" />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="note" className="text-xs text-zinc-500">Notiz</Label>
          <Input name="note" id="note" placeholder="Optional: Notiz" className="h-9 focus-visible:ring-blue-400 text-zinc-700" />
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(false)}>Abbrechen</Button>
          <Button type="submit" variant="default" size="sm">Speichern</Button>
        </div>
      </form>
    </div>
  );
}