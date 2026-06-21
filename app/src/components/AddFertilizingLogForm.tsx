"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { addFertilizingLog } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout } from "lucide-react";

const AddFertilizingLogSchema = z.object({
  fertilizedAt: z.string().optional(),
  fertilizerType: z.string().optional().nullable(),
  amount: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
});

type AddFertilizingLogInput = z.infer<typeof AddFertilizingLogSchema>;

export default function AddFertilizingLogForm({ plantId }: { plantId: number }) {
  const [editing, setEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddFertilizingLogInput>({
    resolver: zodResolver(AddFertilizingLogSchema),
  });

  async function onSubmit(data: AddFertilizingLogInput) {
    const fertilizedAt = data.fertilizedAt ? new Date(data.fertilizedAt) : undefined;
    await addFertilizingLog(plantId, data.fertilizerType || undefined, data.amount || undefined, data.note || undefined, fertilizedAt);
    reset();
    setEditing(false);
  }

  if (!editing) {
    return (
      <Button
        onClick={() => setEditing(true)}
        className="bg-lime-100 hover:bg-lime-200 text-lime-700 self-start cursor-pointer"
      >
        <Sprout className="mr-2 h-4 w-4" /> Düngen
      </Button>
    );
  }

  return (
    <div className="border rounded-xl p-4 bg-zinc-50 flex flex-col gap-4 max-w-xs">
      <h3 className="font-semibold text-zinc-800 flex items-center gap-2">
        <Sprout className="h-4 w-4 text-lime-600" /> Neue Düngung
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="grid gap-1">
          <Label htmlFor="fertilizedAt" className="text-xs text-zinc-500">Datum</Label>
          <Input type="date" {...register("fertilizedAt")} id="fertilizedAt" className="h-9 text-zinc-700" />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="fertilizerType" className="text-xs text-zinc-500">Dünger</Label>
          <Input {...register("fertilizerType")} id="fertilizerType" placeholder="z.B. Volldünger" className="h-9 focus-visible:ring-lime-400 text-zinc-700" />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="amount" className="text-xs text-zinc-500">Menge</Label>
          <Input {...register("amount")} id="amount" placeholder="z.B. 10ml" className="h-9 focus-visible:ring-lime-400 text-zinc-700" />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="note" className="text-xs text-zinc-500">Notiz</Label>
          <Input {...register("note")} id="note" placeholder="Optional: Notiz" className="h-9 focus-visible:ring-lime-400 text-zinc-700" />
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(false)}>Abbrechen</Button>
          <Button type="submit" variant="default" size="sm">Speichern</Button>
        </div>
      </form>
    </div>
  );
}
