import { getUserId } from "@/core/utils/get-user-id";
import { getContactsAction } from "../actions/get-contacts.action";
import { getContactEventsAction } from "../actions/get-contact-events.action";
import EventList from "../components/EventList";
import CreateEventForm from "../components/CreateEventForm";
import Error from "@/core/components/errors/error";
import { Calendar, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: {
    contactId: string;
  };
}

export default async function ContactEventsPage({ params }: Props) {
  const userId = await getUserId();
  const [contactError, contacts] = await getContactsAction(userId);
  const [eventsError, events] = await getContactEventsAction(userId, params.contactId);

  if (contactError) return <Error message={contactError.message} />;
  if (eventsError) return <Error message={eventsError.message} />;

  const contact = contacts.find((c) => c.id === params.contactId);
  if (!contact) return <Error message="Contacto no encontrado" />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <Link 
          href="/dashboard/contacts" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-500 mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver a contactos
        </Link>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-xl font-semibold text-blue-500">
              {contact.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{contact.name}</h1>
            <p className="text-gray-600">Eventos y momentos importantes</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Event Form */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Nuevo Evento
            </h2>
            <CreateEventForm contactId={params.contactId} />
          </div>
        </div>

        {/* Event List */}
        <div className="md:col-span-2">
          <EventList events={events} />
        </div>
      </div>
    </div>
  );
} 