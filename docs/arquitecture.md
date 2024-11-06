# Arquitectura del Proyecto PRM Chatbot en Telegram

## Descripción General
Este proyecto consiste en un sistema de gestión de relaciones personales implementado como un monorepo que integra un bot de Telegram y una interfaz web de gestión. La arquitectura se divide en múltiples aplicaciones y paquetes compartidos, utilizando Vercel para la web, PostgreSQL como base de datos, Pinecone para búsquedas semánticas, y un VPS dedicado para la gestión del bot.

## Estructura del Monorepo

### Apps
1. **Web (apps/web)**
   - Aplicación Next.js desplegada en Vercel
   - Interfaz de usuario para gestión de cuenta y contactos
   - Integración con Stripe para suscripciones
   - Sistema de autenticación basado en tokens de Telegram

2. **Bot (apps/bot)**
   - Aplicación TypeScript desplegada en VPS
   - Gestión de la interacción con Telegram
   - Procesamiento de mensajes y comandos
   - Sistema de recordatorios y notificaciones

### Packages
1. **Core (packages/core)**
   - Tipos y interfaces compartidas
   - Utilidades comunes
   - Lógica de negocio reutilizable
   - Constantes y configuraciones

2. **Database (packages/database)**
   - Modelos de Prisma
   - Migraciones
   - Utilidades de base de datos
   - Tipos generados por Prisma

3. **OpenAI (packages/openai)**
   - Integraciones con OpenAI
   - Lógica de procesamiento de lenguaje natural
   - Utilidades de vectorización

## Componentes y Tecnologías

### 1. Vercel
- **Web App:** Aloja la aplicación Next.js para la gestión de usuarios
- **PostgreSQL:** Base de datos principal del sistema
- **Despliegue Continuo:** Integración con GitHub para CD/CI

### 2. VPS (Servidor Dedicado)
- **Bot Server:** Ejecuta la aplicación del bot de Telegram
- **Gestión de Estado:** Mantiene las conexiones activas con Telegram
- **Sistema de Cron:** Gestiona los recordatorios y tareas programadas
- **Logs y Monitorización:** Sistema de registro y supervisión del bot

### 3. Pinecone
- **Vectores de Búsqueda:** Almacenamiento de embeddings para búsqueda semántica
- **Indexación de Contactos:** Facilita búsquedas contextuales y similitud

### 4. Base de Datos PostgreSQL
- **Gestión de Datos:** Almacena usuarios, contactos, eventos y recordatorios
- **Relaciones:** Mantiene las relaciones entre diferentes entidades
- **Acceso Compartido:** Utilizada tanto por la web como por el bot

## Flujo de Funcionamiento

### 1. Interacción con el Bot
- Los mensajes de Telegram son recibidos por el servidor bot en el VPS
- El bot procesa los mensajes utilizando los paquetes compartidos
- La información se almacena en PostgreSQL y Pinecone según corresponda
- Los recordatorios son gestionados por el sistema de cron del VPS

### 2. Gestión Web
- Los usuarios acceden a través de un token generado por el bot
- La web permite gestionar contactos y suscripciones
- Las operaciones se realizan utilizando los paquetes compartidos
- Los datos se sincronizan en tiempo real con la base de datos

### 3. Sistema de Recordatorios
- El VPS ejecuta las tareas programadas
- Consulta la base de datos para identificar recordatorios pendientes
- Utiliza el bot para enviar notificaciones a los usuarios
- Actualiza el estado de los recordatorios en la base de datos

## Ventajas de la Arquitectura
- **Modularidad:** Código reutilizable entre aplicaciones
- **Mantenibilidad:** Separación clara de responsabilidades
- **Escalabilidad:** Cada componente puede escalar independientemente
- **Desarrollo:** Facilita el trabajo en equipo y el testing
- **Despliegue:** Permite despliegues independientes de cada componente