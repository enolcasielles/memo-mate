import { buildCustomError, CustomError } from "@memomate/core";
import { ActionResponse } from "@memomate/core";
import prisma from "@memomate/database";

export interface DashboardStats {
  totalContacts: number;
  totalReminders: number;
  activeReminders: number;
  credits: number;
  hasActiveSubscription: boolean;
  renewAt: Date | null;
  messageCount: number;
}

export async function getDashboardStats(userId: string): Promise<ActionResponse<DashboardStats>> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            contacts: true,
            reminders: true,
            messageLogs: true,
          },
        },
        reminders: {
          where: {
            completed: false,
          },
        },
      },
    });

    if (!user) {
      return [{ message: "Usuario no encontrado" }, null];
    }

    const stats: DashboardStats = {
      totalContacts: user._count.contacts,
      totalReminders: user._count.reminders,
      activeReminders: user.reminders.length,
      credits: user.credits,
      hasActiveSubscription: !!user.stripeSubscriptionId,
      renewAt: user.renewAt,
      messageCount: user._count.messageLogs,
    };

    return [null, stats];
  } catch (error) {
    if (error instanceof CustomError) return [buildCustomError(error), null];
    return [
      {
        message: "Se ha producido un error al obtener los datos del dashboard",
      },
      null,
    ];
  }
} 