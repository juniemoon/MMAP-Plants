"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

//export default function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
export default function SearchBar() {
  const [term, setTerm] = useState("");

  return (
    <div className="flex bg-card rounded-full h-12 justify-center items-center px-4 shadow-sm border">
      <Input className="border-none shadow-none focus-visible:ring-0 text-zinc-500 h-8 w-full"
        value={term}
        onChange={e => {
          setTerm(e.target.value);
          //onSearch(e.target.value);        NOCH KEINE SEARCH-IMPLEMENTIERUNG WEIL ERFORDERT WRAPPER UMBAU O.Ä.
        }}
        placeholder="Suchen..."
      />
    </div>
  );
}