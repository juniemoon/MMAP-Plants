import SearchBar from "../src/components/SearchBar";
import Link from "next/link";
import { getAllPlants } from "../actions";
import AddPlantForm from "../src/components/AddPlantForm";
import PlantCard from "../src/components/PlantCard";

export default async function ItemsPage() {
  const items = await getAllPlants();
  return (
    <div className="flex flex-col gap-6">
      <SearchBar />
      <AddPlantForm />
      <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black">Alle Einträge:</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <PlantCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}