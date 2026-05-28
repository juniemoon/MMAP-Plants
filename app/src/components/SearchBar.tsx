"use client";

import { useState } from "react";

//export default function SearchBar({ onSearch }: { onSearch: (term: string) => void }) {
export default function SearchBar() {
  const [term, setTerm] = useState("");

  return (
    <div className="flex bg-foreground rounded-full h-12 justify-center items-center px-4">
      <input className="text-zinc-500 h-8 px-4 py-2 w-full focus:outline-none"
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