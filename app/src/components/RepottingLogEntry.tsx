"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateRepottingLog } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, X, Check } from "lucide-react";
import { useState } from "react";

const RepotEntrySchema = z.object({
  repottedAt: z.string().optional(),
  soilType: z.string().optional().nullable(),
  oldPotSize: z.coerce.number().positive().optional().or(z.literal("")),
  newPotSize: z.coerce.number().positive().optional().or(z.literal("")),
  plantDivided: z.boolean().optional().nullable(),
  note: z.string().optional().nullable(),
});

type RepotEntryInput = z.infer<typeof RepotEntrySchema>;

interface RepottingLogEntryProps {
  log: {
    id: number;
    repottedAt: Date;
    soilType: string | null;
    oldPotSize: number | null;
    newPotSize: number | null;
    plantDivided: boolean | null;
    note: string | null;
  };
}

export default function RepottingLogEntry({ log }: RepottingLogEntryProps) {
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RepotEntryInput>({
    resolver: zodResolver(RepotEntrySchema),
    defaultValues: {
      repottedAt: new Date(log.repottedAt).toISOString().split("T")[0],
      soilType: log.soilType ?? "",
      oldPotSize: log.oldPotSize ?? undefined,
      newPotSize: log.newPotSize ?? undefined,
      plantDivided: log.plantDivided ?? false,
      note: log.note ?? "",
    },
  });

  async function onSubmit(data: RepotEntryInput) {
    const repottedAt = data.repottedAt ? new Date(data.repottedAt) : undefined;
    const oldPotSize = data.oldPotSize !== "" ? Number(data.oldPotSize) : undefined;
    const newPotSize = data.newPotSize !== "" ? Number(data.newPotSize) : undefined;
    await updateRepottingLog(log.id, repottedAt, data.soilType || undefined, oldPotSize, newPotSize, data.plantDivided || undefined, data.note || undefined);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="border rounded-xl px-3 py-3 flex flex-col gap-3 bg-zinc-50 transition-all shadow-inner">
        <div className="grid gap-1">
          <Label htmlFor="repottedAt" className="text-xs text-zinc-500">Datum</Label>
          <Input type="date" {...register("repottedAt")} id="repottedAt" className="h-8 text-zinc-700 w-fit" />
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <Label className="text-xs text-zinc-500">Erde:</Label>
          <Input {...register("soilType")} placeholder="Erde" className="h-8 w-32 text-zinc-700" />
          <Label className="text-xs text-zinc-500">Alt:</Label>
          <Input type="number" {...register("oldPotSize")} placeholder="cm" className="h-8 w-16 text-zinc-700" />
          {errors.oldPotSize && <p className="text-xs text-red-500">{errors.oldPotSize.message}</p>}
          <Label className="text-xs text-zinc-500">Neu:</Label>
          <Input type="number" {...register("newPotSize")} placeholder="cm" className="h-8 w-16 text-zinc-700" />
          {errors.newPotSize && <p className="text-xs text-red-500">{errors.newPotSize.message}</p>}
          <div className="flex items-center gap-1">
            <input type="checkbox" {...register("plantDivided")} id={`divided-${log.id}`} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
            <Label htmlFor={`divided-${log.id}`} className="text-xs text-zinc-500 cursor-pointer">geteilt</Label>
          </div>
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
          <span className="font-semibold text-zinc-700">{new Date(log.repottedAt).toLocaleDateString("de-DE")}</span>
          {log.soilType && <span> · <span className="font-semibold">Erde:</span> {log.soilType}</span>}
          {(log.oldPotSize != null || log.newPotSize != null) && (
            <span> · <span className="font-semibold">Topf:</span> {log.oldPotSize ?? "?"}cm → {log.newPotSize ?? "?"}cm</span>
          )}
          {log.plantDivided && <span> · <span className="font-semibold">geteilt</span></span>}
        </p>
        {log.note && <p><span className="font-semibold">Notiz:</span> {log.note}</p>}
      </div>
      <Button size="icon" variant="secondary" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setIsEditing(true)}>
        <Pencil className="h-3.5 w-3.5 text-blue-600" />
      </Button>
    </div>
  );
}
