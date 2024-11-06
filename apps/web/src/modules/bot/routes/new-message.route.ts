import { apiError } from "@memomate/core";
import { CustomError } from "@memomate/core";
import prisma from "@memomate/database";
import { NextResponse } from "next/server";

export async function BotNewMessage(req: Request) {
  try {
    // Parsear la solicitud de Telegram
    const { message } = await req.json();

    if (!message || !message.from) {
      return NextResponse.json(
        { message: "Solicitud inválida" },
        { status: 400 },
      );
    }

    //Inicializar el agente de OpenAI

    // Obtener el user_id de Telegram y el contenido del mensaje
    const telegramUserId = message.from.id;
    const text = message.text || "";

    // Verificar o crear el usuario
    let user = await prisma.user.findUnique({
      where: {
        telegramUserId: telegramUserId,
      },
    });

    if (!user) {
      // No se encontró el usuario
      const newUser = await prisma.user.create({
        data: {
          telegramUserId: telegramUserId,
          openaiThreadId: process.env.OPENAI_ASSISTANT_ID,
        },
      });

      if (!newUser) {
        return NextResponse.json(
          { message: "Error al crear usuario" },
          { status: 500 },
        );
      }
      user = newUser;
    }

    // Procesar el mensaje con el asistente de OpenAI
    //const responseMessage = await processUserMessageWithOpenAI(text, user);
    const responseMessage = "Hola, ¿cómo puedo ayudarte hoy?";

    // Enviar respuesta a Telegram
    await fetch(
      `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: responseMessage,
        }),
      },
    );

    return NextResponse.json({ message: "Mensaje procesado correctamente" });
  } catch (error) {
    console.error(error);
    if (error instanceof CustomError) return apiError(error);
    return apiError(
      new CustomError({
        message: "Error interno del servidor",
        statusCode: 500,
      }),
    );
  }
}
