"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/core/components/base/button";
import { Input } from "@/core/components/base/input";
import { CreateEventDTO } from "../types/event.type";
import { createEventAction } from "../actions/create-event.action";
import { useUserContext } from "@/core/contexts/UserContext";
import { useError } from "@/core/components/hooks/use-error";
import { Calendar, Loader2 } from "lucide-react";

interface Props {
  contactId: string;
  onSuccess?: () => void;
}

export default function CreateEventForm({ contactId, onSuccess }: Props) {
  const { userId } = useUserContext();
  const { showError } = useError();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateEventDTO>({
    defaultValues: {
      eventDate: new Date(),
    }
  });

  const onSubmit = async (data: CreateEventDTO) => {
    const [error] = await createEventAction(userId, contactId, data);
    if (error) {
      showError(error);
    } else {
      reset();
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        {...register("description", { required: true })}
        placeholder="Descripción del evento"
      />
      <Input
        type="datetime-local"
        {...register("eventDate")}
        className="flex items-center gap-2"
      />
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-6 text-lg rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2 justify-center">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Guardando evento...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 justify-center">
            <Calendar className="w-5 h-5" />
            <span>Guardar Evento</span>
          </div>
        )}
      </Button>
    </form>
  );
} 