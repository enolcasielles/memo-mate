"use client";

import { Event } from "../types/event.type";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";

interface Props {
  events: Event[];
}

export default function EventList({ events }: Props) {
  if (!events.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay eventos registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-500 transition-all"
        >
          <p className="text-gray-900 font-medium mb-2">{event.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {event.eventDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-500" />
                {format(new Date(event.eventDate), "PPP", { locale: es })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 