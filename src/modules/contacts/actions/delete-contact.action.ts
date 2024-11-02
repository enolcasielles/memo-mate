"use server";

import { buildCustomError, CustomError } from "@/core/errors/custom-error";
import { prisma } from "@/core/lib/prisma";
import { ActionResponse } from "@/core/responses/action.response";

export async function deleteContactAction(
  userId: string,
  contactId: string,
): Promise<ActionResponse<void>> {
  try {
    await prisma.contact.delete({
      where: { id: contactId, userId },
    });
    return [null, undefined];
  } catch (error) {
    if (error instanceof CustomError) return [buildCustomError(error), null];
    return [{ message: "Error al eliminar el contacto" }, null];
  }
}
