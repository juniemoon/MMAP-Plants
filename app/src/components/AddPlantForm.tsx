"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { createPlant } from "@/app/actions";
import { PlantSchema, type PlantInput } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function AddPlantForm() {
  const [open, setOpen] = useState(false);
  const [hasFile, setHasFile] = useState(false);

  const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm<PlantInput>({
    resolver: zodResolver(PlantSchema),
    defaultValues: {
      status: "idk",
      wateringMinWeeks: 1,
      wateringMaxWeeks: 2,
    },
  });

  const status = watch("status");

  async function onSubmit(data: PlantInput) {
    const formEl = document.querySelector("form#addPlantForm") as HTMLFormElement;
    const rawForm = new FormData(formEl);
    const file = rawForm.get("image") as File;

    await createPlant(
      data.name,
      data.location,
      data.status,
      data.wateringMinWeeks,
      data.wateringMaxWeeks,
      data.sunlight ?? "",
      data.humidity ?? 0,
      file,
      status === "healthy" ? "" : (data.illness ?? "")
    );

    reset();
    setHasFile(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-lime-200 hover:bg-lime-300 text-zinc-700 h-12 px-6">
          <Plus className="mr-2 h-5 w-5" /> Neue Pflanze hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Neue Pflanze hinzufügen</DialogTitle>
        </DialogHeader>
        <form id="addPlantForm" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-4">
          <div className="grid gap-1">
            <Input {...register("name")} placeholder="Name der Pflanze" />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="grid gap-1">
            <Input {...register("location")} placeholder="Standort (z.B. Wohnzimmer)" />
            {errors.location && <p className="text-xs text-red-500">{errors.location.message}</p>}
          </div>

          <div className="flex items-center gap-2">
            <Label className="whitespace-nowrap pl-1.5">Gießen: Alle</Label>
            <Controller
              control={control}
              name="wateringMinWeeks"
              render={({ field }) => (
                <Select onValueChange={(v) => field.onChange(Number(v))} defaultValue={field.value?.toString()}>
                  <SelectTrigger className="w-[80px]"><SelectValue placeholder="Min" /></SelectTrigger>
                  <SelectContent>
                    {[1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8].map((v) => (
                      <SelectItem key={v} value={v.toString()}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <span className="whitespace-nowrap">bis</span>
            <Controller
              control={control}
              name="wateringMaxWeeks"
              render={({ field }) => (
                <Select onValueChange={(v) => field.onChange(Number(v))} defaultValue={field.value?.toString()}>
                  <SelectTrigger className="w-[80px]"><SelectValue placeholder="Max" /></SelectTrigger>
                  <SelectContent>
                    {[1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8].map((v) => (
                      <SelectItem key={v} value={v.toString()}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <span className="whitespace-nowrap">Wochen</span>
          </div>
          {errors.wateringMaxWeeks && <p className="text-xs text-red-500">{errors.wateringMaxWeeks.message}</p>}

          <div className="grid gap-1">
            <Input {...register("sunlight")} placeholder="Lichtbedarf" />
            {errors.sunlight && <p className="text-xs text-red-500">{errors.sunlight.message}</p>}
          </div>

          <div className="grid gap-1">
            <Input {...register("humidity")} type="number" placeholder="Luftfeuchtigkeit (%)" />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <span className="pl-1.5 text-zinc-500 cursor-default">Bild auswählen</span>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(e) => setHasFile(!!e.target.files?.[0])}
              className={`file:text-zinc-500 cursor-pointer ${hasFile ? "text-black" : "text-zinc-500"}`}
            />
          </div>

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger><SelectValue placeholder="Status wählen" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="idk">Unbekannt</SelectItem>
                  <SelectItem value="healthy">Gesund</SelectItem>
                  <SelectItem value="sick">Krank/Schädlinge</SelectItem>
                  <SelectItem value="recovering">in Genesung</SelectItem>
                  <SelectItem value="critical">Kritisch</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

          <Input
            {...register("illness")}
            placeholder="Krankheit / Schädlinge"
            disabled={status === "healthy"}
          />

          <div className="flex justify-end gap-3 mt-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Abbrechen</Button>
            <Button type="submit" variant="default">Speichern</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}