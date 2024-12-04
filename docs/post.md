## Introducción

En este artículo quiero compartir mi experiencia desarrollando MemoMate, un asistente personal en Telegram que ayuda a gestionar y mejorar nuestras relaciones personales. La idea surgió de una necesidad personal: tener una forma sencilla de recordar detalles importantes sobre las personas que me importan - desde cumpleaños hasta conversaciones significativas.

## ¿Qué es MemoMate?

MemoMate es un bot de Telegram que actúa como un PRM (Personal Relationship Manager). A través de una conversación natural, puedes contarle información sobre tus contactos, y el bot se encarga de almacenar y organizar esta información de forma que la puedas usar fácilmente en el futuro. Vamos a ver aquí sus principales características.

### Gestión de Contactos

Durante tu conversación con el bot, este irá detectando los contactos sobre los que estás hablando y los irá registrando en tu cuenta. Tendrá la capacidad de saber si el contacto ya existe en la base de datos y, en caso de que no, lo creará. También puedes pedirle que edite cualquier información sobre un contacto o incluso que lo elimine.

### Información sobre Contactos

El bot está preparado para que le cuentes cualquier cosa que necesites recordar sobre cualquiera de tus contactos. El bot irá almacenando toda esta información para que más tarde puedas consultarla. Vamos a verlo con un ejemplo:

Imagina que tienes un amigo que se llama José y que el bot ya lo tiene registrado como un contacto tuyo. Podrías decirle algo como:

> "Ayer estuve con mi amigo José y me comentó que se está planteando dejar su trabajo"

Ahora imagina que pasan 3 meses y vas a quedar con tu amigo José. Podrías ir a MemoMate y preguntarle:

> "¿Qué me contó José la última vez?"

El bot te responderá diciendo:

> "José te dijo que se está planteando dejar su trabajo"

### Recordatorios

Otra funcionalidad interesante del bot es la de los recordatorios. MemoMate te permite registrar recordatorios sobre cualquier contacto, para que te envíe un mensaje en la fecha asignada. Por ejemplo, podrías decirle:

> "El próximo 15 de diciembre es el cumpleaños de mi amigo José. Recuérdame que le felicite"

El bot interpretará de este mensaje que tiene que crear un recordatorio para el próximo 15 de diciembre sobre el contacto José y para que le felicites. Cuando llegue dicha fecha, el bot te enviará un mensaje como:

> "Recuerda felicitar a José por su cumpleaños"

### Free vs Premium

MemoMate se podrá utilizar de forma gratuita, lo que pemitirá un uso limitado de la cuenta. Cada usuario tendrá un número de mensajes que puede enviar al bot cada mes. Cuando agote estos mensajes, el usuario no podrá enviar más mensajes hasta que no se le renueven sus créditos o pase a Premium. Cuando se hace Premium, el usuario se desbloquea la limitación de mensajes y puede hacer un uso ilimitado.

### Plataforma Web

Además del bot en Telegram, MemoMate también cuenta con una plataforma web que otorga al usuario ciertas funcionalidades:

* **Gestión de la suscripción**: A través de esta web el usuario podrá controlar la suscripción que convierte al usuario en Premium.
* **Gestión de Contactos**: Además de la gestión de contactos que realiza el propio bot, el usuario contará con una sección en la web en la que también pueda realizar esta gestión y con una característica extra importante: importación vía csv.
* **Gestión de Eventos:** Lo mismo para la información de los contactos. El usuario podrá ver y gestionar esta información también desde la aplicación web.
* **Analíticas:** La aplicación web le dará al usuario algunos datos interesantes acerca del uso de su cuenta.

## Arquitectura y Tecnologías

MemoMate se compone de 2 componentes (o aplicaciones) principales:

1. **Bot de Telegram**: para manejar toda la interacción con los usuarios.
2. **Aplicación Web**: para que el usuario pueda gestionar su cuenta y los contactos.

### Tecnologías empleadas

Vamos a ver aquí las tecnologías que he decidido emplear para implementar este producto y el porqué de cada una.

* **Monorepo con pnpm**: Ambas aplicaciones (bot y web) tienen funcionalidad que es interesante compartir. Por esta razón, decidí utilizar una arquitectura de monorepo en el que vivan estas 2 aplicaciones y que cuente con paquetes que definal las funcionalidades que se deban compartir. PNPM fue la elección natural por su eficiencia en el manejo de dependencias y su excelente soporte para workspaces. Si quieres saber más sobre este tema te recomiento [este artículo](https://www.enolcasielles.com/blog/monorepo) donde explico más en detalle.
* **PostgreSQL + Prisma**: Necesitaba una base de datos robusta que pudiera manejar relaciones complejas entre usuarios, contactos y eventos. PostgreSQL fue el candidato perfecto. Prisma añade una capa que nos facilita mucho tanto el manejo de las migraciones como la implementación de las diferentes comunicaciones con la base de datos que sean necesarias.
* **OpenAI**: La API de OpenAI, especialmente con sus Assistants, ofrece capacidades avanzadas de procesamiento de lenguaje natural. La posibilidad de definir "tools" personalizadas que el asistente puede utilizar fue clave para implementar las funcionalidades principales del bot.
* **Next.js**: Para la aplicación web, Next.js fue la elección ideal por varios motivos:
  * Server Components para mejor rendimiento
  * API Routes para implementar los endpoints serverless que necesitemos
  * Integración nativa con Vercel para despliegues
* **Tailwind CSS y Shadcn**: A la hora de definir la UI de la aplicación web, esta combinación es perfecta por la facilidad que otorga a la hora de crear los diferentes componentes de una forma robusta y eficiente.
* **Pinecone**: Para implementar búsquedas semánticas sobre la información de los contactos, necesitábamos una base de datos vectorial. Pinecone destaca por su facilidad de uso, rendimiento y capacidad para manejar grandes volúmenes de datos vectoriales.
* **Telegraf:** Para implementar el bot de telegram, optamos por utilizar la librería telegraf que destaca por su buen funcionamiento y facilidad de integración.

## El Proceso de Desarrollo

Vamos a explicar ahora como se ha abordado el proceso de desarrollo del proyecto, pasando por todos los pasos que se han ido dando para llegar desde una idea inicial hasta un producto totalmente funcional. No vamos a entrar en detalle de absolutamente todas las piezas de código que se fueron desarrollando, ya que haríamos el artículo excesivamente extenso. Voy a ir explicando como se fueron definiendo las diferentes partes y parándome en aquellas que considero más interesantes. Recomiendo abrir el [repositorio del proyecto](https://github.com/enolcasielles/memo-mate) y ver en más detalle la implementación realizada.

### Definición del Proyecto

Este proceso comenzó definiendo claramente el alcance y la arquitectura. Apoyándome mucho en ChatGPT fuí refinando la idea y documentando como íbamos a realizar cada parte. El objetivo aquí era crear diferentes documentos que iba volcando en la carpeta `docs`. Esta fase de planificación fue crucial para tener una visión clara del camino a seguir y para poder disponer de la información necesaria para llevar a cabo un [desarrollo eficiente con Cursor](https://www.enolcasielles.com/blog/using-cursor). En esta carpeta creamos diferentes documentos: explicación del proyecto, definición de la base de datos, arquitectura, etc. Esto nos permite que Cursor tenga conocimiento de lo que estamos desarrollando y nos ayude a iterar mucho más rápido.

### Estructura Base

Se utilizó una arquitectura de monorepo con los diferentes componentes. Por un lado las 2 aplicaciones que ya mencionamos (el bot y la web) y por otro lado los diferentes paquetes en los que se apoyarán estas aplicaciones. También contamos con una aplicación extra que llamamos `infra`. Esta aplicación será básicamente un docker-compose que nos permite levantar la infra en local que necesitemos, en este caso únicamente la base de datos PostgreSQL.&#x20;

> A pesar de tener un único servicio en la infra, decidimos mantener un docker-compose para que sea fácil incorporar nuevos servicios a futuro si fuera necesario.

En cuanto a los paquetes, tendremos los siguientes:

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

1. El bot envía este link al usuario para que pueda hacer clic en el, lo cual disparará la Api Route `/login` en la web. Esta ruta hará lo siguiente:
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

La clase `Agent` representa un asistente de OpenAI y maneja su ciclo de vida. Para poder utilizar los Asistentes de OpenAI lo primero que necesitas es crear uno, que lo puedes hacer usando su API o directamente a través de su [plataforma](https://platform.openai.com/assistants). En nuestro caso, creamos el asistente directamente en la plataforma y metimos su id como una variable de entorno para poder recuperarlo a través de la API, dentro de esta clase `Agent`

El asistente es la entidad en OpenAI a la que se le especifica su propósito y como debe operar. También se le especifica el modelo que debe utilizar, así como las herramientas que tiene disponibles para extender funcionalidad.&#x20;

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

Esta clase Agent también cuenta con una funcionalidad para comprobar si el asistente debe ser actualizado en OpenAI o no. La idea es que podamos desde el propio código del proyecto especificar como debe compartarse el asistente. El método shouldUpdate, compara los parámetros del Asistente en OpenAI con lo que hemos especificado en local (modelo, instrucciones, tools empleadas, etc.) Si detecta diferencias, actualizará el asistente en OpenAI, garantizando que desde el propio código controlemos su comportamiento.

```tsx
  private shouldUpdate(openAiAssistant: Assistant): boolean {
    if (this.name !== openAiAssistant.name) return true;
    if (this.description !== openAiAssistant.description) return true;
    if (this.instructions !== openAiAssistant.instructions) return true;
    if (this.model !== openAiAssistant.model) return true;
    if (this.tools.length !== openAiAssistant.tools.length) return true;
    return false;
  }
```

#### Tool

Los asistentes se pueden preparar para que ejecuten herramientas o tools, que son piezas de código que nos permiten llevar a cabo acciones que el propio Asistente no puede realizar. Por ejemplo, en nuestro caso, necesitaremos una Tools que cree un nuevo contacto. Para conseguir esto, lo que se hace es, primero especificarle al asistente que cuenta con una tool para crear un contacto y como la debe utilizar. Y, por otro lado, crear la propia tool para implementar dicha creación de usuario.&#x20;

Para dar soporte a esta pare, la case abstracta define la estructura para las herramientas que puede usar el asistente:

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

Cada Tool que creemos y le añadamos al Agente tendrá que ser una extensión de esta clase y deberá implementar el método run para realizar su función.

#### Thread

El siguiente concepto para comunicarnos con los asistentes de OpenAI es el Thread o hilo comunicación, que básicamente es cada conversación que tenga el Asistente. La idea en MemoMate es que cada usuario tenga su Thread propio, que se creará cuando se cree el usuario y permitirá mantener la conversación.

Sobre un Thread se crea un mensaje y se ejecuta un run para que OpenAI lo procese y devuelva un resultado.

La clase Thread que implementamos en este paquete @memomate/openai se encarga de implementar toda esta funcionalidad. Básicamente nos permite lo siguiente:

* Crear un nuevo hilo. Lo usaremos cuando se cree un nuevo usuario.

```tsx
  static async create() {
    const thread = await openaiClient.beta.threads.create();
    return thread.id;
  }
```

* Enviar un mensaje a un hilo. Se disparará con cada nuevo mensaje del usuario, a su hilo correspondiente.

```tsx
  async send(message: string, retries: number = 1): Promise<string> {
    if (!this.agent) throw new Error("Assistant not set");
    if (!this.thread) await this.init();
    await openaiClient.beta.threads.messages.create(this.id, {
      role: "user",
      content: message,
    });
    this.run = await openaiClient.beta.threads.runs.create(this.id, {
      assistant_id: this.agent.id,
    });
    while (true) {
      await this.waitUntilDone();
      if (this.run.status === "completed") {
        const _message = await this.extractMessage();
        return _message;
      } else if (this.run.status === "requires_action") {
        await this.processAction();
      } else {
        const err = "Run failed: " + this.run.status;
        console.log(err);
        if (retries < MAX_RETRIES) {
          console.log("Retrying in 30s...");
          await new Promise((resolve) => setTimeout(resolve, 30000));
          return this.send(message, retries + 1);
        }
        const _message = this.generateFailedMessage();
        return _message;
      }
    }
  }
```

Dentro de este método `send`, se procesa la respuesta que nos da OpenAI, que puede ser un mensaje a devolver o una herramienta a ejecutar. Cuando sea una herramienta a ejecutar, buscaremos la herramienta correspondiente dentro de las tools del Agente y ejecutaremos su método `run`, devolviendo al asistente el resultado de dicha ejecución para que pueda continuar y entregar una respuesta final.

```tsx
  private async processAction() {
    const toolsToExecute =
      await this.run.required_action.submit_tool_outputs.tool_calls;
    const toolsResults = [];
    for (const toolToExecute of toolsToExecute) {
      const toolName = toolToExecute.function.name;
      const tool = this.agent.tools.find((t) => t.name === toolName);
      const toolResult = tool
        ? await tool.run({
            ...JSON.parse(toolToExecute.function.arguments),
            metadata: this.metadata,
          })
        : "ERROR: no existe ninguna herramienta con el nombre que has indicado. Inténtalo de nuevo con el nombre correcto. La lista de herramientas disponibles es la siguiente: " +
          this.agent.tools.map((t) => t.name).join(", ");
      toolsResults.push({
        tool_call_id: toolToExecute.id,
        output: toolResult.toString(),
      });
    }
    this.run = await openaiClient.beta.threads.runs.submitToolOutputs(
      this.id,
      this.run.id,
      {
        tool_outputs: toolsResults,
      },
    );
  }
```

#### Embeddings

Otro concepto que necesitamos de OpenAI es el de los embeddings, que es la transformación de cierto texto en un formato vectorial que nos permita realizar búsquedas semánticas. Esto lo usaremos para poder recuperar los contactos del usuario. Cada vez que se cree o se actualice un contacto, generaremos su embedding correspondiente y lo guardaremos en Pinecone, para poder buscarlo en el futuro.

Para maneja esta generación de embeddings hemos creado esta clase dentro de este paquete.

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

Una vez contamos con este paquete `@memomate/openai` ya estamos en disposición de proceder con la implementación del Asistente. En la aplicación bot, creamos una nueva carpeta `assistant` que se encargue de esto.&#x20;

Empezamos con las tools, o las herramientas que le daremos al asistente para que pueda realizar las diferentes acciones necesarias: Crear un Contacto, Buscar un Contacto, Crear un Evento, etc. Cada herramienta será una clase que extienda de la clase abstracta Tool. El método `run` será el que se ejecuta cuando el asistente detecte que debe usar esta Tool. Y por tanto, en este método `run` es donde definimos lo que queremos que esta Tool realice.

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

A continuación, creamos los archivos de texto `instructions.md` y `description.md` (formato markdown), para definir la descripción y las instrucciones de nuestro asistente. Aquí es donde le explicamos a nuestro asistente como debe actuar para llevar a cabo su propósito.

Y ya por último, creamos la clase `MemoMateAssistant`, que será la que se encargue de crear e inicializar el agente juntando todas las anteriores piezas y de exponer un método `sendMessage` que permita enviarle un nuevo mensaje a este Agente usando el hilo del usuario en cuestión.

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

Una cosa a destacar es la inicialización del agente. Como podemos ver, y en línea con lo que comentábamos en el punto anterior, el Asistente ya lo tenemos creado y contamos con su id en OpenAI, el cual mantenemos en una variable de entorno para que directamente se recupere y, si es necesario, se actualice.

### Conectar Bot con Asistente. Clase MemoMateProcessor

Una vez tenemos el asistente ya configurado, el siguiente paso es conectarlo al bot de Telegram para que el usuario pueda interactuar con él. Aquí es donde entra en juego la clase `MemoMateProcessor`. Esta clase se encarga de definir métodos para ser ejecutados en diferentes eventos que el bot de Telegram nos emita, como cuando el usuario inicia una nueva conversación, o cuando envía un mensaje. Para cada una de estas acciones, creamos un método en esta clase que lo gestione. Por ejemplo, cuando el usuario dispare el comando `/help`, haremos que se ejecute el método `handleHelp` de esta clase:

```
  public async handleHelp(ctx: Context) {
    const message = helpTemplate();
    ctx.reply(message, {
      parse_mode: 'HTML'
    });
  }
```

Este método simplemente define un html con el mensaje que le queremos dar al usuario, en este caso con la ayuda de como usar el bot. A través de objeto Context, respondemos al usuario enviando dicho mensaje en formato html.

El método más interesante en esta clase es el handleMessage, que será el que se ejecute con cada mensaje del usuario. Vamos a ver un poco lo que se hace aquí.

```tsx
  public async handleMessage(ctx: TextMessageContext) {
    try {
      const telegramUserId = ctx.message.from.id;
      const chatId = ctx.message.chat.id;
      const message = ctx.message.text;
  
      const user = await this._getOrCreateUser(telegramUserId, chatId);
  
      const canSend = user.stripeSubscriptionId || user.credits > 0;
      
      if (!canSend) {
        const link = await this.createSessionUrl(user.id);
        ctx.reply(limitMessageTemplate(link), {
          parse_mode: 'HTML'
        });
        return;
      }

      await prisma.messageLog.create({
        data: {
          userId: user.id,
          message: message,
          direction: MessageLogDirection.INCOMING,
        }
      });

      const response = await this.assistant.sendMessage(user.id, user.openaiThreadId, message);
      
      await prisma.messageLog.create({
        data: {
          userId: user.id,
          message: response,
          direction: MessageLogDirection.OUTGOING,
        }
      });
      
      if (!user.stripeSubscriptionId) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            credits: { decrement: 1 }
          }
        });
      }
      
      ctx.reply(response);
    } catch (error) {
      console.error(error);
    }
  }
```

En primer lugar, recuperamos a través del `Context` los datos que neceisitamos para poder identificiar al usuario y el mensaje que nos envía. Llamamos a un método privado `_getOrCreateUser` que se encarga de recuperar este usuario en nuestra base de datos, o de crearlo si no existiera.

> Es interesante ver la implementación de este método `_getOrCreateUser`. Podemos ver como, al crear el usaurio, también creamos el Thread que nos permite abrir una nueva conversación con el asistente. De esta forma ya tendremos todo listo para que este nuevo usuario pueda enviar mensajes al asistente.

El siguiente paso es analizar si el usuario puede enviar mensajes al asistente o no. Muy sencillo, podrá enviar si es Premium o, en su defecto, si el número de créditos es mayor que 0. Si no puede enviar, resolvemos este método enviando un mensaje estándar que le sugiera ir a la plataforma Web para hacerse Premium.

En caso contrario, ya solo nos queda enviar el mensaje del usuario al asistente, a través del `sendMessage` del `MemoMateAssistant`. Si el usuario no es Premium, le restamos crédito. Guardamos ambos mensajes (el del usuario y la respuesta) en un Log de mensajes. Y, finalmente, respondemos al usuario con la respuesta del asistente.

### Crons para recordatorios

Para manejar tanto los recordatorios como la renovación de créditos de usuarios gratuitos, implementamos un sistema de tareas programadas usando la librería `cron`. Se creó una clase `CronManager` que gestiona dos trabajos principales:

1. **Procesamiento de Recordatorios**: Se ejecuta cada minuto para verificar si hay recordatorios pendientes que deban ser enviados a los usuarios. Cuando encuentra recordatorios cuya fecha de notificación ha llegado, envía un mensaje por Telegram al usuario correspondiente.

> El parámetro `telegramChatId` que guardamos en el usuario cuando lo creamos es lo que necesitamos para poder enviar un mensaje a ese usuario en Telegram

```tsx
async processReminders() {
  const pendingReminders = await prisma.reminder.findMany({
    where: {
      completed: false,
      remindAt: {
        lte: new Date()
      }
    },
    include: {
      user: true,
      contact: true
    }
  });

  for (const reminder of pendingReminders) {
    let message = `🔔 Recordatorio: ${reminder.message}`;
    if (reminder.contact) {
      message += `\nContacto: ${reminder.contact.name}`;
    }

    await this.bot.telegram.sendMessage(
      reminder.user.telegramChatId.toString(),
      message
    );
    
    await prisma.reminder.update({
      where: { id: reminder.id },
      data: { completed: true }
    });
  }
}
```

1. **Renovación de Créditos**: Se ejecuta diariamente a las 3 AM para renovar los créditos de los usuarios gratuitos. Busca usuarios cuya fecha de renovación haya llegado y les asigna nuevamente su cuota mensual de créditos:

```tsx
async renewCredits(): Promise<void> {
  const usersToRenew = await prisma.user.findMany({
    where: {
      stripeSubscriptionId: null,
      renewAt: {
        lt: new Date()
      }
    }
  });

  for (const user of usersToRenew) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: DEFAULT_CREDITS,
        renewAt: addMonths(new Date(), 1)
      }
    });
  }
}
```

La implementación actual es simple pero efectiva, aunque **tiene margen de mejora**. Por ejemplo, el procesamiento tanto de recordatorios como de renovación de créditos se realiza de forma secuencial, lo que podría ser un problema si el número de usuarios crece significativamente. Una mejora futura sería implementar un sistema de procesamiento por lotes para manejar grandes volúmenes de datos de manera más eficiente.

### Pinecone para la búsqueda de contactos

Uno de los desafíos más interesantes fue implementar un sistema que permitiera al asistente identificar correctamente de qué contacto está hablando el usuario, incluso cuando la referencia no es exacta. Por ejemplo, si el usuario dice "mi amigo Juan de Madrid", el sistema debe ser capaz de encontrar el contacto correcto aunque esté guardado como "Juan García".

Para lograr esto, implementamos búsqueda semántica utilizando Pinecone, una base de datos vectorial que nos permite buscar similitud entre textos. El proceso funciona así:

1. **Indexación de Contactos**: Cuando se crea o actualiza un contacto, generamos un embedding (una representación vectorial del texto) que incluye toda la información relevante del contacto:

```tsx
      // Dentro de CreateContactTool
      
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
```

1. **Búsqueda de Contactos**: Cuando el asistente necesita identificar un contacto, utiliza la herramienta `SearchContactTool` que convierte la consulta en un embedding y busca coincidencias en Pinecone:

```tsx
async run(parameters: SearchContactRunProps): Promise<string> {
  const searchText = `Nombre: ${name}${relation ? `, Relación: ${relation}` : ''}${location ? `, Ubicación: ${location}` : ''}`;
  
  const embeddings = new Embeddings();
  const queryEmbedding = await embeddings.generateEmbedding(searchText);
  
  const results = await PineconeService.getInstance().searchSimilarContacts(
    metadata.userId,
    queryEmbedding,
    1 // Solo necesitamos el más similar
  );

  if (results.length > 0 && results[0].score && results[0].score > 0.7) {
    return `Contacto encontrado con ID: ${results[0].id}`;
  }
  return "No se encontró ningún contacto que coincida...";
}
```

La implementación se centraliza en la clase `PineconeService`, que maneja toda la interacción con Pinecone:

```tsx
export class PineconeService {
  private indexName = 'memomate-contacts';
  private dimension = 1024;

  async init() {
    try {
      const pinecone = getPineconeClient();
      
      // Verificar si el índice existe
      const existingIndexes = await pinecone.listIndexes();
      
      const indexExists = existingIndexes?.indexes?.some(
        (index: IndexModel) => index.name === this.indexName
      );
      
      if (!indexExists) {
        // Crear el índice si no existe
        await pinecone.createIndex({
          name: this.indexName,
          dimension: this.dimension,
          metric: 'cosine',
          spec: {
            serverless: {
              cloud: 'aws',
              region: 'us-east-1'
            }
          },
        });
        
        console.log('Índice de Pinecone creado correctamente');
      }
    } catch (error) {
      console.error('Error al inicializar Pinecone:', error);
      throw error;
    }
  }

  async searchSimilarContacts(userId: string, queryEmbedding: number[], limit: number = 5) {
    try {
      const pinecone = getPineconeClient();
      const index = pinecone.index(this.indexName);

      const results = await index.query({
        vector: queryEmbedding,
        filter: {
          userId: userId
        },
        topK: limit,
        includeMetadata: true
      });

      return results.matches;
    } catch (error) {
      console.error('Error al buscar contactos similares:', error);
      return [];
    }
  }
}
```

Esta implementación nos permite una búsqueda "fuzzy" de contactos que va más allá de la coincidencia exacta de texto. El sistema entiende el contexto y las relaciones semánticas, permitiendo que el asistente identifique correctamente los contactos incluso cuando el usuario los menciona de forma informal o incompleta.

### Web en Next

Hasta aquí hemos visto todo lo que tiene que ver con el bot o la integración con OpenAI. Vamos a ver ahora muy brevemente la implementación que hemos hecho en el lado de la Web.

La aplicación Web de MemoMate se implementó utilizando Next.js 14, aprovechando sus Server Components y con el App Router. Se trata de una implementación relativamente sencilla que sirve como complemento al bot de Telegram, permitiendo a los usuarios gestionar su cuenta y visualizar sus datos de una forma más estructurada.

La web consta de las siguientes secciones principales:

* **Landing Page**: Una página de inicio atractiva que presenta el producto, sus características principales y ejemplos de uso. Implementada con componentes interactivos y un diseño moderno usando Tailwind. Anima al usuario a acceder al bot y, cuando detecta que el usuario está autenticado, le muestra un enlace para acceder a su dashboard.
* **Dashboard**: Muestra un resumen de la actividad del usuario, incluyendo estadísticas sobre sus contactos y uso del bot
* **Contactos**: Permite ver, editar y eliminar contactos, así como importar contactos mediante CSV
* **Eventos**: Visualización y gestión de los eventos registrados para cada contacto
* **Suscripción**: Panel para gestionar la suscripción Premium mediante Stripe

Lo más interesante de la implementación web es su mecanismo de autenticación, que ya explicamos anteriormente. En lugar de un sistema tradicional de login/registro, la autenticación se realiza a través del bot de Telegram, que genera links temporales de acceso. Este enfoque no solo simplifica la experiencia del usuario sino que también refuerza la integración entre el bot y la web.

La UI se construyó utilizando Tailwind CSS junto con los componentes de Shadcn/ui, lo que nos permitió crear una interfaz moderna y responsive de forma rápida y mantenible.

Al ser una implementación bastante estándar de Next.js, no profundizaremos más en los detalles técnicos. El código fuente está disponible en el repositorio para aquellos interesados en explorar la implementación completa.

### Suscripciones con Stripe

La gestión de suscripciones es una parte fundamental de MemoMate, ya que determina el acceso a las funcionalidades Premium. Implementamos un sistema de suscripciones usando Stripe, que es gestionado desde la plataforma Web y que se reflejan en la base de datos para que el bot pueda saber si un usuario es Premium o no y actuar en consecuencia.

#### Interfaz de Suscripción

La página de suscripción proporciona una interfaz clara para que los usuarios gestionen su plan. Controlará si el usuario tiene una suscripción activa o no, mostrándole la UI correspondiente. En cualquier caso, podrá gestionar su suscripción, tanto para activarla como para cancelarla, siempre redireccionando al checkout de Stripe.

#### Integración con el Bot

El bot, en el `MemoMateProcessor`, verifica el estado de la suscripción antes de procesar cada mensaje:

```tsx
public async handleMessage(ctx: TextMessageContext) {

  // 

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
  
  // Procesar el mensaje...
}
```

#### Webhooks de Stripe

Para mantener sincronizado el estado de la suscripción, implementamos un webhook que procesa los eventos de Stripe. Esta es la forma que tenemos de enterarnos si el usuario decida cancelar la suscripción y, en consecuencia, debemos elimianr el Premium en el usuario. Desde ese momento le asignamos los créditos iniciales y le marcamos la fech de renovación dentro de un mes.

```tsx
export default async function StripeWebhookRoute(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature")!;
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "customer.subscription.deleted" || 
        event.type === "customer.subscription.updated") {
      const subscription = event.data.object as Stripe.Subscription;
      
      if (subscription.status !== "active") {
        await prisma.user.updateMany({
          where: {
            stripeSubscriptionId: subscription.id as string,
          },
          data: {
            stripeSubscriptionId: null,
            renewAt: addMonths(new Date(), 1),
            credits: DEFAULT_CREDITS,
          },
        });
      }
    }

    return NextResponse.json({ received: true });
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
```

En resumen, este sistema nos permite:

1. **Gestión Transparente**: Los usuarios pueden gestionar su suscripción fácilmente desde la web
2. **Actualización Automática**: El estado de la suscripción se actualiza automáticamente en la base de datos cuando ocurren eventos en Stripe
3. **Control de Acceso**: El bot verifica el estado de la suscripción antes de procesar cada mensaje
4. **Degradación Graciosa**: Cuando un usuario cancela su suscripción, vuelve automáticamente al plan gratuito con sus créditos mensuales

### Mejoras Futuras y Conclusión

Durante el desarrollo de MemoMate, han surgido varias ideas para mejoras futuras que podrían enriquecer aún más la experiencia:

1. **Procesamiento en Lotes**: Implementar un sistema de procesamiento por lotes para manejar recordatorios y renovaciones de créditos de forma más eficiente.
2. **Integración con Más Plataformas**: Expandir más allá de Telegram, añadiendo soporte para WhatsApp o Discord.
3. **Análisis de Sentimientos**: Incorporar análisis de sentimientos para detectar el estado emocional en las conversaciones y ofrecer insights más profundos.
4. **Exportación de Datos**: Permitir a los usuarios exportar toda su información en diferentes formatos.
5. **Mejoras en la Búsqueda**: Refinar el sistema de búsqueda semántica para obtener resultados aún más precisos.

El desarrollo de MemoMate ha sido un viaje fascinante que me ha permitido explorar y combinar diferentes tecnologías modernas. Desde la integración con OpenAI hasta la implementación de búsquedas semánticas con Pinecone, cada parte del proyecto ha presentado sus propios desafíos y aprendizajes.

Si te ha interesado este proyecto y quieres saber más, no dudes en contactarme. Puedes encontrarme en:

- Twitter: [@enolcasielles](https://twitter.com/enolcasielles)
- LinkedIn: [Enol Casielles](https://www.linkedin.com/in/enolcasielles)
- Email: enolcasielles@gmail.com

También puedes explorar el [código completo en GitHub](https://github.com/enolcasielles/memo-mate) y, por supuesto, probar el bot en Telegram buscando [@MemoMateBot](https://t.me/MemoMateBot).

¡Espero que este artículo te haya resultado útil e interesante! Si tienes cualquier duda, sugerencia o simplemente quieres compartir tu experiencia, estaré encantado de escucharte. 🚀