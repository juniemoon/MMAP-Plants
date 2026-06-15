"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateWateringLog } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, X, Check } from "lucide-react";
import { useState } from "react";

const WateringLogEntrySchema = z.object({
  wateredAt: z.string().optional(),
  waterAmount: z.number().positive("Menge muss positiv sein").optional().or(z.literal("")),
  note: z.string().optional(),
});

type WateringLogEntryInput = z.infer<typeof WateringLogEntrySchema>;

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

  const { register, handleSubmit, formState: { errors } } = useForm<WateringLogEntryInput>({
    resolver: zodResolver(WateringLogEntrySchema),
    defaultValues: {
      wateredAt: new Date(log.wateredAt).toISOString().split("T")[0],
      waterAmount: log.waterAmount ?? undefined,
      note: log.note ?? "",
    },
  });

  async function onSubmit(data: WateringLogEntryInput) {
    const waterAmount = data.waterAmount !== "" ? Number(data.waterAmount) : undefined;
    const wateredAt = data.wateredAt ? new Date(data.wateredAt) : undefined;
    await updateWateringLog(log.id, waterAmount, data.note || undefined, wateredAt);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="border rounded-xl px-3 py-3 flex flex-col gap-3 bg-zinc-50 transition-all shadow-inner">
        <div className="grid gap-1">
          <Label htmlFor="wateredAt" className="text-xs text-zinc-500">Datum</Label>
          <Input type="date" {...register("wateredAt")} id="wateredAt" className="h-8 text-zinc-700 w-fit" />
        </div>
        <div className="flex gap-2 items-center">
          <Label className="text-xs text-zinc-500">Menge:</Label>
          <Input type="number" {...register("waterAmount")} placeholder="ml" className="h-8 w-24 text-zinc-700" />
          {errors.waterAmount && <p className="text-xs text-red-500">{errors.waterAmount.message}</p>}
          <Label className="text-xs text-zinc-500">Notiz:</Label>
          <Input {...register("note")} placeholder="Notiz" className="h-8 flex-1 text-zinc-700" />
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