"use server";

import { buildCustomError, CustomError } from "@/core/errors/custom-error";
import { ActionResponse } from "@/core/responses/action.response";
import { Contact, UpdateContactDTO } from "../types/contact.type";
import { prisma } from "@/core/lib/prisma";
import { mapContactEntityToContact } from "../mappers/contact.mapper";

export async function updateContactAction(
  userId: string,
  data: UpdateContactDTO,
): Promise<ActionResponse<Contact>> {
  try {
    const prismaContact = await prisma.contact.update({
      where: { id: data.id, userId },
      data: {
        relation: data.relationship,
        location: data.location,
        name: data.name,
      },
    });
    const contact = mapContactEntityToContact(prismaContact);
    return [null, contact];
  } catch (error) {
    if (error instanceof CustomError) return [buildCustomError(error), null];
    return [{ message: "Error al actualizar el contacto" }, null];
  }
}
