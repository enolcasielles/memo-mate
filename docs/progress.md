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

### Resumen del sistema de recordatorios
Este sistema permite:
- Programar recordatorios automáticos
- Enviar notificaciones a los usuarios en momentos específicos
- Mantener un registro centralizado de los chats activos
- Gestionar múltiples recordatorios por usuario

## Agregar lógica para la configuración inicial del usuario
Se agrega lógica para manejar los diferentes comandos del bot en Telegram. En concreto, se ha añadido la lógica para manejar el comando `/start`, que es el que se ejecuta cuando un usuario se une al bot y se encarga de crear un usuario en la base de datos y enviar un mensaje de bienvenida en el que se incluye un enlace para que el usuario pueda iniciar sesión en la web y configurar su cuenta. También se ha añadido la lógica para el comando `/setup`, que genera la url de login del usuario en la web y le envía el mensaje con dicho enlace. Además, se ha añadido la lógica para manejar el comando `/help`, que es el que se ejecuta cuando un usuario envía un mensaje de ayuda al bot y le explica los comandos disponibles. 

## Agregar lógica para controlar el acceso del usuario
Por último, hemos modificado la base de datos para añadir los campos `credits` y `renewAt` al modelo `User`. Estos campos se utilizan para controlar el acceso del usuario al bot. Cuando un usuario es free, es decir, que no tenga una suscripción active en Stripe, controlaremos el uso de créditos. Cada crédito será una llamada al asistente. Le daremos 10 créditos por defecto, que se renovarán cada mes. Para controlar esto, primero hemos implementado un webhook de Stripe que nos permita enterarnos cuando una sussripción es cancelada o expirada, así podremos volver a marcar el usuario como free. También, cuando se crea el usuario, le marcamos como free y le añadimos los créditos por defecto.

Cuando se debe enviar un mensaje al asistente, comprobamos previamente si el usuario es Premium o tiene créditos disponibles. Si no, le enviamos un mensaje indicándole que puede actualizar a premium para poder enviar más mensajes. También le reducimos un crédito después de enviar el mensaje.

Por último, creamos un nuevo cron que nos permite renovar los créditos de los usuarios free cada mes.

## Mejoras en la UI/UX
Lo siguiente que hemos hecho es mejorar la UI/UX del proyecto. Para ellos, ya que no contamos con una propuesta de diseño, lo que hemos hecho es una captrua del contenido de la landing actual, se la hemos pasado a Cursor Chat y le hemos pedido que realice una mejora de la misma, para obtener un diseño más moderno y atractivo. Iterando un poco en este proceso pidiéndole cambios visuales que se podían mejorar, hemos conseguido un diseño bastante mejorable. Una vez tenemos la landing, hemos ido por cada una de las páginas diciendo que aplique la misma línea de diseño de la landing a dicha página. Es sorprendente lo capaz que es de entendr el context y aplicar cambios significativos mejorando mucho la UI/UX del proyecto.

## Nueva sección Panel de Control
Hemos creado una nueva sección en la web, el panel de control, que contiene un resumen de la información más relevante del usuario. Para ellos de nuevo hemos utilizado Cursor Composer, le hemos explicado que debía ser una sección con un diseño similar al de la landing y que debía contener una serie de tarjetas con información relevante del usuario. Que analizase el modelo de datos actual (pasándole el archivo `schema.prisma`) y que crease la vista con la información que considere más relevante.

## Tool para recuperar la información de un contacto
Hemos implementado un nuevo tool para que el asistente pueda recuperar la información de un contacto. Este tool se encargará de recuperar los últimos eventos de un contacto, para dárselos al asistente y que pueda usarlos para generar una respuesta más completa y personalizada.


## Pantalla de errores. Sobre todo, que psa cuando accedes a un link de autenticación expirado. Manejar bien ese flujo.
Por último, hemos creado una pantalla de errores que se muestra cuando el usuario intenta acceder a una ruta privada sin estar autenticado, o cuando el link de acceso expira.

## Nuevas Tools para Actualizar y Borrar Contactos
Hemos creado dos nuevas tools para que el asistente pueda actualizar y borrar contactos.

## Agrega página de eventos de un contacto
Hemos creado una nueva página para ver los eventos de un contacto. Para ello hemos creado un nuevo componente `EventList` que lista los eventos de un contacto y una nueva página `ContactEventsPage` que es la que renderiza esta lista.