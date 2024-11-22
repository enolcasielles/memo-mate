"use client";

import { Contact } from "../types/contact.type";
import { Button } from "@/core/components/base/button";
import { useContacts } from "../contexts/ContactsContext";
import { useState } from "react";
import ContactForm from "./ContactForm";
import { MapPin, UserCircle, Users2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Calendar } from "lucide-react";

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
    <div className="group relative bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-500 hover:shadow-md transition-all duration-200">
      {/* Avatar o Inicial */}
      <div className="absolute right-4 top-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-semibold">
          {contact.name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Información del contacto */}
      <div className="space-y-3 pr-14">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {contact.name}
          </h3>
          {contact.relation && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
              <Users2 className="w-4 h-4" />
              {contact.relation}
            </div>
          )}
        </div>

        {contact.location && (
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            {contact.location}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-2 pt-2">
          <Link href={`/dashboard/contacts/${contact.id}/events`}>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 hover:bg-blue-50 hover:text-blue-600"
            >
              <Calendar className="w-4 h-4" />
              Eventos
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 hover:bg-blue-50 hover:text-blue-600"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteContact(contact.id)}
            className="flex items-center gap-1.5 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}
