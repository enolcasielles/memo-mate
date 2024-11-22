"use server";

import { buildCustomError, CustomError } from "@memomate/core";
import { ActionResponse } from "@memomate/core";
import prisma from "@memomate/database";
import { Event, CreateEventDTO } from "../types/event.type";
import { revalidatePath } from "next/cache";

export async function createEventAction(
  userId: string,
  contactId: string,
  data: CreateEventDTO,
): Promise<ActionResponse<Event>> {
  try {
    // Verificar que el contacto pertenece al usuario
    const contact = await prisma.contact.findFirst({
      where: { id: contactId, userId },
    });

    if (!contact) {
      return [{ message: "Contacto no encontrado" }, null];
    }

    const event = await prisma.event.create({
      data: {
        contactId,
        description: data.description,
        eventDate: new Date(data.eventDate),
      },
    });

    revalidatePath(`/dashboard/contacts/${contactId}/events`);

    return [null, event];
  } catch (error) {
    if (error instanceof CustomError) return [buildCustomError(error), null];
    return [{ message: "Error al crear el evento" }, null];
  }
} 