import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Crear usuario de prueba
  const user = await prisma.user.create({
    data: {
      telegramUserId: 123456789,
      hasCompletedSetup: true,
      openaiThreadId: "thread_test123",
      stripeSubscriptionId: null,
    },
  });

  // Crear algunos contactos
  const contacts = await Promise.all([
    // Familia
    prisma.contact.create({
      data: {
        userId: user.id,
        name: "Marcos",
        relation: "Primo",
        location: "Madrid",
        events: {
          create: [
            {
              description: "Va a empezar a trabajar en otra empresa",
              eventDate: new Date("2024-01-15"),
            },
          ],
        },
      },
    }),
    prisma.contact.create({
      data: {
        userId: user.id,
        name: "Lucía",
        relation: "Prima",
        location: "Barcelona",
        events: {
          create: [
            {
              description: "Tuvo una bebé",
              eventDate: new Date("2024-01-10"),
            },
          ],
        },
      },
    }),

    // Amigos
    prisma.contact.create({
      data: {
        userId: user.id,
        name: "Laura",
        relation: "Amiga",
        location: "Barcelona",
        events: {
          create: [
            {
              description: "Se muda a Barcelona",
              eventDate: new Date("2024-02-01"),
            },
          ],
        },
      },
    }),
    prisma.contact.create({
      data: {
        userId: user.id,
        name: "Sofía",
        relation: "Amiga",
        events: {
          create: [
            {
              description: "Participará en su primera maratón",
              eventDate: new Date("2024-03-20"),
            },
          ],
        },
      },
    }),

    // Trabajo
    prisma.contact.create({
      data: {
        userId: user.id,
        name: "Carlos",
        relation: "Jefe",
        events: {
          create: [
            {
              description: "Mencionó posible ascenso",
              eventDate: new Date("2024-01-20"),
            },
          ],
        },
      },
    }),
  ]);

  // Crear algunos recordatorios
  await Promise.all([
    prisma.reminder.create({
      data: {
        userId: user.id,
        contactId: contacts[3].id, // Sofía
        message: "Enviar mensaje de ánimo para la maratón",
        remindAt: new Date("2024-03-19"), // Un día antes de la maratón
        completed: false,
      },
    }),
    prisma.reminder.create({
      data: {
        userId: user.id,
        contactId: contacts[2].id, // Laura
        message: "Preguntar cómo va la mudanza a Barcelona",
        remindAt: new Date("2024-02-15"),
        completed: false,
      },
    }),
    prisma.reminder.create({
      data: {
        userId: user.id,
        message: "Llamar a mamá",
        remindAt: new Date("2024-02-01"),
        completed: false,
      },
    }),
  ]);

  // Crear algunos logs de mensajes
  await Promise.all([
    prisma.messageLog.create({
      data: {
        userId: user.id,
        contactId: contacts[0].id, // Marcos
        message:
          "Ayer me encontré con mi primo Marcos, que va a empezar a trabajar en otra empresa.",
        direction: "sent",
      },
    }),
    prisma.messageLog.create({
      data: {
        userId: user.id,
        contactId: contacts[2].id, // Laura
        message:
          "Hoy quedé con mi amiga Laura y me contó que va a mudarse a Barcelona.",
        direction: "sent",
      },
    }),
    prisma.messageLog.create({
      data: {
        userId: user.id,
        contactId: contacts[4].id, // Carlos
        message:
          "Mi jefe, Carlos, me dijo que está pensando en darme un ascenso.",
        direction: "sent",
      },
    }),
  ]);

  console.log("Seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
