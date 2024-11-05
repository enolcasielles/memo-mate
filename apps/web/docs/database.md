# Diseño de la Base de Datos para PRM Chatbot en Telegram

## Descripción General

La base de datos ha sido diseñada para almacenar y gestionar información sobre los usuarios, sus contactos, eventos importantes y recordatorios, optimizando la búsqueda y la administración de datos mediante PostgreSQL y pgvector para búsquedas semánticas.

## Modelos de la Base de Datos

### 1. Modelo User

El modelo User almacena la información básica de los usuarios del sistema. Cada usuario se identifica por su `telegram_user_id` y contiene información relevante para la interacción con el bot, el estado de su suscripción y la configuración de su asistente en OpenAI.

**Campos:**
- `id`: Identificador único del usuario (UUID)
- `telegram_user_id`: ID único del usuario en Telegram, utilizado para la identificación en el sistema
- `has_completed_setup`: Indica si el usuario ha completado la configuración inicial (booleano)
- `stripe_subscription_id`: ID de la suscripción en Stripe (NULL si el usuario es básico)
- `openai_assistant_id`: ID del asistente de OpenAI asociado al usuario
- `created_at`: Marca de tiempo de la creación del usuario

```sql
CREATE TABLE User (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    telegram_user_id BIGINT UNIQUE NOT NULL,
    has_completed_setup BOOLEAN DEFAULT FALSE,
    stripe_subscription_id VARCHAR(255),
    openai_assistant_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Modelo Contact

El modelo Contact almacena información sobre los contactos personales de cada usuario, permitiendo al bot acceder a datos clave sobre las personas relevantes en la vida del usuario.

**Campos:**
- `id`: Identificador único del contacto (UUID)
- `user_id`: Identificador del usuario propietario del contacto (FK referenciando a User)
- `name`: Nombre del contacto
- `relation`: Relación con el usuario (amigo, primo, jefe, etc.)
- `location`: Ubicación del contacto (opcional, como ciudad, pueblo o país)
- `embedding`: Vector de búsqueda semántica generado por pgvector
- `created_at`: Marca de tiempo de la creación del contacto

```sql
CREATE TABLE Contact (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES User(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    relation VARCHAR(100),
    location VARCHAR(150),
    embedding VECTOR(1536),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Modelo Event

El modelo Event registra eventos importantes asociados a cada contacto. Esto permite al bot acceder a eventos específicos de un contacto en caso de que el usuario los solicite.

**Campos:**
- `id`: Identificador único del evento (UUID)
- `contact_id`: Identificador del contacto relacionado con el evento (FK referenciando a Contact)
- `description`: Descripción del evento
- `event_date`: Fecha en la que ocurrió el evento (opcional)
- `created_at`: Marca de tiempo de la creación del evento

```sql
CREATE TABLE Event (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES Contact(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    event_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Modelo Reminder

El modelo Reminder define recordatorios configurados por el usuario, ya sea de forma general o asociados a un contacto específico. Esto permite al bot enviar notificaciones en momentos programados.

**Campos:**
- `id`: Identificador único del recordatorio (UUID)
- `user_id`: Identificador del usuario que creó el recordatorio (FK referenciando a User)
- `contact_id`: Identificador del contacto relacionado con el recordatorio (opcional, FK referenciando a Contact)
- `message`: Mensaje del recordatorio
- `remind_at`: Fecha y hora en la que se enviará el recordatorio
- `created_at`: Marca de tiempo de la creación del recordatorio
- `completed`: Indica si el recordatorio ha sido cumplido

```sql
CREATE TABLE Reminder (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES User(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES Contact(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    remind_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    completed BOOLEAN DEFAULT FALSE
);
```

### 5. Modelo MessageLog (Opcional)

El modelo MessageLog permite mantener un historial de mensajes entre el usuario y el bot. Esto es útil para análisis de conversación o para mantener contexto en sesiones de mensajes.

**Campos:**
- `id`: Identificador único del mensaje (UUID)
- `user_id`: Identificador del usuario que envió o recibió el mensaje (FK referenciando a User)
- `contact_id`: Identificador del contacto relevante para el mensaje (opcional, FK referenciando a Contact)
- `message`: Contenido del mensaje
- `direction`: Indica si el mensaje fue enviado (sent) o recibido (received)
- `created_at`: Marca de tiempo de la creación del mensaje

```sql
CREATE TABLE MessageLog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES User(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES Contact(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    direction VARCHAR(10) CHECK (direction IN ('sent', 'received')),
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Resumen de las Relaciones entre Modelos

* **User ➔ Contact**: Un usuario puede tener múltiples contactos, cada uno con un ID único
* **Contact ➔ Event**: Cada contacto puede tener múltiples eventos registrados
* **User ➔ Reminder**: Cada usuario puede establecer múltiples recordatorios, algunos de ellos asociados a contactos específicos
* **User ➔ MessageLog**: Un historial de mensajes ayuda a registrar las interacciones del bot con el usuario

## Conclusión

Esta estructura de base de datos proporciona un sistema eficiente para gestionar los datos del bot de Telegram en un PRM, permitiendo búsquedas rápidas y precisas gracias a pgvector. Los modelos y relaciones están optimizados para almacenar y recuperar información relacionada con usuarios, contactos y eventos de manera organizada y segura.