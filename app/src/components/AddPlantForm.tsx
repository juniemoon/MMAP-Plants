"use client";
import { useState } from "react";
import { createPlant } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

export default function AddPlantForm() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    await createPlant(
      data.get("name") as string,
      data.get("location") as string,
      data.get("status") as string,
      data.get("watering") as string,
      data.get("sunlight") as string,
      Number(data.get("humidity")),
    );
    form.reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-lime-200 hover:bg-lime-300 text-zinc-700 h-12 px-6 cursor-pointer">
          <Plus className="mr-2 h-5 w-5" /> Neue Pflanze hinzufügen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Neue Pflanze hinzufügen</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          <Input required name="name" placeholder="Name der Pflanze" />
          <Input required name="location" placeholder="Standort (z.B. Wohnzimmer)" />
          <Input required name="watering" placeholder="Gießen (z.B. alle 7 Tage)" />
          <Input required name="sunlight" placeholder="Lichtbedarf" />
          <Input required name="humidity" type="number" placeholder="Luftfeuchtigkeit (%)" />
          <Select name="status" defaultValue="unknown">
            <SelectTrigger>
              <SelectValue placeholder="Status wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unknown">Unbekannt</SelectItem>
              <SelectItem value="healthy">Gesund</SelectItem>
              <SelectItem value="thirsty">Durstig</SelectItem>
              <SelectItem value="needs-sunlight">Braucht Sonne</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-3 mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Abbrechen</Button>
            <Button type="submit" className="bg-lime-500 hover:bg-lime-600 text-white">Speichern</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}