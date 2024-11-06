"use client";

import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useError } from "@/core/components/hooks/use-error";
import {
  Contact,
  ContactFilters,
  CreateContactDTO,
  UpdateContactDTO,
} from "../types/contact.type";
import { getContactsAction } from "../actions/get-contacts.action";
import { createContactAction } from "../actions/create-contact.action";
import { updateContactAction } from "../actions/update-contact.action";
import { deleteContactAction } from "../actions/delete-contact.action";
import { useUserContext } from "@/core/contexts/UserContext";
import { ICustomError } from "@memomate/core";

interface IContext {
  contacts: Contact[];
  filters: ContactFilters;
  isLoading: boolean;
  setFilters: (filters: ContactFilters) => void;
  refreshContacts: () => Promise<void>;
  createContact: (data: CreateContactDTO) => Promise<void>;
  updateContact: (data: UpdateContactDTO) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
}

const Context = createContext<IContext>(null);

export const useContacts = () => useContext(Context);

interface Props {
  initialContacts: Contact[];
}

export default function ContactsProvider({
  initialContacts,
  children,
}: PropsWithChildren<Props>) {
  const { showError } = useError();
  const { userId } = useUserContext();
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [filters, setFilters] = useState<ContactFilters>({});
  const [isLoading, setIsLoading] = useState(false);

  const refreshContacts = async () => {
    setIsLoading(true);
    const [error, result] = await getContactsAction(userId, filters);
    setIsLoading(false);
    if (error) showError(error as ICustomError);
    else setContacts(result);
  };

  const createContact = async (data: CreateContactDTO) => {
    const [error] = await createContactAction(userId, data);
    if (error) showError(error as ICustomError);
    else await refreshContacts();
  };

  const updateContact = async (data: UpdateContactDTO) => {
    const [error] = await updateContactAction(userId, data);
    if (error) showError(error as ICustomError);
    else await refreshContacts();
  };

  const deleteContact = async (contactId: string) => {
    const [error] = await deleteContactAction(userId, contactId);
    if (error) showError(error as ICustomError);
    else await refreshContacts();
  };

  useEffect(() => {
    refreshContacts();
  }, [filters]);

  const value: IContext = {
    contacts,
    filters,
    isLoading,
    setFilters,
    refreshContacts,
    createContact,
    updateContact,
    deleteContact,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
