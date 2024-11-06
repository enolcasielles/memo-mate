"use server";

import { buildCustomError, CustomError } from "@memomate/core";
import { ActionResponse } from "@memomate/core";
import { Contact, ContactFilters } from "../types/contact.type";
import prisma from "@memomate/database";
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
    console.error(error);
    if (error instanceof CustomError) return [buildCustomError(error), null];
    return [{ message: "Error al obtener los contactos" }, null];
  }
}