"use client";

import { useContacts } from "../contexts/ContactsContext";
import ContactCard from "./ContactCard";
import { Skeleton } from "@/core/components/base/skeleton";

export default function ContactList() {
  const { contacts, isLoading } = useContacts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="">
            <Skeleton className="h-[150px]" />
          </div>
        ))}
      </div>
    );
  }

  if (!contacts.length) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No tienes contactos guardados</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
}
