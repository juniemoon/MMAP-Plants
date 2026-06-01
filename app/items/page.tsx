import { prisma } from "@/lib/prisma";
import SearchBar from "../src/components/SearchBar";
import Link from "next/link";
import type { Plant } from "@/generated/prisma/client";

async function getItems(): Promise<Plant[]> {
  return prisma.plant.findMany();
}

export default async function ItemsPage() {
  const items = await getItems();
  return (
    <div className="flex flex-col gap-6">
      <SearchBar />
      <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black">Alle Einträge:</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <Link 
            key={item.id} 
            href={`/items/${item.id}`}
            className="bg-foreground h-auto p-4 shadow-md hover:shadow-lg transition-shadow rounded-lg cursor-pointer block"
            >            
            <h3 className="text-lg text-zinc-700 font-semibold">{item.name}</h3>
            <img src={item.image} alt={item.name} className="w-full h-60 object-contain mt-4 mb-4" />
            <p className="text-sm text-gray-500">{item.location}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}