# Documento Técnico: Bot de Telegram MemoMate

## Tecnologías
- Runtime: Node.js
- Framework: NestJS
- Base de Datos: PostgreSQL con Prisma como ORM
- Procesamiento de Lenguaje: OpenAI API
- Búsqueda Vectorial: Pinecone
- Librería Telegram: node-telegram-bot-api
- Sistema de Logs: Winston
- Testing: Jest

## Descripción General
El bot de MemoMate es el componente principal de interacción con el usuario, desplegado en un VPS dedicado. Su función es procesar los mensajes de los usuarios, extraer información relevante sobre contactos y eventos, y gestionar recordatorios de manera inteligente.

## Requerimientos Funcionales

### 1. Gestión de Mensajes
- **Procesamiento de Entrada**
  - Recepción y validación de mensajes de Telegram
  - Identificación del usuario y su contexto de conversación
  - Manejo de comandos específicos (/start, /help, etc.)
  - Gestión de diferentes tipos de mensajes (texto, imágenes, etc.)

- **Análisis de Contenido**
  - Integración con OpenAI para análisis de texto
  - Extracción de entidades (personas, lugares, fechas)
  - Identificación de intenciones del usuario
  - Detección de eventos y recordatorios

### 2. Gestión de Contactos
- **Registro de Contactos**
  - Creación automática de nuevos contactos mencionados
  - Actualización de información existente
  - Vinculación de eventos y conversaciones
  - Generación de embeddings para búsqueda semántica

- **Consultas y Búsquedas**
  - Búsqueda por nombre o relación
  - Búsqueda semántica mediante Pinecone
  - Recuperación de histórico de eventos
  - Resumen de información relevante

### 3. Sistema de Recordatorios
- **Creación de Recordatorios**
  - Programación basada en fechas específicas
  - Recordatorios recurrentes
  - Recordatorios contextuales
  - Priorización de notificaciones

- **Gestión de Notificaciones**
  - Sistema de cron para verificación periódica
  - Envío de notificaciones proactivas
  - Confirmación de recordatorios completados
  - Reprogramación de recordatorios

## Arquitectura y Componentes

### 1. Módulos Principales
- **TelegramModule**
  - Gestión de conexión con API de Telegram
  - Middleware de autenticación
  - Handlers de comandos
  - Gestión de sesiones de usuario

- **AIModule**
  - Integración con OpenAI
  - Procesamiento de lenguaje natural
  - Generación de embeddings
  - Análisis de sentimientos

- **ContactsModule**
  - Lógica de gestión de contactos
  - Búsqueda y recuperación
  - Actualización de información
  - Integración con Pinecone

- **RemindersModule**
  - Sistema de programación de recordatorios
  - Gestión de notificaciones
  - Lógica de recurrencia
  - Priorización de eventos

### 2. Servicios Core
- **MessageProcessor**
  ```typescript
  interface MessageContext {
    userId: number;
    messageId: number;
    text: string;
    timestamp: Date;
    sessionData?: any;
  }

  class MessageProcessor {
    async processMessage(context: MessageContext): Promise<void>;
    async extractEntities(text: string): Promise<Entity[]>;
    async determineIntent(text: string): Promise<Intent>;
    async generateResponse(intent: Intent, entities: Entity[]): Promise<string>;
  }
  ```

- **ContactManager**
  ```typescript
  interface Contact {
    id: string;
    name: string;
    relationship: string;
    events: Event[];
    embedding?: number[];
  }

  class ContactManager {
    async createContact(data: Partial<Contact>): Promise<Contact>;
    async updateContact(id: string, data: Partial<Contact>): Promise<Contact>;
    async searchContacts(query: string): Promise<Contact[]>;
    async getContactHistory(id: string): Promise<Event[]>;
  }
  ```

- **ReminderService**
  ```typescript
  interface Reminder {
    id: string;
    userId: number;
    contactId?: string;
    description: string;
    dueDate: Date;
    recurrence?: string;
    priority: number;
  }

  class ReminderService {
    async createReminder(data: Partial<Reminder>): Promise<Reminder>;
    async checkDueReminders(): Promise<Reminder[]>;
    async sendNotification(reminder: Reminder): Promise<void>;
    async markAsCompleted(id: string): Promise<void>;
  }
  ```

### 3. Sistema de Logs y Monitorización
- Registro detallado de interacciones
- Monitorización de rendimiento
- Alertas de errores
- Métricas de uso

### 4. Gestión de Estado
- Caché de sesiones activas
- Estado de conversaciones
- Contexto de usuario
- Datos temporales