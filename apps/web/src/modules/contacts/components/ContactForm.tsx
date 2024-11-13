"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/core/components/base/button";
import { Input } from "@/core/components/base/input";
import { Contact, CreateContactDTO } from "../types/contact.type";
import { useContacts } from "../contexts/ContactsContext";
import { UserPlus, Loader2 } from "lucide-react";

interface Props {
  contact?: Contact;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ContactForm({ contact, onSuccess, onCancel }: Props) {
  const { createContact, updateContact } = useContacts();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateContactDTO>({
    defaultValues: {
      name: contact?.name,
      relationship: contact?.relation,
      location: contact?.location,
    },
  });

  const onSubmit = async (data: CreateContactDTO) => {
    if (contact) {
      await updateContact({ ...data, id: contact.id });
    } else {
      await createContact(data);
    }
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input {...register("name", { required: true })} placeholder="Nombre" />
      <Input {...register("relationship")} placeholder="Relación" />
      <Input {...register("location")} placeholder="Ubicación" />
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-6 text-lg rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Creando contacto...
          </div>
        ) : (
          <div className="flex items-center gap-2 justify-center">
            <UserPlus className="w-5 h-5" />
            Crear Contacto
          </div>
        )}
      </Button>
      {onCancel && (
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      )}
    </form>
  );
}
