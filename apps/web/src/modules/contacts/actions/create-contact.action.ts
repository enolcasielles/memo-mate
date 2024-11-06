"use server";

import { buildCustomError, CustomError } from "@memomate/core";
import { ActionResponse } from "@memomate/core";
import { Contact, CreateContactDTO } from "../types/contact.type";
import prisma from "@memomate/database";
import { mapContactEntityToContact } from "../mappers/contact.mapper";

export async function createContactAction(
  userId: string,
  data: CreateContactDTO,
): Promise<ActionResponse<Contact>> {
  try {
    const contact = await prisma.contact.create({
      data: {
        relation: data.relationship,
        location: data.location,
        name: data.name,
        userId,
      },
    });
    return [null, mapContactEntityToContact(contact)];
  } catch (error) {
    if (error instanceof CustomError) return [buildCustomError(error), null];
    return [{ message: "Error al crear el contacto" }, null];
  }
}
