# MemoMate - Tu Asistente Personal para Relaciones

MemoMate es un sistema de gestión de relaciones personales (PRM) que te ayuda a mantener y mejorar tus relaciones personales mediante un bot inteligente de Telegram y una interfaz web de gestión.

## 🌟 Características

- **Bot Inteligente de Telegram**
  - Procesa conversaciones en lenguaje natural
  - Extrae y almacena información relevante sobre tus contactos
  - Gestiona recordatorios y eventos importantes
  - Responde consultas sobre tus contactos y eventos pasados

- **Interfaz Web de Gestión**
  - Visualiza y gestiona tus contactos
  - Importa contactos mediante CSV
  - Gestiona tu suscripción premium
  - Accede al historial de eventos y recordatorios

- **Sistema de Suscripción**
  - Plan gratuito con funcionalidades básicas
  - Plan premium con características avanzadas
  - Integración con Stripe para pagos

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, TailwindCSS, Shadcn UI
- **Backend**: NestJS, Node.js
- **Base de Datos**: PostgreSQL, Prisma ORM
- **IA**: OpenAI API, Pinecone
- **Otros**: Telegram Bot API, Stripe

## 📦 Estructura del Proyecto

```
├── apps/
│   ├── web/          # Aplicación web Next.js
│   ├── bot/          # Bot de Telegram en NestJS
│   └── infra/        # Configuración de infraestructura
├── packages/
│   ├── core/         # Utilidades compartidas
│   ├── database/     # Modelos y migraciones de Prisma
│   └── openai/       # Integraciones con OpenAI
└── docs/             # Documentación del proyecto
```

## 🚀 Inicio Rápido

1. **Requisitos Previos**
   ```bash
   # Instalar pnpm
   npm install -g pnpm
   ```

2. **Instalación**
   ```bash
   # Clonar el repositorio
   git clone https://github.com/tu-usuario/memomate.git
   cd memomate

   # Instalar dependencias
   pnpm install
   ```

3. **Configuración**
   ```bash
   # Copiar archivos de ejemplo
   cp apps/web/.env.example apps/web/.env
   cp apps/bot/.env.example apps/bot/.env

   # Configurar variables de entorno
   # Editar los archivos .env con tus credenciales
   ```

4. **Desarrollo**
   ```bash
   # Iniciar base de datos
   cd apps/infra
   docker-compose up -d

   # Iniciar aplicación web
   pnpm dev --filter web

   # Iniciar bot de Telegram
   pnpm dev --filter bot
   ```

## 📝 Documentación

Para más información sobre la arquitectura y funcionamiento del proyecto, consulta los siguientes documentos:

- [Arquitectura del Proyecto](docs/arquitecture.md)
- [Documentación del Bot](docs/bot.md)
- [Documentación de la Web](docs/web.md)
- [Modelo de Base de Datos](docs/database.md)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, lee nuestras guías de contribución antes de enviar un pull request.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
