"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addRepottingLog } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cylinder } from "lucide-react";

const RepotSchema = z.object({
  repottedAt: z.string().optional(),
  soilType: z.string().optional().nullable(),
  oldPotSize: z.coerce.number().positive().optional().nullable(),
  newPotSize: z.coerce.number().positive().optional().nullable(),
  plantDivided: z.boolean().optional().nullable(),
  note: z.string().optional().nullable(),
});

type RepotInput = z.infer<typeof RepotSchema>;

export default function AddRepottingLogForm({ plantId }: { plantId: number }) {
  const [editing, setEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RepotInput>({
    resolver: zodResolver(RepotSchema),
  });

  async function onSubmit(data: RepotInput) {
    const repottedAt = data.repottedAt ? new Date(data.repottedAt) : undefined;
    await addRepottingLog(plantId, repottedAt, data.soilType || undefined, data.oldPotSize || undefined, data.newPotSize || undefined, data.plantDivided || undefined, data.note || undefined);
    reset();
    setEditing(false);
  }

  if (!editing) {
    return (
      <Button
        onClick={() => setEditing(true)}
        className="bg-orange-100 hover:bg-orange-200 text-orange-700 self-start cursor-pointer"
      >
        <Cylinder className="mr-2 h-4 w-4" /> Umtopfen
      </Button>
    );
  }

  return (
    <div className="border rounded-xl p-4 bg-zinc-50 flex flex-col gap-4 max-w-xs">
      <h3 className="font-semibold text-zinc-800 flex items-center gap-2">
        <Cylinder className="h-4 w-4 text-orange-600" /> Neues Umtopfen
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="grid gap-1">
          <Label htmlFor="repottedAt" className="text-xs text-zinc-500">Datum</Label>
          <Input type="date" {...register("repottedAt")} id="repottedAt" className="h-9 text-zinc-700" />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="soilType" className="text-xs text-zinc-500">Erde</Label>
          <Input {...register("soilType")} id="soilType" placeholder="z.B. Universal" className="h-9 focus-visible:ring-orange-400 text-zinc-700" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="grid gap-1">
            <Label htmlFor="oldPotSize" className="text-xs text-zinc-500">Alter Topf (cm)</Label>
            <Input type="number" {...register("oldPotSize")} id="oldPotSize" placeholder="Optional" className="h-9 focus-visible:ring-orange-400 text-zinc-700" />
            {errors.oldPotSize && <p className="text-xs text-red-500">{errors.oldPotSize.message}</p>}
          </div>
          <div className="grid gap-1">
            <Label htmlFor="newPotSize" className="text-xs text-zinc-500">Neuer Topf (cm)</Label>
            <Input type="number" {...register("newPotSize")} id="newPotSize" placeholder="Optional" className="h-9 focus-visible:ring-orange-400 text-zinc-700" />
            {errors.newPotSize && <p className="text-xs text-red-500">{errors.newPotSize.message}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="plantDivided" {...register("plantDivided")} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
          <Label htmlFor="plantDivided" className="text-xs text-zinc-700 cursor-pointer">Pflanze geteilt</Label>
        </div>
        <div className="grid gap-1">
          <Label htmlFor="note" className="text-xs text-zinc-500">Notiz</Label>
          <Input {...register("note")} id="note" placeholder="Optional: Notiz" className="h-9 focus-visible:ring-orange-400 text-zinc-700" />
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(false)}>Abbrechen</Button>
          <Button type="submit" variant="default" size="sm">Speichern</Button>
        </div>
      </form>
    </div>
  );
}
