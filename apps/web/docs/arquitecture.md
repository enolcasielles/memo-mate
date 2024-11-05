# Arquitectura del Proyecto PRM Chatbot en Telegram

## Descripción General
Este proyecto consiste en desarrollar un sistema de gestión de relaciones personales a través de un bot en Telegram. El usuario podrá interactuar con el bot, quien gestionará información sobre sus contactos, almacenará eventos y establecerá recordatorios. La arquitectura utiliza Vercel para la interfaz web, la gestión de cron jobs, la base de datos con PostgreSQL. Paraleleamene utilizaremos Pinecone para la indexación y búsqueda semántica de contactos.

## Componentes y Tecnologías

### 1. Vercel
- **Despliegue de la Web de Gestión:** La web, desarrollada en Next.js, permitirá a los usuarios gestionar su cuenta, incluyendo suscripciones y la importación de contactos.
- **Vercel Functions:** Estas funciones serverless se utilizan para recibir y procesar los mensajes de Telegram. Actúan como webhook para que el bot esté disponible cada vez que un usuario le envíe un mensaje.
- **Cron Jobs:** Se configuran cron jobs para manejar tareas programadas, como la gestión y envío de recordatorios.
- **Base de Datos PostgreSQL:** Almacena la información de usuarios, contactos, eventos y recordatorios.

### 2. Pinecone
- **Indexación y Búsqueda Semántica:** Pinecone almacena y facilita la búsqueda de contactos relevantes mediante indexación y búsqueda semántica.


## Flujo de Funcionamiento

### 1. Interacción con el Bot de Telegram
- **Recepción de Mensajes:** Los mensajes de Telegram activan un webhook configurado como una Vercel Function. Esta función recibe el mensaje, identifica al usuario y procesa la información mediante consultas a la base de datos en PostgreSQL.
- **Procesamiento y Respuesta:** La función procesa el contenido del mensaje. Por ejemplo, si el mensaje contiene información sobre un contacto, la función puede almacenar el evento en la base de datos o responder con información relevante.

### 2. Web de Gestión en Next.js
- **Suscripción y Gestión de Cuenta:** La web permite a los usuarios gestionar sus datos, activar suscripciones (a través de Stripe) e importar contactos desde archivos CSV. Las operaciones de datos se sincronizan con Supabase para mantener la base de datos actualizada.
- **Autenticación de Usuario:** La única forma de acceder a la web es a través de un link que se envía al usuario en el bot de Telegram. Este link contiene un token que se verifica en el servidor para permitir el acceso.

### 3. Tareas Programadas con Cron Jobs de Vercel
- **Recordatorios y Notificaciones:** Los cron jobs activan una Vercel Function a intervalos específicos para revisar los recordatorios pendientes en la base de datos y enviar notificaciones al bot de Telegram cuando corresponda.
- **Consulta de Eventos Pendientes:** Cada vez que se activa un cron job, la función realiza una consulta a la base de datos para identificar recordatorios programados en el próximo intervalo de tiempo y envía los mensajes correspondientes.