import { getContactsAction } from "../actions/get-contacts.action";
import ContactsProvider from "../contexts/ContactsContext";
import ContactList from "../components/ContactList";
import ContactFilters from "../components/ContactFilters";
import Error500 from "@/core/components/errors/error500";
import CreateContactButton from "../components/CreateContactButton";
import ImportContactsDialog from "../components/ImportContactsDialog";
import { getUserId } from "@/core/utils/get-user-id";

export default async function ContactsPage() {
  const userId = await getUserId();
  const [error, contacts] = await getContactsAction(userId);

  if (error) return <Error500 message={error.message} />;

  return (
    <ContactsProvider initialContacts={contacts}>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mis Contactos</h1>
          <div className="flex gap-2">
            <ImportContactsDialog />
            <CreateContactButton />
          </div>
        </div>
        <ContactFilters />
        <ContactList />
      </div>
    </ContactsProvider>
  );
}
