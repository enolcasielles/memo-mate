# Proyecto: PRM Chatbot en Telegram

## Nombre del Proyecto
MemoMate

## Descripción General
Este proyecto tiene como objetivo desarrollar un producto tecnológico que ayude al usuario a mejorar sus relaciones personales mediante el uso de un chatbot en Telegram. Inspirado en los sistemas PRM (Personal Resource Manager), el bot permite al usuario gestionar información sobre sus contactos, recordar eventos importantes y establecer recordatorios para mejorar la comunicación y relación con personas clave en su vida.

## Funcionalidad Principal
El bot recibe y gestiona información personal que el usuario le cuenta, y puede responder preguntas o emitir recordatorios basados en estos datos. A través de una conversación en lenguaje natural, el bot procesará la información, identificará personas y eventos mencionados, y almacenará los datos de forma organizada.

## Ejemplo de Uso
- **Entrada del usuario:** "Ayer me encontré con mi primo Marcos, que va a empezar a trabajar en otra empresa."
- **Procesamiento del bot:** El bot identifica que se trata de un evento relacionado con "Marcos" y que el hecho importante es su cambio de empleo. Si faltara información, como la relación del usuario con Marcos o la empresa, el bot podría hacer preguntas de aclaración.
- **Recuperación de información:** Días después, el usuario podría preguntar: "Recuérdame las últimas novedades sobre mi primo Marcos."
- **Respuesta del bot:** El bot recuperará los eventos más recientes asociados a Marcos y responderá: "La última novedad es que Marcos va a empezar a trabajar en otra empresa."

## Componentes del Proyecto

### Base de Datos en PostgreSQL
Almacenará los contactos, eventos y recordatorios. La estructura básica podría incluir:
- **Contacts:** Almacena información básica de cada persona, evitando datos sensibles como correos o números de teléfono.
- **Events:** Registra los eventos asociados a cada contacto, incluyendo fecha y descripción.
- **Reminders:** Gestiona los recordatorios y los eventos programados que el bot deberá notificar.

### Asistente de OpenAI para el Procesamiento de Lenguaje Natural
El asistente se encargará de comprender los mensajes del usuario, identificar los contactos y eventos, y actuar en consecuencia.
Tendrá instrucciones claras y definidas para manejar la conversación y contará con funciones como:
- `create_contact`: Crea un nuevo contacto si no existe.
- `store_event`: Almacena un evento relacionado con un contacto específico.
- `get_latest_events`: Recupera los eventos más recientes asociados a un contacto.
- `create_reminder`: Establece un recordatorio asociado a un contacto o evento.

### Telegram Bot
- La interfaz del usuario será un bot de Telegram que facilite el acceso y la interacción directa con el asistente y la base de datos.
- El bot será capaz de recibir mensajes, enviar respuestas y emitir recordatorios en momentos específicos.

## Ejemplos de Mensajes
A continuación, se presentan ejemplos de mensajes que el usuario podría enviar al bot para diferentes tipos de interacciones:

1. "Hoy quedé con mi amiga Laura y me contó que va a mudarse a Barcelona."
2. "Recuérdame que pregunte a mi hermano sobre su nuevo trabajo la próxima vez que hablemos."
3. "Mi jefe, Carlos, me dijo que está pensando en darme un ascenso."
4. "Acuérdate de que el cumpleaños de Ana es el próximo 15 de marzo."
5. "Recuérdame que le mande un mensaje de ánimo a Sofía en su primera maratón."
6. "Mi prima Lucía acaba de tener un bebé, es una niña."
7. "La semana pasada hablé con José y me comentó que se va de vacaciones a Japón."
8. "Por favor, guarda que María y yo tenemos un café pendiente."
9. "Quiero acordarme de preguntar a Alberto cómo le fue en su examen de inglés."
10. "Anota que voy a ver a mis padres este fin de semana."
11. "Recuérdame las últimas cosas que hemos hablado sobre mi amiga Marta."
12. "Mi hermana me contó que adoptó un cachorro, es un labrador."
13. "Mañana tengo una reunión con Luis. Anota que quiero hablarle sobre el proyecto nuevo."
14. "Guarda que Juan y yo queremos hacer un viaje juntos este verano."
15. "Tengo que recordar que mi primo Andrés está buscando casa nueva."
16. "Me gustaría que me recordaras que Karla consiguió un nuevo cliente en su empresa."
17. "Dame un resumen de las novedades de los últimos meses de Carlos."
18. "Acuérdate de que tengo que llamar a Silvia para felicitarla por su ascenso."
19. "Ayer hablé con Pablo y está pensando en mudarse al extranjero."
20. "Recordatorio: Preguntarle a Marta si sigue interesada en la oferta de trabajo."