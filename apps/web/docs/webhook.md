# Implementación del Webhook para Telegram en Next.js con App Router

## Descripción General

Este documento describe cómo configurar e implementar un webhook en Next.js utilizando el App Router para recibir y procesar mensajes de Telegram. Cada vez que el bot de Telegram reciba un mensaje, el webhook en Next.js se activará, procesará la información mediante un asistente de OpenAI, consultará la base de datos en PostgreSQL y apoyándose en Pinecone para la búsqueda semántica de contactos y responderá al usuario en tiempo real.

## Flujo de Funcionamiento

### Recepción de Mensajes en el Webhook
* Telegram enviará una solicitud POST al webhook cada vez que el bot reciba un mensaje.

### Identificación del Usuario
* El webhook utiliza el `telegram_user_id` del mensaje para buscar al usuario en la base de datos.
* Si el usuario no existe, se crea un nuevo registro en la tabla User.

### Procesamiento del Mensaje
* El contenido del mensaje se envía al asistente de OpenAI asociado al usuario, quien interpretará la intención y determinará la acción a realizar: almacenar un evento, consultar información de un contacto, o configurar un recordatorio.

### Respuesta a Telegram
* El webhook responde al usuario en función del mensaje interpretado por el asistente de OpenAI.

## Configuración del Webhook en Telegram

Para configurar el webhook, utilizamos el método setWebhook de la API de Telegram para indicar la URL de nuestro handler en Next.js.

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -d "url=https://your-vercel-app.vercel.app/api/telegram-webhook"
```

Reemplaza `<YOUR_BOT_TOKEN>` con el token de tu bot y `https://your-vercel-app.vercel.app/api/telegram-webhook` con la URL de tu endpoint en Next.js.

## Implementación del Webhook con App Router de Next.js

### Estructura del Archivo /app/api/telegram-webhook/route.js

El archivo `route.js` define el handler que actuará como webhook para procesar cada mensaje enviado por Telegram.

```javascript
// Importar dependencias
import { NextResponse } from 'next/server';
import prisma from '@/utils/prismaClient';  // Configura la conexión a la base de datos

export async function POST(req) {
    try {
        // Parsear la solicitud de Telegram
        const { message } = await req.json();

        if (!message || !message.from) {
            return NextResponse.json({ message: 'Solicitud inválida' }, { status: 400 });
        }

        // Obtener el user_id de Telegram y el contenido del mensaje
        const telegramUserId = message.from.id;
        const text = message.text || '';

        // Verificar o crear el usuario
        const user = await prisma.user.findUnique({
            where: {
                telegram_user_id: telegramUserId
            }
        });

        if (!user) { // No se encontró el usuario
            const newUser = await prisma.user.create({
                data: {
                    telegram_user_id: telegramUserId
                }
            });

            if (!newUser) {
                return NextResponse.json({ message: 'Error al crear usuario' }, { status: 500 });
            }
            user = newUser;
        }

        // Procesar el mensaje con el asistente de OpenAI
        const responseMessage = await processUserMessageWithOpenAI(text, user);

        // Enviar respuesta a Telegram
        await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: message.chat.id,
                text: responseMessage,
            }),
        });

        return NextResponse.json({ message: 'Mensaje procesado correctamente' });
    } catch (error) {
        return NextResponse.json({ message: 'Error en el procesamiento del mensaje' }, { status: 500 });
    }
}
```

### Función processUserMessageWithOpenAI

El procesamiento del mensaje se realiza a través del asistente de OpenAI. La función `processUserMessageWithOpenAI` envía el contenido del mensaje al asistente, quien interpreta la intención y devuelve una respuesta adecuada.

```javascript
async function processUserMessageWithOpenAI(text, user) {
    // Implementación del procesamiento del mensaje con OpenAI
    // Lógica de comunicación con OpenAI y generación de respuesta
    return 'Mensaje interpretado y procesado por OpenAI';
}
```

## Explicación de Componentes y Pasos

### Identificación del Usuario
* Extraemos el `telegram_user_id` del mensaje y buscamos al usuario en la base de datos.
* Si no se encuentra el usuario, se crea un nuevo registro y se inicia el proceso de configuración inicial.

### Procesamiento del Mensaje
* El mensaje se envía al asistente de OpenAI, quien interpreta su intención y determina la respuesta o acción apropiada.
* Si el usuario aún no ha completado la configuración inicial, el bot puede sugerirle visitar la web.

### Respuesta a Telegram
* Se utiliza la API de Telegram para enviar una respuesta de vuelta al usuario en función del mensaje interpretado por OpenAI.

## Ejemplo de Escenarios

### Escenario 1: Primer mensaje de un usuario nuevo
* El webhook crea un nuevo registro en User y sugiere al usuario completar la configuración inicial en la web.

### Escenario 2: Solicitud de creación de un evento o recordatorio
* El mensaje se envía al asistente de OpenAI, quien identifica las palabras clave y sigue un flujo conversacional para capturar los detalles necesarios.

## Resumen

Utilizando el App Router de Next.js, este webhook permite gestionar la interacción del bot de Telegram con los usuarios, apoyándose en el asistente de OpenAI para interpretar y procesar el contenido de los mensajes. La integración con PostgreSQL y Pinecone permite almacenar los datos de usuarios y contactos de forma estructurada y segura.