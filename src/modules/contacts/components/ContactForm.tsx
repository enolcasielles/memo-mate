"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/core/components/base/button";
import { Input } from "@/core/components/base/input";
import { Contact, CreateContactDTO } from "../types/contact.type";
import { useContacts } from "../contexts/ContactsContext";

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input {...register("name", { required: true })} placeholder="Nombre" />
      <Input {...register("relationship")} placeholder="Relación" />
      <Input {...register("location")} placeholder="Ubicación" />
      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {contact ? "Guardar" : "Crear"}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
