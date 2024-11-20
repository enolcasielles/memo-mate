import { PrismaContact } from "@memomate/database";
import { Contact } from "../types/contact.type";

export const mapContactEntityToContact = (
  prismaContact: PrismaContact,
): Contact => {
  return {
    id: prismaContact.id,
    userId: prismaContact.userId,
    name: prismaContact.name,
    relation: prismaContact.relation || undefined,
    location: prismaContact.location || undefined,
    createdAt: prismaContact.createdAt,
  };
};
