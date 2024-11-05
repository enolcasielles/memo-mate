# Next Base

Proyecto base para desarrollar aplicaciones web modernas con Next.js 14.

## Tecnologías

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + Shadcn/ui
- **Base de datos**: PostgreSQL + Prisma ORM
- **Desarrollo**: ESLint + Prettier
- **Infraestructura**: Docker Compose

## Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
├── core/                   # Código base reutilizable
│   ├── components/        # Componentes compartidos
│   ├── contexts/         # Contextos globales
│   ├── errors/           # Gestión de errores
│   ├── lib/             # Utilidades y configuraciones
│   └── responses/       # Tipos de respuestas
└── modules/              # Módulos de la aplicación
    └── example/         # Ejemplo de módulo
        ├── actions/     # Server Actions
        ├── components/  # Componentes del módulo
        ├── contexts/    # Contextos del módulo
        └── pages/       # Páginas del módulo
```

## Primeros Pasos

1. Clona el repositorio
2. Cambia el nombre del proyecto. Puedes buscar y reemplazar "next-base" por el nombre del proyecto.
3. Elige el puerto que quieras para el servidor de desarrollo. Por defecto es el 10001. Busca y reemplaza `10001` por el puerto que elijas.
3. Instala las dependencias:
```bash
npm install
```

4. Copia `.env.example` a `.env` y configura las variables
5. Inicia los servicios de infraestructura:
```bash
npm run infra
```

6. Inicia el servidor de desarrollo:
```bash
npm run dev
```

## Base de Datos

### Migraciones

Para crear un nuevo fichero de migración:

```bash
npx prisma migrate dev --name Name
```

Para generar el cliente de Prisma según el esquema:

```bash
npx prisma generate
```

## Arquitectura

### Módulos

Cada módulo es independiente y contiene:

- **actions/**: Server Actions para la lógica de negocio
- **components/**: Componentes React del módulo
- **contexts/**: Estado global del módulo
- **pages/**: Páginas del módulo

### Core

Código base reutilizable:

- **components/**: Componentes compartidos
- **contexts/**: Contextos globales
- **errors/**: Sistema de gestión de errores
- **lib/**: Utilidades y configuraciones
- **responses/**: Tipos de respuestas

## Scripts

- `npm run dev`: Servidor de desarrollo
- `npm run build`: Construye la aplicación
- `npm run start`: Inicia en producción
- `npm run lint`: Ejecuta el linter
- `npm run infra`: Levanta servicios Docker

## VSCode

El proyecto incluye configuración para VSCode:

- Debugging integrado para cliente y servidor
- Formateo automático al guardar
- Tasks para iniciar servicios