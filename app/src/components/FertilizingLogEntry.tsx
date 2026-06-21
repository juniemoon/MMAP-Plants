"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateFertilizingLog } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, X, Check } from "lucide-react";
import { useState } from "react";

const FertilizingLogEntrySchema = z.object({
  fertilizedAt: z.string().optional(),
  fertilizerType: z.string().optional().nullable(),
  amount: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
});

type FertilizingLogEntryInput = z.infer<typeof FertilizingLogEntrySchema>;

interface FertilizingLogEntryProps {
  log: {
    id: number;
    fertilizedAt: Date;
    fertilizerType: string | null;
    amount: string | null;
    note: string | null;
  };
}

export default function FertilizingLogEntry({ log }: FertilizingLogEntryProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FertilizingLogEntryInput>({
    resolver: zodResolver(FertilizingLogEntrySchema),
    defaultValues: {
      fertilizedAt: new Date(log.fertilizedAt).toISOString().split("T")[0],
      fertilizerType: log.fertilizerType ?? "",
      amount: log.amount ?? "",
      note: log.note ?? "",
    },
  });

  async function onSubmit(data: FertilizingLogEntryInput) {
    const fertilizedAt = data.fertilizedAt ? new Date(data.fertilizedAt) : undefined;
    await updateFertilizingLog(log.id, data.fertilizerType || undefined, data.amount || undefined, data.note || undefined, fertilizedAt);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="border rounded-xl px-3 py-3 flex flex-col gap-3 bg-zinc-50 transition-all shadow-inner">
        <div className="grid gap-1">
          <Label htmlFor="fertilizedAt" className="text-xs text-zinc-500">Datum</Label>
          <Input type="date" {...register("fertilizedAt")} id="fertilizedAt" className="h-8 text-zinc-700 w-fit" />
        </div>
        <div className="flex gap-2 items-center">
          <Label className="text-xs text-zinc-500">Dünger:</Label>
          <Input {...register("fertilizerType")} placeholder="Düngerart" className="h-8 w-36 text-zinc-700" />
          <Label className="text-xs text-zinc-500">Menge:</Label>
          <Input {...register("amount")} placeholder="Menge" className="h-8 w-24 text-zinc-700" />
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
          <span className="font-semibold text-zinc-700">{new Date(log.fertilizedAt).toLocaleDateString("de-DE")}</span>
          {log.fertilizerType && <span> · <span className="font-semibold">Dünger:</span> {log.fertilizerType}</span>}
          {log.amount && <span> · <span className="font-semibold">Menge:</span> {log.amount}</span>}
        </p>
        {log.note && <p><span className="font-semibold">Notiz:</span> {log.note}</p>}
      </div>
      <Button size="icon" variant="secondary" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setIsEditing(true)}>
        <Pencil className="h-3.5 w-3.5 text-blue-600" />
      </Button>
    </div>
  );
}
