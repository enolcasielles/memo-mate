"use client";

import { Contact } from "../types/contact.type";
import { Button } from "@/core/components/base/button";
import { useContacts } from "../contexts/ContactsContext";
import { useState } from "react";
import ContactForm from "./ContactForm";

interface Props {
  contact: Contact;
}

export default function ContactCard({ contact }: Props) {
  const { deleteContact } = useContacts();
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <ContactForm
        contact={contact}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="border rounded-lg p-4 flex flex-col gap-2">
      <h3 className="font-semibold text-lg">{contact.name}</h3>
      {contact.relation && (
        <p className="text-sm text-gray-600">{contact.relation}</p>
      )}
      {contact.location && (
        <p className="text-sm text-gray-600">{contact.location}</p>
      )}
      <div className="flex gap-2 mt-2">
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          Editar
        </Button>
        <Button variant="destructive" onClick={() => deleteContact(contact.id)}>
          Eliminar
        </Button>
      </div>
    </div>
  );
}
