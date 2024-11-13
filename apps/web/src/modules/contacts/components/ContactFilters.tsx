"use client";

import { Input } from "@/core/components/base/input";
import { useContacts } from "../contexts/ContactsContext";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function ContactFilters() {
  const { setFilters } = useContacts();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  return (
    <div className="flex-1 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <Input 
        placeholder="Buscar contactos..." 
        className="pl-10 w-full bg-gray-50"
        value={search}
        onChange={(e) => setSearch(e.target.value)} 
      />
    </div>
  );
}
