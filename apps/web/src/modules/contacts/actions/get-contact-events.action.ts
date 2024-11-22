"use server";

import { buildCustomError, CustomError } from "@memomate/core";
import { ActionResponse } from "@memomate/core";
import prisma from "@memomate/database";
import { Event } from "../types/event.type";

export async function getContactEventsAction(
  userId: string,
  contactId: string,
): Promise<ActionResponse<Event[]>> {
  try {
    const events = await prisma.event.findMany({
      where: {
        contactId,
        contact: {
          userId,
        },
      },
      orderBy: {
        eventDate: 'desc',
      },
    });
    
    return [null, events];
  } catch (error) {
    if (error instanceof CustomError) return [buildCustomError(error), null];
    return [{ message: "Error al obtener los eventos del contacto" }, null];
  }
} 