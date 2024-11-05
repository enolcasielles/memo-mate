## Definir el proyecto
El primer paso ha sido definir el proyecto a desarrollar. Para ellos nos hemos apoyado en ChatGPT y le hemos dado forma a la arquitectura, herramientas y tecnologías a utilizar, modelo de la base de datos, etc. Con todo ello hemos creado una carpeta `docs` en la que hemos ido volcando toda esta información. Esta carpeta nos ayudará a explicar a Cursor como debe ir implementando el proyecto.

https://chatgpt.com/c/671f2223-3c3c-8007-9c6c-8efe399fddf5


## Crear el proyecto base
Lo siguiente que hemos hecho es crear el proyecto base con el que poder trabajar. Dado que hemos acordado usar NextJS, podemos utilizar como base el proyecto `next-base` que tengo en mi Github.

https://github.com/enolcasielles/next14-starter-project

## Base de datos
Para la base de datos hemos acordado usar PostgreSQL y Prisma como ORM. El siguiente paso será crear el modelo de la base de datos y definir las relaciones entre las tablas. Para ellos hemos utilizado Cursor Composer. Referenciando a los documentos de docs le hemos pedido que cree el modelo de la base de datos y las relaciones entre las tablas. También hemos creado un archivo `seed.ts` para poder introducir datos de prueba en la base de datos.

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

## Api Route para webhook de telegram

## Creación de asistente de OpenAI

## Función de crear el link de autenticación

## Función de recuperar un contacto

## Función de crear un contacto

## Función de agregar un evento a un contacto

## Función de crear un recordatorio