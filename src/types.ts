export interface UserProfile {
  email: string;
  name: string;
  avatar: string;
  isAuthorized: boolean;
  familyMember?: string;
}

export interface Expense {
  id: string;
  fecha: string;
  concepto: string;
  categoria: string;
  importe: number;
  pagadoPor: string;
  observaciones?: string;
  comprobanteUrl?: string;
  year: number;
}

export interface Income {
  id: string;
  fecha: string;
  concepto: string;
  importe: number;
  recibidoPor: string;
  year: number;
}

export interface InventoryItem {
  id: string;
  categoria: string;
  articulo: string;
  marca_modelo: string;
  cantidad: number;
  unidad: string;
  estado: string;
  ubicacion: string;
  responsible: string;
  foto_url?: string;
  fecha_revision: string;
  observaciones?: string;
}

export interface TaskItem {
  id: string;
  titulo: string;
  descripcion?: string;
  asignadoA: string;
  estado: 'Pendiente' | 'En Proceso' | 'Completada';
  fechaLimite: string;
  year: number;
}

export interface DocumentItem {
  id: string;
  titulo: string;
  categoria: string;
  url: string;
  fecha: string;
  year: number;
}

export interface Transferencia {
  id: string;
  fecha: string;
  de: string;
  a: string;
  importe: number;
  concepto: string;
  justificanteUrl?: string;
  year: number;
}

export interface FamilyConfig {
  familias: string[];
  porcentajes: Record<string, number>;
  presupuestoAnual?: number;
}
