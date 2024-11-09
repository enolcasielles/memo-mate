## Definir el proyecto
El primer paso ha sido definir el proyecto a desarrollar. Para ellos nos hemos apoyado en ChatGPT y le hemos dado forma a la arquitectura, herramientas y tecnologías a utilizar, modelo de la base de datos, etc. Con todo ello hemos creado una carpeta `docs` en la que hemos ido volcando toda esta información. Esta carpeta nos ayudará a explicar a Cursor como debe ir implementando el proyecto.

https://chatgpt.com/c/671f2223-3c3c-8007-9c6c-8efe399fddf5


## Crear el proyecto base
Lo siguiente que hemos hecho es crear el proyecto base con el que poder trabajar. Tal como se ha definido en la arquitecura, utilizaremos un monorepo con pnpm. Para ello vamos a seguir la misma configuración que tenemos en [este proyecto](https://github.com/enolcasielles/next-nest-clean-arquitecture) en mi Github. Para la parte de NestJS utilizaremos como base el proyecto `next-base` en mi Github:

https://github.com/enolcasielles/next14-starter-project

## Base de datos
Para la base de datos hemos acordado usar PostgreSQL y Prisma como ORM. El siguiente paso será crear el modelo de la base de datos y definir las relaciones entre las tablas. Para ellos hemos utilizado Cursor Composer. Referenciando a los documentos de docs le hemos pedido que cree el modelo de la base de datos y las relaciones entre las tablas. También hemos creado un archivo `seed.ts` para poder introducir datos de prueba en la base de datos.

La impelementación de la base de datos la hemos hecho como un paquete independiente en el monorepo: `database`.

## Core
También hemos creado un paquete `core` en el monorepo, que contendrá todas las utilidades compartidas entre los diferentes proyectos o paquetes del monorepo.

## Autenticación
El siguiente paso fue definir la autenticación. En la definición del proyecto habíamos acordado usar un simple mecanismo de autenticación basado en un token de sesión que expirará pasado un tiempo. Para ellos hemos creado una Api Route de Next /login, que recibirá como parámetro un token de sesión. Se comprobará si el token es válido y, si es así, hará un redirect a /dashboard. En caso contrario devolverá un error.

También hemos creado una layer para las rutas privadas, de manera que si un usuario no está autenticado y trata de acceder a una ruta privada será redirigido a la home.

## Home
El siguiente paso ha sido definir la home. Con V0 de dev hemos definido la interfaz de la home:
https://v0.dev/chat/HH8HkahPa1o

## Estructura dashboard
El siguiente paso ha sido definir la estructura del dashboard. Para ellos hemos usado Cursor Composer. Pasando como referencia los requerimientos de la web definidos en la documentación, le hemos pedido que crease la estructura del dashboard.

## Suscripción
Hemos implementado un sistema completo de suscripciones utilizando Stripe como proveedor de pagos. El módulo permite a los usuarios gestionar sus suscripciones, activar nuevas suscripciones y ver el estado actual de las mismas.

## Contactos
El siguiente paso ha sido implementar la gestión de contactos. De nuevo hemos utilizado Cursor Composer para que nos definiera una estructura inicial de todos los ficheros y funcionalidades. Sobre ella hemos ido corrigiendo y ajustando cosas para que cumpliera con los requerimientos:
- Ver contactos
- Buscar contactos
- Crear contactos
- Editar contactos
- Eliminar contactos

Para la importación de contactos hemos utilizado la librería `csvtojson` que nos permite convertir un fichero CSV a un array de objetos JSON. De nuevo nos hemos apoyado en Cursor Composer para crear la funcionalidad de importación de contactos. Tenemos una captura del prompt utilizado.

## Paquete OpenAI
El siguiente paso ha sido crear el paquete `openai` en el monorepo. Este paquete contendrá toda la lógica relacionada con OpenAI, como las clases Agent, Thread, Tool. Lo que busca este paquete es abstraer toda la lógica de OpenAI para que sea más fácil su uso en el resto de paquetes del monorepo.

## App Bot para manejar la interacción con Telegram
El siguiente paso ha sido crear la app `bot` en el monorepo. Esta app se encargará de manejar la interacción con Telegram. Para ello usaremos la librería `telegraf` que nos permite crear un bot de Telegram.

En este paquete implementamos la integración con OpenAI para la creación del asistente. También creamos una clase Processor que se encargará de procesar los mensajes de Telegram y enviarlos a OpenAI para que sean procesados.

En este paquete también implementamos la lógica para crear un usuario en la base de datos y relacionarlos con el thread de OpenAI.


## Definición del asistente
Lo siguiente que he hecho es definir el asistente de OpenAI. Para ello he creado un archivo `instructions.md` en el paquete `bot` que contendrá las instrucciones para el asistente. Para conseguir esto, he utilizado el chat de Cursor. Le he proporcinado como contexto el `project.md` y a partir de eso me ha creado el archivo con la definición del asistente.

## Primera herramienta: Crear un contacto
El siguiente paso ha sido crear la primera herramienta. Esta herramienta se encargará de crear un contacto en la base de datos. Para ello he creado una clase `CreateContactTool`, que define los parámetros necesarios para crear un contacto y la lógica para crearlo en la base de datos.

## Integración con Pinecone
El siguiente paso ha sido la integración de Pinecone, para la indexación y búsqueda de contactos. Para ellos hemos creado un nuevo módulo en el paquete `bot` llamado `pinecone`. Este módulo se encargará de la inicialización e interacción con Pinecone. Además, hemos creado una clase `Embeddings` en el paquete `openai` que se encargará de la generación de embeddings.

## Agregar más Tools
El siguiente paso ha sido agregar más herramientas al asistente. Hemos creado herramientas para buscar un contacto, crear un evento, obtener la fecha actual y crear un recordatorio. Para ello hemos utilizado Cursor Composer, le hemos explicado como debe funcionar cada Tool y le hemos dicho que las cree una a una siguiente la arquitectura actual del proyecto `bot`. El resultado ha sido perfecto, no ha sido necesario hacer ningún el código proporcionado.

## Implementar Cron para Recordatorios
### 1. Dependencias Añadidas
- Se agregó la librería `cron` para manejar tareas programadas
- Se incluyó `@types/cron` como dependencia de desarrollo

### 2. Modificaciones en la Base de Datos
- Se añadió el campo `telegramChatId` al modelo `User` en el schema de Prisma
- Este cambio permite enviar notificaciones directamente al chat correcto del usuario

### 3. Actualización del Procesador de Mensajes
- Se modificó `MemoMateProcessor` para capturar y almacenar el `chatId` del usuario
- El método `_getOrCreateUser` ahora guarda tanto el `telegramUserId` como el `telegramChatId`

### 4. Integración del Sistema Cron
- Se creó un nuevo servicio `CronManager` (referenciado en `index.ts`)
- Se implementó como singleton para gestionar todas las tareas programadas
- Se inicializa con una instancia del bot de Telegram para poder enviar notificaciones

### 5. Arquitectura de Inicialización
- El bot de Telegram ahora se inicializa antes que otros servicios
- Se agregó la inicialización del `CronManager` en el flujo principal
- Los cron jobs se inician después de que el bot está completamente configurado

Este sistema permite:
- Programar recordatorios automáticos
- Enviar notificaciones a los usuarios en momentos específicos
- Mantener un registro centralizado de los chats activos
- Gestionar múltiples recordatorios por usuario

## Agregar lógica para la configuración inicial del usuario

## Agregar lógica para controlar el acceso del usuario

## Integrar con Directus para tener un CMS de contenidos