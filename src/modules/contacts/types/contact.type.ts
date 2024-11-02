export interface Contact {
  id: string;
  userId: string;
  name: string;
  relation?: string;
  location?: string;
  createdAt: Date;
}

export interface CreateContactDTO {
  name: string;
  relationship?: string;
  location?: string;
}

export interface UpdateContactDTO extends Partial<CreateContactDTO> {
  id: string;
}

export interface ContactFilters {
  search?: string;
  location?: string;
  relationship?: string;
}
