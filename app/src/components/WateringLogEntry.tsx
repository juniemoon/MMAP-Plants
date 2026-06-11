"use client";

import { useState } from "react";
import { updateWateringLog } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, X, Check } from "lucide-react";

interface WateringLogEntryProps {
  log: {
    id: number;
    wateredAt: Date;
    waterAmount: number | null;
    note: string | null;
  };
}

export default function WateringLogEntry({ log }: WateringLogEntryProps) {
  const [isEditing, setIsEditing] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const waterAmountRaw = formData.get("waterAmount") as string;
    const waterAmount = waterAmountRaw ? Number(waterAmountRaw) : undefined;
    const note = formData.get("note") as string;
    const wateredAtRaw = formData.get("wateredAt") as string;
    const wateredAt = wateredAtRaw ? new Date(wateredAtRaw) : undefined;

    await updateWateringLog(log.id, waterAmount, note, wateredAt);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="border rounded-xl px-3 py-3 flex flex-col gap-3 bg-zinc-50 transition-all shadow-inner">
        <div className="grid gap-1">
          <Label htmlFor="wateredAt" className="text-xs text-zinc-500">Datum</Label>
          <Input 
            type="date" 
            name="wateredAt" 
            id="wateredAt" 
            defaultValue={new Date(log.wateredAt).toISOString().split('T')[0]} 
            className="h-8 text-zinc-700 w-fit" 
          />
        </div>
        <div className="flex gap-2 items-center">
          <Label htmlFor="waterAmount" className="text-xs text-zinc-500">Menge:</Label>
          <Input type="number" name="waterAmount" defaultValue={log.waterAmount ?? ""} placeholder="ml" className="h-8 w-24 text-zinc-700" />
          <Label htmlFor="note" className="text-xs text-zinc-500">Notiz:</Label>
          <Input name="note" defaultValue={log.note ?? ""} placeholder="Notiz" className="h-8 flex-1 text-zinc-700" />
          <div className="flex gap-1">
            <Button type="submit" size="icon" variant="secondary" className="h-8 w-8 text-green-600 hover:text-green-700">
              <Check className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="secondary" className="h-8 w-8 text-zinc-400 hover:text-zinc-600" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="group border rounded px-3 py-2 text-sm text-zinc-700 flex justify-between items-start hover:bg-zinc-50 transition-colors">
      <div>
        <p>
          <span className="font-semibold text-zinc-700">{new Date(log.wateredAt).toLocaleDateString("de-DE")}</span>
          {log.waterAmount !== null && <span> · <span className="font-semibold">Menge:</span> {log.waterAmount} ml</span>}
        </p>
        {log.note && <p><span className="font-semibold">Notiz:</span> {log.note}</p>}
      </div>
      <Button size="icon" variant="secondary" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setIsEditing(true)}>
        <Pencil className="h-3.5 w-3.5 text-blue-600" />
      </Button>
    </div>
  );
}