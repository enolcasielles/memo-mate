import { cookies } from "next/headers";
import { CustomError } from "@memomate/core";

export async function getUserId(): Promise<string> {
  const userId = cookies().get("userId")?.value;

  if (!userId) {
    throw new CustomError({
      message: "Usuario no autenticado",
      statusCode: 401,
    });
  }

  return userId;
}
