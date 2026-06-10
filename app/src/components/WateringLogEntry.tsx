"use client";

import { useState } from "react";
import { updateWateringLog } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

    await updateWateringLog(log.id, waterAmount, note);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="border rounded px-3 py-2 flex flex-col gap-2 bg-zinc-50 transition-all shadow-inner">
        <p className="text-xs text-zinc-400 font-medium">
          {new Date(log.wateredAt).toLocaleString("de-DE")} (Datum nicht änderbar)
        </p>
        <div className="flex gap-2 items-center">
          <Input type="number" name="waterAmount" defaultValue={log.waterAmount ?? ""} placeholder="ml" className="h-8 w-24 text-zinc-700" />
          <Input name="note" defaultValue={log.note ?? ""} placeholder="Notiz" className="h-8 flex-1 text-zinc-700" />
          <div className="flex gap-1">
            <Button type="submit" size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700">
              <Check className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-zinc-400 hover:text-zinc-600" onClick={() => setIsEditing(false)}>
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
          <span className="font-semibold text-zinc-700">{new Date(log.wateredAt).toLocaleString("de-DE")}</span>
          {log.waterAmount !== null && <span> · <span className="font-semibold">Menge:</span> {log.waterAmount} ml</span>}
        </p>
        {log.note && <p><span className="font-semibold">Notiz:</span> {log.note}</p>}
      </div>
      <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setIsEditing(true)}>
        <Pencil className="h-3.5 w-3.5 text-blue-600" />
      </Button>
    </div>
  );
}