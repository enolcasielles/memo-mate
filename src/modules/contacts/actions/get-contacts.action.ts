"use server";

import { buildCustomError, CustomError } from "@/core/errors/custom-error";
import { ActionResponse } from "@/core/responses/action.response";
import { Contact, ContactFilters } from "../types/contact.type";
import { prisma } from "@/core/lib/prisma";
import { Prisma } from "@prisma/client";

export async function getContactsAction(
  userId: string,
  filters?: ContactFilters,
): Promise<ActionResponse<Contact[]>> {
  try {
    const where = {
      userId,
      ...(filters?.search && {
        OR: [
          {
            name: {
              contains: filters.search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
          {
            location: {
              contains: filters.search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
        ],
      }),
      ...(filters?.location && {
        location: {
          contains: filters.location,
          mode: "insensitive" as Prisma.QueryMode,
        },
      }),
      ...(filters?.relationship && {
        relationship: {
          contains: filters.relationship,
          mode: "insensitive" as Prisma.QueryMode,
        },
      }),
    };

    const contacts = await prisma.contact.findMany({ where });
    return [null, contacts];
  } catch (error) {
    if (error instanceof CustomError) return [buildCustomError(error), null];
    return [{ message: "Error al obtener los contactos" }, null];
  }
}
