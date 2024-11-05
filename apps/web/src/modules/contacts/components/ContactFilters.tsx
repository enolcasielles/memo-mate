"use client";

import { Input } from "@/core/components/base/input";
import { useContacts } from "../contexts/ContactsContext";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";

export default function ContactFilters() {
  const { setFilters } = useContacts();
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 300);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  return (
    <div className="flex gap-4">
      <Input
        placeholder="Buscar contactos..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}
