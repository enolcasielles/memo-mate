import prisma from "@memomate/database";
import { DEFAULT_CREDITS } from "@memomate/core";
import { addMonths } from "date-fns";

export class CreditService {
  private static instance: CreditService;

  private constructor() {}

  static getInstance(): CreditService {
    if (!CreditService.instance) {
      CreditService.instance = new CreditService();
    }
    return CreditService.instance;
  }

  async renewCredits(): Promise<void> {
    try {
      // TODO: Hacer el proceso en batch. Como está ahora, si hay muchos usuarios, puede saturar la base de datos.
      const usersToRenew = await prisma.user.findMany({
        where: {
          stripeSubscriptionId: null,
          renewAt: {
            lt: new Date()
          }
        }
      });

      console.log(`Renovando créditos para ${usersToRenew.length} usuarios`);

      for (const user of usersToRenew) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            credits: DEFAULT_CREDITS,
            renewAt: addMonths(new Date(), 1)
          }
        });
      }

      console.log('Renovación de créditos completada');
    } catch (error) {
      console.error('Error al renovar créditos:', error);
    }
  }
} 