import type { Client } from './user';

export interface QuoteItem {
  description: string;
  price: number;
}

// Nueva estructura: Una sección tiene un título y una lista de items
export interface QuoteSection {
  title: string; // Ej: "MATERIALES", "MANO DE OBRA"
  items: QuoteItem[];
}

export interface Quote {
  id: number;
  date: string;
  clients: Client[]; // AHORA ES UN ARRAY (Varios clientes)
  sections: QuoteSection[]; // AHORA SON SECCIONES
  total: number;
}