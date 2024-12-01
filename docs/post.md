# Cómo Desarrollé MemoMate: Un Asistente Personal en Telegram con IA

## Introducción

En este artículo quiero compartir mi experiencia desarrollando MemoMate, un asistente personal en Telegram que ayuda a gestionar y mejorar nuestras relaciones personales. La idea surgió de una necesidad personal: tener una forma sencilla de recordar detalles importantes sobre las personas que me importan - desde cumpleaños hasta conversaciones significativas.

## ¿Qué es MemoMate?

MemoMate es un bot de Telegram que actúa como un PRM (Personal Relationship Manager). A través de una conversación natural, puedes contarle eventos o información sobre tus contactos, y el bot se encarga de almacenar y organizar esta información. Más tarde, puedes preguntarle sobre cualquier persona o evento, y te ayudará a recordar los detalles importantes.

Por ejemplo, podrías decirle:
> "Ayer hablé con mi primo Marcos, me contó que va a empezar en una nueva empresa"

Y días después preguntarle:
> "¿Qué me contó Marcos la última vez?"

El bot recordará la conversación y te ayudará a mantener vivas tus relaciones personales.

## Arquitectura y Tecnologías

Decidí implementar MemoMate como un monorepo con dos componentes principales:

1. **Bot de Telegram**: para manejar toda la interacción con los usuarios.
2. **Aplicación Web**: para que el usuario pueda gestionar su cuenta y los contactos.

### ¿Por qué estas tecnologías?

- **Monorepo con pnpm**: La decisión de usar un monorepo vino motivada por la necesidad de compartir código entre el bot y la web. Por ejemplo, la lógica de negocio, tipos, y utilidades. PNPM fue la elección natural por su eficiencia en el manejo de dependencias y su excelente soporte para workspaces.

- **PostgreSQL + Prisma**: Necesitaba una base de datos robusta que pudiera manejar relaciones complejas entre usuarios, contactos y eventos. Prisma añade una capa de type-safety que hace el desarrollo más seguro y productivo. Además, PostgreSQL tiene soporte nativo para búsquedas vectoriales a través de pgvector, lo cual es crucial para futuras mejoras en las búsquedas semánticas.

- **OpenAI**: La API de OpenAI, especialmente con sus Assistants, ofrece capacidades avanzadas de procesamiento de lenguaje natural. La posibilidad de definir "tools" personalizadas que el asistente puede utilizar fue clave para implementar las funcionalidades principales del bot.

- **Next.js**: Para la aplicación web, Next.js fue la elección ideal por varios motivos:
  - Server Components y RSC para mejor rendimiento
  - API Routes para implementar endpoints serverless
  - Excelente soporte para TypeScript
  - Integración nativa con Vercel para despliegues

- **Pinecone**: Para implementar búsquedas semánticas eficientes sobre la información de los contactos, necesitábamos una base de datos vectorial. Pinecone destaca por su facilidad de uso, rendimiento y capacidad para manejar grandes volúmenes de datos vectoriales.

## El Proceso de Desarrollo

### Definición del Proyecto
Comencé definiendo claramente el alcance y la arquitectura. Utilicé ChatGPT para refinar las ideas y documenté todo en la carpeta `docs`. Esta fase de planificación fue crucial para tener una visión clara del camino a seguir.

### Estructura Base
Implementé el monorepo con tres paquetes principales:
- `core`: Utilidades compartidas
- `database`: Modelos y migraciones de Prisma
- `openai`: Abstracción para la interacción con OpenAI

### Sistema de Autenticación

Desarrollé un sistema de autenticación simple pero efectivo que permite a los usuarios acceder a la web directamente desde Telegram. El flujo funciona así:

1. Cuando el usuario necesita acceder a la web (por ejemplo, al usar el comando `/setup`), el bot genera una sesión temporal con un token único:

```typescript
  private async createSessionUrl(userId: string) {
    const session = await prisma.session.create({
      data: {
        userId: userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 10),
      }
    });
    const link = `${process.env.FRONTEND_URL}/login?token=${session.id}`;
    return link;
  }
```


2. El bot envía al usuario un mensaje con el link generado. Este link disparará el Api Route `login` en la web, el cual:
   - Verifica que el token sea válido y no haya expirado
   - Si es válido, crea una cookie de sesión y redirige a `/dashboard`
   - Si no es válido, redirige a una página de error

```typescript
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
```

De esta forma, conseguimos un mecanismo sencillo pero seguro y efectivo para que el usuario pueda acceder a su cuenta en la web desde Telegram.


### Integración con OpenAI

Para manejar la interacción con OpenAI de forma limpia y reutilizable, creé un paquete dedicado `@memomate/openai` que abstrae toda la complejidad de la API. Este paquete implementa cuatro clases principales:

#### Agent
La clase `Agent` representa un asistente de OpenAI y maneja su ciclo de vida:

```typescript
interface Props {
  id: string;
  name: string;
  description: string;
  instructions: string;
  model?: string;
  tools: Array<Tool>;
}

export class Agent {
  // ...
  async init() {
    let openAiAssistant = await openaiClient.beta.assistants.retrieve(this.id);
    const shouldUpdate = this.shouldUpdate(openAiAssistant);
    if (shouldUpdate) {
      openAiAssistant = await openaiClient.beta.assistants.update(
        this.id,
        this.generateBody()
      );
    }
    this.assistant = openAiAssistant;
  }
}
```

#### Thread
Gestiona una conversación con el asistente, incluyendo el procesamiento de mensajes y la ejecución de herramientas:

```typescript
export class Thread<T extends Record<string, any>> {
  async send(message: string): Promise<string> {
    // Enviar mensaje al thread
    await openaiClient.beta.threads.messages.create(this.id, {
      role: "user",
      content: message,
    });

    // Crear y procesar el run
    this.run = await openaiClient.beta.threads.runs.create(this.id, {
      assistant_id: this.agent.id,
    });

    // Procesar la respuesta o acciones requeridas
    while (true) {
      await this.waitUntilDone();
      if (this.run.status === "completed") {
        return await this.extractMessage();
      } else if (this.run.status === "requires_action") {
        await this.processAction();
      }
      // ...
    }
  }
}
```

#### Tool
Una clase abstracta que define la estructura para las herramientas que puede usar el asistente:

```typescript
export abstract class Tool {
  name: string;
  description: string;
  parameters: any;

  constructor({ name, description, parameters }: ToolParams) {
    this.name = name;
    this.description = description;
    this.parameters = parameters;
  }

  abstract run(parameters: RunProps): Promise<string>;
}
```

#### Embeddings
Maneja la generación de embeddings para búsquedas semánticas:

```typescript
export class Embeddings {
  private model = 'text-embedding-3-small';
  private dimensions = 1024;

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await openaiClient.embeddings.create({
      model: this.model,
      dimensions: this.dimensions,
      input: text,
      encoding_format: 'float'
    });

    return response.data[0].embedding;
  }
}
```

De esta forma, el paquete `@memomate/openai` nos proporciona una capa de abstracción sobre la API de OpenAI, facilitando su uso y permitiendo una mayor flexibilidad en futuras implementaciones.

### Implementación del Asistente
El siguiente paso fue implementar el Asistente en sí, ya dentro del bot que es donde será ejecutado. Para ellos, hemos creado la clase `MemoMateAssistant` que se encarga de inicializar el asistente y exponer sus herramientas para que sean usadas en los Threads. También hemos creado cada una de las herramientas que el asistente puede usar, todas ellas heredando de la clase `Tool`. Y por último, definir las instrucciones del asistente y su descripción, para que pueda llevar a cabo todas sus funciones correctamente. Con esto ya tenemos todo lo necesario para que el bot de Telegram pueda interactuar con el asistente de OpenAI. Solo nos queda conectar ambas partes.

### Conectar el Bot con el Asistente

Para conectar el bot de Telegram con el asistente de OpenAI, implementé una estructura clara y modular:

1. **Inicialización del Bot**
En primer lugar, utilizamos la librería `telegraf` para inicializar el bot de Telegram utilizando su token. Si quieres entender mejor como crear un bot en Telegram, puedes ver [este tweet](https://x.com/enolcasielles/status/1852607518947611133) donde lo explico. Inicialiamos el Asistente que hemos creado y asociamos los eventos del bot con las funciones del procesador de mensajes.


```typescript
const run = async () => {
  // Inicializar bot y servicios necesarios
  const bot = new Telegraf(process.env.BOT_TOKEN);
  const assistant = MemoMateAssistant.getInstance();
  const pinecone = PineconeService.getInstance();
  
  // Asegurar que los servicios están listos
  await Promise.all([
    assistant.init(),
    pinecone.init()
  ]);
  
  const processor = new MemoMateProcessor(assistant);
  
  // Configurar handlers para los diferentes comandos
  bot.start((ctx) => processor.handleStart(ctx));
  bot.help((ctx) => processor.handleHelp(ctx));
  bot.command('setup', (ctx) => processor.handleSetup(ctx));
  bot.on(message('text'), (ctx) => processor.handleMessage(ctx));
  
  bot.launch();
}
```

2. **Procesamiento de Mensajes**
La clase `MemoMateProcessor` es la que se encarga de manejar toda la lógica de procesamiento de mensajes. Esta clase:
- Gestiona los diferentes comandos del bot (`/start`, `/help`, `/setup`)
- Procesa los mensajes de texto normales
- Realiza un control del usuario para ver si puede usar el bot o no.
- Mantiene un registro de los mensajes
- Envía el mensaje al asistente de OpenAI y devuelve la respuesta al usuario

```typescript
public async handleMessage(ctx: TextMessageContext) {
  try {
    const telegramUserId = ctx.message.from.id;
    const chatId = ctx.message.chat.id;
    const message = ctx.message.text;

    // Obtener o crear usuario
    const user = await this._getOrCreateUser(telegramUserId, chatId);

    // Verificar si el usuario puede enviar mensajes
    const canSend = user.stripeSubscriptionId || user.credits > 0;
    if (!canSend) {
      const link = await this.createSessionUrl(user.id);
      ctx.reply(limitMessageTemplate(link), {
        parse_mode: 'HTML'
      });
      return;
    }

    // Registrar el mensaje entrante
    await prisma.messageLog.create({
      data: {
        userId: user.id,
        message: message,
        direction: MessageLogDirection.INCOMING,
      }
    });

    // Enviar mensaje al asistente y obtener respuesta
    const response = await this.assistant.sendMessage(
      user.id, 
      user.openaiThreadId, 
      message
    );
    
    // Registrar la respuesta
    await prisma.messageLog.create({
      data: {
        userId: user.id,
        message: response,
        direction: MessageLogDirection.OUTGOING,
      }
    });
    
    // Decrementar créditos si es usuario gratuito
    if (!user.stripeSubscriptionId) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          credits: { decrement: 1 }
        }
      });
    }
    
    // Enviar respuesta al usuario
    ctx.reply(response);
  } catch (error) {
    console.error(error);
  }
}
```

3. **Templates de Mensajes**
Para mantener una comunicación clara y consistente con los usuarios, definí templates para diferentes tipos de mensajes:

- Mensaje de bienvenida cuando un usuario inicia el bot
- Mensaje de ayuda con los comandos disponibles
- Mensaje cuando se alcanza el límite de créditos gratuitos

Por ejemplo, el template de bienvenida:

```typescript
export const welcomeTemplate = (link: string) => {
  return `
Bienvenido a MemoMate! 🤖✨

¡Hola! Soy tu asistente personal, estoy aquí para ayudarte a recordar y 
gestionar momentos importantes con las personas que te importan en tu vida.

Para empezar, te recomiendo que visites <a href="${link}">nuestra web</a> 
para completar tu configuración inicial...
  `;
}
```

### Cron Jobs
En esta aplicación `bot`, también hemos desarrollado un sistema de crons para manejar 2 factores importantes en la plataforma:

- **Recordatorios**: 
- **Recordatorios**: Para enviar mensajes a los usuarios en momentos específicos. Una de las tablas de nuestra base de datos es `reminder`, que se encarga de registrar recordatorios que se debe enviar a un usuario en un momento dado. El asistente está preparado para permitir al usuario la definición de estos recordatorios
- **Renovación de créditos**: Para mantener la plataforma activa y disponible para los usuarios.

### Búsqueda Semántica
Integré Pinecone para permitir búsquedas contextuales sobre la información de los contactos, mejorando significativamente la capacidad del bot para recuperar información relevante.

### Suscripciones
Implementé un sistema de suscripciones con Stripe, ofreciendo una versión premium con características adicionales.

## Lecciones Aprendidas

1. **La importancia de la planificación**: Dedicar tiempo a definir la arquitectura y documentar las decisiones fue fundamental.

2. **Modularidad es clave**: La estructura de monorepo y la separación en paquetes facilitó enormemente el desarrollo y mantenimiento.

3. **Testing temprano**: Implementar tests desde el principio ayudó a detectar problemas rápidamente, especialmente en la integración con OpenAI.

4. **Feedback de usuarios**: Las pruebas con usuarios reales fueron invaluables para mejorar la experiencia del bot.

## Conclusión

Desarrollar MemoMate ha sido un viaje fascinante que me ha permitido explorar tecnologías modernas y crear algo útil. El proyecto sigue en evolución, y planeo seguir mejorándolo basándome en el feedback de los usuarios.

Si estás interesado en probar MemoMate, puedes encontrar el bot en Telegram como [@MemoMateBot](https://t.me/MemoMateBot).

¿Preguntas o sugerencias? No dudes en contactarme o visitar el [repositorio del proyecto](https://github.com/tuusuario/memomate). 