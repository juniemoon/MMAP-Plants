"use client";
import Link from "next/link";
import { deletePlant, updatePlant } from "@/app/actions";
import type { Plant } from "@/generated/prisma/client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";

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
    const status = data.get("status") as string;
    await updatePlant(
      item.id,
      data.get("name") as string,
      data.get("location") as string,
      status,
      data.get("watering") as string,
      data.get("sunlight") as string,
      Number(data.get("humidity")),
      item.image ?? undefined,
    );
    setEditing(false);
  }

  if (editing) return (
    <Card className="p-4 shadow-sm border">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 text-zinc-700">
        <Input required name="name" defaultValue={item.name} placeholder="Name" />
        <Input required name="location" defaultValue={item.location ?? ""} placeholder="Standort" />
        <Input required name="watering" defaultValue={item.watering ?? ""} placeholder="Gießen" />
        <Input required name="sunlight" defaultValue={item.sunlight ?? ""} placeholder="Licht" />
        <Input required name="humidity" type="number" defaultValue={item.humidity ?? 50} placeholder="Luftfeuchtigkeit (%)" />
        <input type="hidden" name="status" defaultValue={item.status} />
        <Select name="status" defaultValue={item.status}>
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
        <div className="flex gap-2 mt-1">
          <Button type="submit" variant="default" className="bg-lime-300 hover:bg-lime-400 text-zinc-700 hover:text-black">Speichern</Button>
          <Button type="button" variant="ghost" className="text-zinc-700 hover:text-black" onClick={() => setEditing(false)}>Abbrechen</Button>
        </div>
      </form>
    </Card>
  );

  return (
    <Card className="relative overflow-hidden shadow-sm border">
      <Link href={`/items/${item.id}`} className="block group">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-zinc-700">{item.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <img src={item.image ?? undefined} alt={item.name} className="w-full h-48 object-contain transition-transform group-hover:scale-105" />
          <p className="text-sm text-muted-foreground mt-2">{item.location}</p>
        </CardContent>
      </Link>
      <CardFooter className="flex justify-end gap-2 items-center">
        <Button size="icon" variant="ghost" className="cursor-pointer" onClick={(e) => { e.preventDefault(); setEditing(true); }}>
          <Pencil className="h-4 w-4 text-blue-600" />
        </Button>
        <Button size="icon" variant="ghost" className="cursor-pointer" onClick={handleDelete}>
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </CardFooter>
    </Card>
  );
}