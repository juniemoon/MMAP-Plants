"use client";
import { useState } from "react";
import { createPlant } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export default function AddPlantForm() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("unknown");
  const [illness, setIllness] = useState("");
  const [hasFile, setHasFile] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const file = data.get("image") as File; // Image File aus FormData extrahieren

    await createPlant(
      data.get("name") as string,
      data.get("location") as string,
      data.get("status") as string,
      Number(data.get("wateringMinWeeks")),
      Number(data.get("wateringMaxWeeks")),
      data.get("sunlight") as string,
      Number(data.get("humidity")),
      file, 
      status === "healthy" ? "" : illness
    );

    form.reset();
    setIllness("");
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          <Input required name="name" placeholder="Name der Pflanze" />
          <Input required name="location" placeholder="Standort (z.B. Wohnzimmer)" />

          <div className="flex items-center gap-2">
            <Label htmlFor="wateringMinWeeks" className="whitespace-nowrap pl-1.5">Gießen: Alle</Label>
            <Select name="wateringMinWeeks" defaultValue="1">
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="whitespace-nowrap">bis</span>
            <Select name="wateringMaxWeeks" defaultValue="2">
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Max" />
              </SelectTrigger>
              <SelectContent>
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="whitespace-nowrap">Wochen</span>
          </div>

          <Input required name="sunlight" placeholder="Lichtbedarf" />
          <Input required name="humidity" type="number" placeholder="Luftfeuchtigkeit (%)" />
          
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
          
          <Select name="status" value={status} onValueChange={(val) => {
            setStatus(val);
            if (val === "healthy") setIllness("");
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Status wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unknown">Unbekannt</SelectItem>
              <SelectItem value="healthy">Gesund</SelectItem>
              <SelectItem value="sick">Krank/Schädlinge</SelectItem>
              <SelectItem value="recovering">in Genesung</SelectItem>
              <SelectItem value="critical">Kritisch</SelectItem>
            </SelectContent>
          </Select>
          
          <Input 
            name="illness" 
            placeholder="Krankheit / Schädlinge" 
            value={illness}
            onChange={(e) => setIllness(e.target.value)}
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