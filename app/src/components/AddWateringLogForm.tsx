"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { addWateringLog } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplet } from "lucide-react";

const AddWateringLogSchema = z.object({
  wateredAt: z.string().optional(),
  waterAmount: z.number().positive("Menge muss positiv sein").optional().or(z.literal("")),
  note: z.string().optional(),
});

type AddWateringLogInput = z.infer<typeof AddWateringLogSchema>;

export default function AddWateringLogForm({ plantId }: { plantId: number }) {
  const [editing, setEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddWateringLogInput>({
    resolver: zodResolver(AddWateringLogSchema),
  });

  async function onSubmit(data: AddWateringLogInput) {
    const waterAmount = data.waterAmount !== "" ? Number(data.waterAmount) : undefined;
    const wateredAt = data.wateredAt ? new Date(data.wateredAt) : undefined;
    await addWateringLog(plantId, waterAmount, data.note || undefined, wateredAt);
    reset();
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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <div className="grid gap-1">
          <Label htmlFor="wateredAt" className="text-xs text-zinc-500">Datum</Label>
          <Input type="date" {...register("wateredAt")} id="wateredAt" className="h-9 text-zinc-700" />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="waterAmount" className="text-xs text-zinc-500">Menge (ml)</Label>
          <Input type="number" {...register("waterAmount")} id="waterAmount" placeholder="Optional: Menge in ml" className="h-9 focus-visible:ring-blue-400 text-zinc-700" />
          {errors.waterAmount && <p className="text-xs text-red-500">{errors.waterAmount.message}</p>}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="note" className="text-xs text-zinc-500">Notiz</Label>
          <Input {...register("note")} id="note" placeholder="Optional: Notiz" className="h-9 focus-visible:ring-blue-400 text-zinc-700" />
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(false)}>Abbrechen</Button>
          <Button type="submit" variant="default" size="sm">Speichern</Button>
        </div>
      </form>
    </div>
  );
}