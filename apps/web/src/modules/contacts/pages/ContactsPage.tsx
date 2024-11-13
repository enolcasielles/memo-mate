import { getContactsAction } from "../actions/get-contacts.action";
import ContactsProvider from "../contexts/ContactsContext";
import ContactList from "../components/ContactList";
import ContactFilters from "../components/ContactFilters";
import Error500 from "@/core/components/errors/error500";
import CreateContactButton from "../components/CreateContactButton";
import ImportContactsDialog from "../components/ImportContactsDialog";
import { getUserId } from "@/core/utils/get-user-id";
import { Users, Search } from "lucide-react";
import { Input } from "@/core/components/base/input";

export default async function ContactsPage() {
  const userId = await getUserId();
  const [error, contacts] = await getContactsAction(userId);

  if (error) return <Error500 message={error.message} />;

  return (
    <ContactsProvider initialContacts={contacts}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full mb-4">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <h1 className="text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
                Mis Contactos
              </h1>
              <p className="text-gray-600">
                Gestiona tus relaciones personales de manera eficiente
              </p>
            </div>
            <div className="flex gap-3">
              <ImportContactsDialog />
              <CreateContactButton />
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="mt-8">
          <div className="flex flex-col md:flex-row gap-4">
            <ContactFilters />
          </div>
        </div>

        {/* Contact List Section */}
        <div className="mt-8">
          <ContactList />
        </div>

        {/* Optional: Empty State */}
        {contacts.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No tienes contactos aún</h3>
            <p className="text-gray-600 mb-6">
              Comienza añadiendo tus primeros contactos para gestionar tus relaciones
            </p>
            <CreateContactButton />
          </div>
        )}
      </div>
    </ContactsProvider>
  );
}
