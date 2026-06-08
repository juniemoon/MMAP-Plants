"use client";
import Link from "next/link";
import { deletePlant, updatePlant } from "@/app/actions";
import type { Plant } from "@/generated/prisma/client";
import { useState } from "react";

export default function PlantCard({ item }: { item: Plant }) {
  const [editing, setEditing] = useState(false);

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (confirm(`${item.name} wirklich löschen?`)) {
      await deletePlant(item.id);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    await updatePlant(
      item.id,
      data.get("name") as string,
      data.get("location") as string,
      data.get("status") as string,
      data.get("watering") as string,
      data.get("sunlight") as string,
      Number(data.get("humidity")),
      item.image ?? undefined,
    );
    setEditing(false);
  }

  if (editing) return (
    <div className="bg-foreground h-auto p-4 shadow-md rounded-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 text-zinc-700">
        <input required name="name" defaultValue={item.name} placeholder="Name" className="border rounded px-3 py-1.5 text-sm focus:outline-none" />
        <input required name="location" defaultValue={item.location ?? ""} placeholder="Standort" className="border rounded px-3 py-1.5 text-sm focus:outline-none" />
        <input required name="watering" defaultValue={item.watering ?? ""} placeholder="Gießen" className="border rounded px-3 py-1.5 text-sm focus:outline-none" />
        <input required name="sunlight" defaultValue={item.sunlight ?? ""} placeholder="Licht" className="border rounded px-3 py-1.5 text-sm focus:outline-none" />
        <input required name="humidity" type="number" defaultValue={item.humidity ?? 50} placeholder="Luftfeuchtigkeit (%)" className="border rounded px-3 py-1.5 text-sm focus:outline-none" />
        <select name="status" defaultValue={item.status} className="border rounded px-3 py-1.5 text-sm focus:outline-none">
          <option value="unknown">Unbekannt</option>
          <option value="healthy">Gesund</option>
          <option value="thirsty">Durstig</option>
          <option value="needs-sunlight">Braucht Sonne</option>
        </select>
        <div className="flex gap-2 mt-1">
          <button type="submit" className="bg-lime-300 rounded px-4 py-1.5 text-sm font-medium hover:bg-lime-400 cursor-pointer">Speichern</button>
          <button type="button" onClick={() => setEditing(false)} className="text-sm text-zinc-400 hover:text-black cursor-pointer">Abbrechen</button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="relative">
      <Link
        href={`/items/${item.id}`}
        className="bg-foreground h-auto p-4 shadow-md hover:shadow-lg transition-shadow rounded-lg cursor-pointer block"
      >
        <h3 className="text-lg text-zinc-700 font-semibold">{item.name}</h3>
        <img src={item.image ?? undefined} alt={item.name} className="w-full h-60 object-contain mt-4 mb-4" />
        <p className="text-sm text-gray-500">{item.location}</p>
      </Link>
      <div className="absolute bottom-3 right-3 flex gap-2">
        <button
          onClick={(e) => { e.preventDefault(); setEditing(true); }}
          className="text-blue-900 hover:text-blue-700 p-1 cursor-pointer">
          ✏️
        </button>
        <button onClick={handleDelete}
          className="text-red-500 hover:text-red-700 p-1 cursor-pointer">
          🗑️
        </button>
      </div>
    </div>
  );
}