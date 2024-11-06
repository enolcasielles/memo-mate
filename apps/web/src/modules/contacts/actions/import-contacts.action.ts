"use server";

import { buildCustomError, CustomError } from "@memomate/core";
import { ActionResponse } from "@memomate/core";
import prisma from "@memomate/database";
import csv from "csvtojson";

interface ImportResult {
  success: number;
  errors: number;
}

export async function importContactsAction(
  userId: string,
  fileContent: string,
): Promise<ActionResponse<ImportResult>> {
  try {
    // Verificar las columnas del CSV
    const firstLine = fileContent.split("\n")[0];
    const requiredColumns = ["Nombre", "Relación", "Localización"];
    const columns = firstLine.split(",").map((col) => col.trim());

    const hasRequiredColumns = requiredColumns.every((col) =>
      columns.some((c) => c.toLowerCase() === col.toLowerCase()),
    );

    if (!hasRequiredColumns) {
      return [
        {
          message:
            "El CSV debe contener las columnas: Nombre, Relación y Localización",
        },
        null,
      ];
    }

    // Convertir CSV a JSON
    const jsonArray = await csv({
      headers: ["Nombre", "Relación", "Localización"],
      noheader: false,
    }).fromString(fileContent);

    let successCount = 0;
    let errorCount = 0;

    // Procesar cada registro
    for (const record of jsonArray) {
      try {
        if (!record.Nombre) {
          errorCount++;
          continue;
        }

        await prisma.contact.create({
          data: {
            name: record.Nombre,
            relation: record.Relación || null,
            location: record.Localización || null,
            userId,
          },
        });
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }

    return [null, { success: successCount, errors: errorCount }];
  } catch (error) {
    if (error instanceof CustomError) return [buildCustomError(error), null];
    return [{ message: "Error al importar los contactos" }, null];
  }
}
