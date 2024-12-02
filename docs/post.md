# Cómo Desarrollé MemoMate: Un Asistente Personal en Telegram con IA

## Introducción

```
```

##

En este artículo quiero compartir mi experiencia desarrollando MemoMate, un asistente personal en Telegram que ayuda a gestionar y mejorar nuestras relaciones personales. La idea surgió de una necesidad personal: tener una forma sencilla de recordar detalles importantes sobre las personas que me importan - desde cumpleaños hasta conversaciones significativas.

## ¿Qué es MemoMate?

MemoMate es un bot de Telegram que actúa como un PRM (Personal Relationship Manager). A través de una conversación natural, puedes contarle eventos o información sobre tus contactos, y el bot se encarga de almacenar y organizar esta información. Más tarde, puedes preguntarle sobre cualquier persona o evento, y te ayudará a recordar los detalles importantes.

Por ejemplo, podrías decirle:

> "Ayer hablé con mi primo Marcos, me contó que va a empezar en una nueva empresa"

Y días después preguntarle:

> "¿Qué me contó Marcos la última vez?"

El bot recordará la conversación y te ayudará a mantener vivas tus relaciones personales. También tendrá la capacidad de ir agregando nuevos contactos a tu cuenta del usuario, segun detecte que le estás hablando de un contacto que no tiene guardado. Además, también te permitirá registrar recordatorios sobre sus contactos. Por detrás contará con un sistema de envío de recordatorios que hará que recibas un mensaje con la información del recordatorio en la fecha asignada.

Además del bot en Telegram, MemoMate también cuenta con una plataforma web que otorga al usuario ciertas funcionalidades:

* **Gestión de la suscripción**: MemoMate se podrá utilizar de forma gratuita con limitaciones. Para poder eliminar estas limitaciones, el usuario deberá hacerse Premium. La web contará con una sección para manejar esta suscripción, que a su vez, se apoyará en Stripe.
* **Gestión de Contactos**: El bot tendrá la capacidad de ir agregando, eliminando o actualizando los contactos del usuario, según la conversación natural que se vaya dando. Además de esto, el usuario contará con una sección en la web en la que también pueda realizar esta gestión y con una característica extra importante, que es la importación vía csv.
* **Gestión de Eventos:** Al igual que los contactos, la conversación natural del usuario con el bot, generará en el sistema diferentes eventos asociados a un contacto. El usuario podrá ver y gestionar estos eventos también desde la aplicación web.
* **Analíticas:** La aplicación web le dará al usuario algunos datos interesantes acerca del uso de su cuenta.

## Arquitectura y Tecnologías

MemoMate se compone de 2 componentes (o aplicaciones) principales:

1. **Bot de Telegram**: para manejar toda la interacción con los usuarios.
2. **Aplicación Web**: para que el usuario pueda gestionar su cuenta y los contactos.

### Tecnologías empleadas

* **Monorepo con pnpm**: Ambas aplicacione (bot y web) tenían funcionalidad que era interesante poder compartir. Por esta razón, decidí utilizar una arquitectura de monorepo en el que vivan estas 2 aplicaciones y cuente con paquetes con las funcionalidades que se deban compartir. PNPM fue la elección natural por su eficiencia en el manejo de dependencias y su excelente soporte para workspaces.
* **PostgreSQL + Prisma**: Necesitaba una base de datos robusta que pudiera manejar relaciones complejas entre usuarios, contactos y eventos. PostgreSQL fue el candidato perfecto. Prisma añade una capa de type-safety y nos facilita mucho la labor tanto para manejar las migraciones en la base de datos como para implementar las diferentes comunicaciones con la base de datos que sean necesarias.
* **OpenAI**: La API de OpenAI, especialmente con sus Assistants, ofrece capacidades avanzadas de procesamiento de lenguaje natural. La posibilidad de definir "tools" personalizadas que el asistente puede utilizar fue clave para implementar las funcionalidades principales del bot.
* **Next.js**: Para la aplicación web, Next.js fue la elección ideal por varios motivos:
  * Server Components para mejor rendimiento
  * API Routes para implementar los endpoints serverless que necesitemos
  * Integración nativa con Vercel para despliegues
* **Tailwind CSS y Shadcn**: A la hora de definir la UI de la aplicación web, esta combinación es perfecta por la facilidad que otorga a la hora de crear los diferentes componentes de una forma robusta y eficiente.
* **Pinecone**: Para implementar búsquedas semánticas sobre la información de los contactos, necesitábamos una base de datos vectorial. Pinecone destaca por su facilidad de uso, rendimiento y capacidad para manejar grandes volúmenes de datos vectoriales.
* **Telegraf:** Para implementar el bot de telegram, optamos por utilizar la librería telegraf que destaca por su buen funcionamiento y facilidad de integración.

## El Proceso de Desarrollo

Vamos a explicar ahora como se ha abordado el proceso de desarrollo del proyecto, pasando por todos los pasos que se han ido dando para llegar desde una idea hasta un producto totalmente funcional. No vamos a entrar en detalle de absolutamente todas las piezas de código que se fueron desarrollando, ya que haríamos el artículo excesivamente extenso. Voy a ir explicando como se fueron definiendo las diferentes partes y parándome algo más en aquellas que considero más interesantes. Recomiendo abrir el [repositorio del proyecto](https://github.com/enolcasielles/memo-mate) y ver en más detalle la implemntación realizada

### Definición del Proyecto

Comencé definiendo claramente el alcance y la arquitectura. Utilicé ChatGPT para refinar las ideas y documenté todo en la carpeta `docs`. Esta fase de planificación fue crucial para tener una visión clara del camino a seguir y para poder disponer de la información necesaria para llevar a cabo un [desarrollo eficiente con Cursor](https://www.enolcasielles.com/blog/using-cursor). En esta carpeta creamos diferentes documentos: explicación del proyecto, definición de la base de datos, arquitectura, etc.&#x20;

### Estructura Base

Se utilizó una arquitectura de monorepo con los diferentes componentes. Por un lado las 2 aplicaciones que ya mencionamos (el bot y la web) y por otro lado los diferentes paquetes en los que se apoyarán estas aplicaciones. También contamos con una aplicación más que llamamos infra. Esta aplicación será básicamente un docker-compose que nos permitirá levantar la infra en local que necesitemos, en nuestro caso únicamente la base de datos PostgreSQL pero lo mantenemos como un docker-compose para que sea fácil incorporar nuevos servicios a futuro si fuera necesario.

En cuanto a los paquetes, tendremos los siguientes

* `core`: En donde implementaremos utilidades compartidas
* `database`: Que se encargará de gestionar todo lo que tenga que ver con la base de datos usando Prisma. Modelos, migraciones, etc.
* `openai`: Abstracción para la interacción con OpenAI. Definiremos en esta paquete clases y utilidades interesantes que nos facilitarán al creación y gestión del Asistente en OpenAI.

### Sistema de Autenticación

El sistema de autenticación de la plataforma es algo inusual. La idea no es contar con un mecanismo de Login y Registro al uso, si no que sea el bot quien se encargue de gestionar esto. El bot tendrá la capacidad de identificar al usuario con el que está interactuando, creando usuarios nuevos en cada nueva conversación. Cuando el usuario tenga que ir a la plataforma web, tanto porque el bot se lo requiere o porque el usuario desea hacerlo, el bot será el responsable de generar un link único y temporal de acceso.

Para conseguir esto, se desarrolló un sistema de autenticación simple pero efectivo. El flujo funciona así:

1. Cuando el usuario necesita acceder a la web, el bot genera una sesión temporal con un token único. Ese link será válido solo durante 10 minutos (expiración de la sesión).

```tsx
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

1. El bot envía este link al usuario y este podrá hacer clic en el, lo cual disparará la Api Route `/login` en la web. Esta ruta hará lo siguiente:
   * Verificar que el token sea válido y no haya expirado
   * Si es válido, crea una cookie de 30 días y redirigir a `/dashboard`
   * Si no es válido, redirigir a una página de error

```tsx
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

De esta forma, conseguimos un mecanismo sencillo pero seguro y efectivo para que el usuario pueda acceder a su cuenta en la web desde Telegram. El usuario una vez identificado, ya podrá volver a su cuenta siempre que quiera (durante 30 días) simplemente accediendo a la web. Cuando la cookie caduque, deberá volver al bot para generar un nuevo link de acceso.

### Integración con OpenAI

Para manejar la interacción con OpenAI de forma limpia y reutilizable, se creó un paquete dedicado `@memomate/openai` que abstrae toda la complejidad de la API. Este paquete implementa cuatro clases principales:

#### Agent

La clase `Agent` representa un asistente de OpenAI y maneja su ciclo de vida:

```tsx
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

```tsx
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

```tsx
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

```tsx
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

Una vez contamos con este paquete @memomate/openai ya estamos en disposición de proceder con la implementación del Asistente. En la aplicación bot, creamos una nueva carpeta assistant que se encargue de esto.&#x20;

Empezamos con las tools, o las herramientas que le daremos al asistente para que pueda realizar las diferentes acciones necesarias: Crear un Contacto, Buscar un Contacto, Crear un Evento, etc. Cada herramienta será una clase que extienda de la clase abstracta Tool en la que le explicaremos a OpenAI lo que dicha herramienta hace, que parámetros necesita y donde implementaremos su lógica correspondiente en el método run.

```tsx
export class CreateContactTool extends Tool {
  constructor() {
    super({
      name: "CreateContact",
      description:
        "Esta herramienta crea un nuevo contacto en la base de datos.",
      parameters: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description:
              "El nombre del contacto que se desea crear.",
          },
          relation: {
            type: "string",
            description:
              "La relación del contacto con el usuario. Ejemplo: 'Amigo', 'Familiar', 'Trabajo', etc.",
          },
          location: {
            type: "string",
            description:
              "La ubicación del contacto. Puede ser una ciudad, un país, etc. Ejemplos: 'Madrid', 'Asturias', 'Argentina', etc.",
          },
        },
        required: ["name"],
      },
    });
  }

  async run(parameters: CreateContactRunProps): Promise<string> {
    try {
      console.log("Creando contacto...");
      const { metadata, name, relation, location } = parameters;
      
      // Crear el contacto en la base de datos
      const contact = await prisma.contact.create({
        data: {
          name,
          relation,
          location,
          userId: metadata.userId
        }
      });

      // Generar el texto para el embedding
      const contactText = `Nombre: ${name}${relation ? `, Relación: ${relation}` : ''}${location ? `, Ubicación: ${location}` : ''}`;
      
      // Generar embedding usando OpenAI
      const embeddings = new Embeddings();
      const embeddingValue = await embeddings.generateEmbedding(contactText);
      
      // Indexar en Pinecone
      await PineconeService.getInstance().upsertContact(
        metadata.userId,
        contact.id,
        embeddingValue
      );

      return `He creado el contacto ${name} correctamente. Su ID es ${contact.id}.`;
    } catch (e) {
      console.error(e);
      return `No se ha podido crear el contacto.`;
    }
  }
}
```



A continuación, creamos 2 archivos de texto (formato markdown), para definir la descripción y las instrucciones de nuestro asistente. Aquí es donde le explicamos a nuestro asistente todo lo que necesita para llevar a cabo su propósito.&#x20;

Y ya por último, creamos la clase `MemoMateAssistant`, que será la que se encargue de crear e inicializar el agente juntando todas las anteriores piezas y de exponer un método `sendMessage` que permita enviarle un nuevo mensaje a este Agente usando el hilo del usuario en cuestión. En este mismo fichero&#x20;

```
export class MemoMateAssistant {
  private agent: Agent;
  private static instance: MemoMateAssistant;

  private constructor() {
    this.agent = new Agent({
      id: process.env.OPENAI_ASSISTANT_ID,
      name: "MemoMate Assistant",
      description: path.join(__dirname, "description.md"),
      instructions: path.join(__dirname, "instructions.md"),
      model: "gpt-4o-mini",
      tools: [
        new CreateContactTool(),
        new UpdateContactTool(),
        new DeleteContactTool(),
        new SearchContactTool(),
        new CreateEventTool(),
        new GetCurrentDateTool(),
        new CreateReminderTool(),
        new GetContactEventsTool(),
      ],
    });;
  }

  static getInstance(): MemoMateAssistant {
    if (!MemoMateAssistant.instance) {
      MemoMateAssistant.instance = new MemoMateAssistant();
    }
    return MemoMateAssistant.instance;
  }

  async init() {
    try {
      await this.agent.init();
      console.log("Asistente inicializado correctamente");
    } catch (error) {
      console.error("Error al inicializar el asistente:", error);
      throw error;
    }
  }

  async sendMessage(userId: string,threadId: string, message: string): Promise<string> {
    try {
      const thread = new Thread<ThreadMetadata>({
        id: threadId,
        agent: this.agent,
        metadata: {
          userId: userId,
        },
      });
      await thread.init();
      const response = await thread.send(message);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "Error al enviar mensaje";
    }
  }
}
```

Una cosa a destacar es la inicialización del agente. Como podemos ver le pasamos un id que tenemos en una variable de entorno. Este será el id del asistente de OpenAI, que ya habremos creado previamente desde la plataforma de OpenAI. El init de esta clase llama al init del agente, ya implementado dentro del paquete @memomate/openai. Este init del agente llevará un control para determinar si el asistente ha cambiado, comparando el estado que tiene registrado en OpenAI con respecto a lo indicado en local. Si detecta que ha cambiado realizará un update en OpenAI, asegurando de esta forma tener siempre el Asistente actualizado con respecto a la configuración que indiquemos desde el proyecto. Por ejemplo, si actualizamos las instrucciones en el fichero instructions.md, este control al inicializar el agente lo detectará y lanzará un update del asistente a la api de OpenAI. Lo mismo si creamos una nueva tool, etc.

### Conectar Bot con Asistente -> Processor

Con el asistente configurado, ya tenemos todo lo que necesitamos para que, a través de una conversación natural, podamos interactuar con el usuario y llevar control adecuadamente de todo lo que nos indique sobre sus contactos. Por tanto lo único que nos queda es conectar este asistente al bot en Telegram. Aquí es donde entra en juego la clase MemoMateProcessor. Esta clase se encarga de definir métodos para ser ejecutados a diferentes eventos que el bot de Telegram nos emita, como cuando un usuario inicia una nueva conversación, ejecuta un comando o nos envía un mensaje. Para cada una de estas acciones creamos un método en esta clase que lo gestione. Por ejemplo, cuando el usuario dispare el comando /help, haremos que se ejecute el método handleHelp de esta clase:

```
  public async handleHelp(ctx: Context) {
    const message = helpTemplate();
    ctx.reply(message, {
      parse_mode: 'HTML'
    });
  }
```

Este método simplemente define un string que contiene un html con el mensaje que le queremos dar al usuario y, a través de objeto Context, respondemos al usuario enviando dicho mensaje en formato html.

### Crons para recordatorios

### Pinecone para la búsqueda de contactos

### Web en Next

### Suscripciones con Stripe

### Mejoras, Repositorio y Fin


