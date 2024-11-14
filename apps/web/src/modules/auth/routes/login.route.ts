import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { CustomError } from "@memomate/core";
import { apiError } from "@memomate/core";
import prisma from "@memomate/database";
import { redirect } from "next/navigation";

export async function LoginRoute(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  let errorType = null;
  try {
    if (!token) {
      throw new CustomError({
        message: "Token no proporcionado",
        type: "INVALID_TOKEN",
        statusCode: 400,
      });
    }
    const session = await prisma.session.findFirst({
      where: {
        id: token,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      throw new CustomError({
        message: "Sesión inválida o expirada",
        statusCode: 401,
        type: "INVALID_TOKEN",
      });
    }

    // Crear cookie con el ID del usuario
    cookies().set("userId", session.userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 días
    });

    // Retornamos una redirección
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) errorType = error.type;
    else errorType = "INTERNAL_SERVER_ERROR";
  }
  redirect(`/error?type=${errorType}`);
}
