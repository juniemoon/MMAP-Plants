"use client";
import { useState } from "react";
import { createPlant } from "@/app/actions";

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

  if (!open) return (
    <button onClick={() => setOpen(true)}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-lime-200 px-5 text-zinc-700 shadow-xs transition-colors hover:bg-lime-300 md:w-[240px] cursor-pointer whitespace-nowrap">
      + Neue Pflanze hinzufügen
    </button>
  );

  return (
    <div className="bg-foreground rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-semibold text-zinc-700">Neue Pflanze</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 text-zinc-600">
        <input required name="name" placeholder="Name" className="border rounded px-3 py-1.5 text-sm focus:outline-none" />
        <input required name="location" placeholder="Standort" className="border rounded px-3 py-1.5 text-sm focus:outline-none" />
        <input required name="watering" placeholder="Gießen (z.B. alle 7 Tage)" className="border rounded px-3 py-1.5 text-sm focus:outline-none" />
        <input required name="sunlight" placeholder="Licht" className="border rounded px-3 py-1.5 text-sm focus:outline-none" />
        <input required name="humidity" type="number" placeholder="Luftfeuchtigkeit (%)" className="border rounded px-3 py-1.5 text-sm focus:outline-none" />
        <select name="status" className="border rounded px-3 py-1.5 text-sm focus:outline-none">
          <option value="unknown">Unbekannt</option>
          <option value="healthy">Gesund</option>
          <option value="thirsty">Durstig</option>
          <option value="needs-sunlight">Braucht Sonne</option>
        </select>
        <div className="flex gap-2 mt-1">
          <button type="submit" className="bg-lime-300 rounded px-4 py-1.5 text-sm font-medium hover:bg-lime-400">Speichern</button>
          <button type="button" onClick={() => setOpen(false)} className="text-sm text-zinc-400 hover:text-black">Abbrechen</button>
        </div>
      </form>
    </div>
  );
}