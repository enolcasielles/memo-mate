export interface Event {
  id: string;
  contactId: string;
  description: string;
  eventDate: Date | null;
  createdAt: Date;
}

export interface CreateEventDTO {
  description: string;
  eventDate?: Date | null;
}

export interface UpdateEventDTO extends Partial<CreateEventDTO> {
  id: string;
} 