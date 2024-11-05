# Documento Técnico: Web de Gestión de Cuenta de MemoMate

## Tecnologías
- Framework: Next.js 14 (App Router)
- Estilos: TailwindCSS + Shadcn UI
- Formularios: react-hook-form
- Procesador de Pago: Stripe (para gestión de suscripciones)
- Base de Datos: PostgreSQL y Prisma como ORM

## Descripción General
La web de MemoMate permite a los usuarios gestionar su cuenta, centrándose en dos funcionalidades principales:

1. Gestión de Suscripciones: Los usuarios podrán activar, ver y gestionar su suscripción premium.
2. Gestión de Contactos: Los usuarios pueden ver y editar los contactos registrados en el sistema, así como agregar nuevos contactos manualmente o mediante la importación de archivos CSV.

## Requerimientos Funcionales
1. Gestión de Suscripciones
  - Integración con Stripe:
    - Configurar Stripe para manejar suscripciones, lo que incluye la activación, renovación y cancelación de suscripciones premium.
    - Mostrar el estado de la suscripción en la interfaz (activa, caducada, no suscrita).

  - Pantalla de Estado de la Suscripción:
    - Si el usuario tiene una suscripción activa, mostrar los detalles de la suscripción (plan, fecha de renovación).
    - Si no tiene una suscripción activa, proporcionar un botón para que inicie el proceso de suscripción a través de Stripe.

  - Implementar un componente que gestione los posibles estados:
    - Sin suscripción: Botón para suscribirse.
    - Suscripción activa: Botón para ver detalles o gestionar la suscripción en Stripe.
    - Expirada: Mostrar notificación para renovar la suscripción.
    
  - Webhook para Eventos de Stripe:
    - Implementar un webhook para escuchar eventos de Stripe relacionados con la suscripción (como activación, expiración y cancelación) y  actualizar el estado del usuario en la base de datos en tiempo real.

2. Gestión de Contactos
  - Pantalla de Listado de Contactos:
    - Mostrar una lista de todos los contactos asociados al usuario.
    - Proveer filtros de búsqueda para que el usuario encuentre fácilmente un contacto específico por nombre o ubicación.
    - Cada contacto debe mostrar información básica, como el nombre, la relación y la ubicación.
  - Detalle y Edición de Contacto:
    - Al hacer clic en un contacto, abrir una página de detalles que incluya:
      - Información del contacto: nombre, relación, ubicación, eventos asociados.
      - Lista de eventos y recordatorios asociados al contacto.
      - Botón para editar la información del contacto o agregar nuevos eventos o recordatorios.
    - En el modo de edición, permitir que el usuario actualice la información del contacto y guarde los cambios en Supabase.
  - Agregar Contacto:
    - Proveer un formulario para agregar nuevos contactos manualmente.
    - El formulario debe incluir campos para el nombre, relación, y ubicación opcional del contacto.
  - Importación de Contactos desde CSV:
    - Implementar un sistema de importación de archivos CSV para cargar múltiples contactos a la vez.
    - Validar el formato del archivo y el contenido de los campos antes de procesar la importación.
    - Mostrar un resumen de los contactos importados con un mensaje de confirmación o error si el formato del archivo es incorrecto.

## Arquitectura y Componentes
1. Rutas y Páginas Principales
  - `/dashboard`: Página principal de gestión de cuenta, mostrando opciones para la suscripción y la gestión de contactos.
  - `/dashboard/subscription`: Pantalla de estado de suscripción, donde los usuarios pueden ver y gestionar su suscripción.
  - `/dashboard/contacts`: Listado de contactos del usuario, con búsqueda y opciones de filtrado.
  - `/dashboard/contacts/[id]`: Página de detalles de un contacto, que permite ver y editar la información del contacto.
  - `/dashboard/contacts/import`: Página para importar contactos mediante archivo CSV.

2. Componentes UI Clave
  - `SubscriptionStatus`: Componente que muestra el estado de la suscripción del usuario, con un botón para gestionar la suscripción en Stripe.
  - `ContactList`: Lista de contactos con opciones de búsqueda y filtrado.
  - `ContactDetail`: Página de detalle de contacto, que muestra la información básica del contacto y los eventos asociados.
  - `ContactForm`: Formulario para agregar o editar un contacto.
  - `CSVUploader`: Componente que permite cargar y validar archivos CSV antes de la importación.

3. Integración de Stripe
  - `Stripe Checkout`: Configuración de Stripe para iniciar el proceso de suscripción desde la web. Los usuarios serán redirigidos a Stripe para completar el pago.
  - `Webhook`: Un webhook que recibe notificaciones de eventos de Stripe y actualiza el estado de la suscripción en la base de datos.

4. Estilos e Interfaz
  - `TailwindCSS`: Proporciona la estructura base de los estilos en toda la aplicación.
  - `Shadcn UI`: Para componentes UI más complejos y personalizables, que mantienen una apariencia consistente y estilizada en todas las páginas.
  - `Tema Responsivo`: La interfaz debe ser responsiva y ofrecer una experiencia de usuario óptima tanto en dispositivos móviles como en escritorio.
  - `react-hook-form`: Para el manejo de formularios.

7. Diagramas de Flujo
  - `Flujo de Suscripción`
    - El usuario accede a la página de suscripción y selecciona “Activar suscripción”.
    - Es redirigido a Stripe para completar el pago.
    - Al completar el pago, el webhook de Stripe actualiza el estado de la suscripción en base de datos.
    - La interfaz se actualiza para reflejar el estado de la suscripción como activa.

  - `Flujo de Gestión de Contactos`
    - El usuario accede al listado de contactos, donde puede buscar o filtrar contactos.
    - Selecciona un contacto para ver los detalles, o usa el botón “Agregar Contacto” para añadir uno nuevo.
    - Al editar o añadir un contacto, los cambios se guardan en Supabase.
    - Al importar un archivo CSV, los contactos se validan y se guardan en batch en base de datos.