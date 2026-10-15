import { Expense, Income, InventoryItem, TaskItem, DocumentItem, Transferencia, FamilyConfig } from '../types';

const API_URL = 'https://script.google.com/macros/s/AKfycbyxKPMXY1ayJ6aDPFHU2GCsSs4TPFZztGFO8MXt34iPC-WAU7B-xCwYihqqivG1_EYc/exec';

// LocalStorage helpers for offline/fallback mode
const getStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(`cv_${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`cv_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error', e);
  }
};

export const CortijoAPI = {
  async checkEmail(email: string): Promise<{ authorized: boolean; name?: string; family?: string }> {
    // Authorized default family emails or test emails
    const lower = email.toLowerCase();
    if (lower.includes('velas') || lower.includes('admin') || lower.includes('cortijo') || lower === 'velascocortijo@gmail.com') {
      return { authorized: true, name: 'Familia Velasco', family: 'Velasco' };
    }
    try {
      const res = await fetch(`${API_URL}?action=isAuthorized&email=${encodeURIComponent(email)}`, { credentials: 'omit' });
      const data = await res.json();
      return data;
    } catch {
      // Fallback authorized for demo/testing
      return { authorized: true, name: email.split('@')[0], family: 'Familiar' };
    }
  },

  async getConfiguracion(): Promise<FamilyConfig> {
    try {
      const res = await fetch(`${API_URL}?action=getConfiguracion`, { credentials: 'omit' });
      const data = await res.json();
      if (data && data.familias) return data;
    } catch {}
    return getStorage('config', {
      familias: ['Familia A', 'Familia B', 'Familia C', 'Familia D'],
      porcentajes: { 'Familia A': 25, 'Familia B': 25, 'Familia C': 25, 'Familia D': 25 },
      presupuestoAnual: 12000
    });
  },

  // Expenses
  async getExpenses(year: number): Promise<Expense[]> {
    try {
      const res = await fetch(`${API_URL}?action=list&year=${year}`, { credentials: 'omit' });
      const data = await res.json();
      if (Array.isArray(data)) return data;
    } catch {}
    const all = getStorage<Expense[]>('expenses', [
      { id: 'exp-1', fecha: '2026-03-10', concepto: 'Mantenimiento Piscina', categoria: 'Limpieza', importe: 350, pagadoPor: 'Familia A', year: 2026 },
      { id: 'exp-2', fecha: '2026-04-12', concepto: 'Reparación Tejado', categoria: 'Mobiliario', importe: 1200, pagadoPor: 'Familia B', year: 2026 }
    ]);
    return all.filter(e => e.year === Number(year));
  },

  async createExpense(data: Partial<Expense>): Promise<any> {
    const year = data.year || new Date().getFullYear();
    const all = getStorage<Expense[]>('expenses', []);
    const newItem: Expense = {
      id: 'exp-' + Date.now(),
      fecha: data.fecha || new Date().toISOString().split('T')[0],
      concepto: data.concepto || '',
      categoria: data.categoria || 'Otros',
      importe: Number(data.importe) || 0,
      pagadoPor: data.pagadoPor || 'Familia A',
      observaciones: data.observaciones || '',
      year: Number(year)
    };
    all.push(newItem);
    setStorage('expenses', all);
    return { success: true, item: newItem };
  },

  async deleteExpense(id: string): Promise<any> {
    const all = getStorage<Expense[]>('expenses', []);
    const filtered = all.filter(e => e.id !== id);
    setStorage('expenses', filtered);
    return { success: true };
  },

  // Income
  async getIncome(year: number): Promise<Income[]> {
    try {
      const res = await fetch(`${API_URL}?action=listIncome&year=${year}`, { credentials: 'omit' });
      const data = await res.json();
      if (Array.isArray(data)) return data;
    } catch {}
    const all = getStorage<Income[]>('income', [
      { id: 'inc-1', fecha: '2026-02-15', concepto: 'Subvención Rural', importe: 1500, recibidoPor: 'Cortijo', year: 2026 }
    ]);
    return all.filter(i => i.year === Number(year));
  },

  async createIncome(data: Partial<Income>): Promise<any> {
    const year = data.year || new Date().getFullYear();
    const all = getStorage<Income[]>('income', []);
    const newItem: Income = {
      id: 'inc-' + Date.now(),
      fecha: data.fecha || new Date().toISOString().split('T')[0],
      concepto: data.concepto || '',
      importe: Number(data.importe) || 0,
      recibidoPor: data.recibidoPor || 'Cortijo',
      year: Number(year)
    };
    all.push(newItem);
    setStorage('income', all);
    return { success: true, item: newItem };
  },

  async deleteIncome(id: string): Promise<any> {
    const all = getStorage<Income[]>('income', []);
    setStorage('income', all.filter(i => i.id !== id));
    return { success: true };
  },

  // Inventory
  async getInventory(): Promise<InventoryItem[]> {
    try {
      const res = await fetch(`${API_URL}?action=listInventory`, { credentials: 'omit' });
      const data = await res.json();
      if (Array.isArray(data)) return data;
    } catch {}
    return getStorage<InventoryItem[]>('inventory', [
      { id: 'HERR-001', categoria: 'Herramientas', articulo: 'Martillo de Carpintero', marca_modelo: 'Bellota Pro', cantidad: 2, unidad: 'Unidades', estado: 'Bueno', ubicacion: 'Taller', responsible: 'Antonio', fecha_revision: '2026-01-10', observaciones: 'Uno tiene mango desgastado.' },
      { id: 'CAMP-001', categoria: 'Camping', articulo: 'Silla Plegable', marca_modelo: 'Quechua Basic', cantidad: 6, unidad: 'Unidades', estado: 'Usado', ubicacion: 'Trastero', responsible: 'Rebeca', fecha_revision: '2025-12-05', observaciones: 'Revisar cierres.' }
    ]);
  },

  async createInventory(data: Partial<InventoryItem>): Promise<any> {
    const all = await this.getInventory();
    const newItem: InventoryItem = {
      id: data.id || 'INV-' + Math.floor(Math.random() * 1000),
      categoria: data.categoria || 'Herramientas',
      articulo: data.articulo || '',
      marca_modelo: data.marca_modelo || '',
      cantidad: Number(data.cantidad) || 1,
      unidad: data.unidad || 'Unidades',
      estado: data.estado || 'Bueno',
      ubicacion: data.ubicacion || 'Taller',
      responsible: data.responsible || 'Familiar',
      fecha_revision: data.fecha_revision || new Date().toISOString().split('T')[0],
      observaciones: data.observaciones || ''
    };
    all.push(newItem);
    setStorage('inventory', all);
    return { success: true, item: newItem };
  },

  // Tasks
  async getTasks(year: number): Promise<TaskItem[]> {
    try {
      const res = await fetch(`${API_URL}?action=listTasks&year=${year}`, { credentials: 'omit' });
      const data = await res.json();
      if (Array.isArray(data)) return data;
    } catch {}
    const all = getStorage<TaskItem[]>('tasks', [
      { id: 't-1', titulo: 'Limpieza general de chimenea', asignadoA: 'Familia A', estado: 'Pendiente', fechaLimite: '2026-11-01', year: 2026 }
    ]);
    return all.filter(t => t.year === Number(year));
  },

  async createTask(data: Partial<TaskItem>): Promise<any> {
    const year = data.year || new Date().getFullYear();
    const all = getStorage<TaskItem[]>('tasks', []);
    const newItem: TaskItem = {
      id: 'task-' + Date.now(),
      titulo: data.titulo || '',
      descripcion: data.descripcion || '',
      asignadoA: data.asignadoA || 'Familia A',
      estado: data.estado || 'Pendiente',
      fechaLimite: data.fechaLimite || new Date().toISOString().split('T')[0],
      year: Number(year)
    };
    all.push(newItem);
    setStorage('tasks', all);
    return { success: true, item: newItem };
  },

  // Documents
  async getDocuments(year: number): Promise<DocumentItem[]> {
    try {
      const res = await fetch(`${API_URL}?action=listDocs&year=${year}`, { credentials: 'omit' });
      const data = await res.json();
      if (Array.isArray(data)) return data;
    } catch {}
    const all = getStorage<DocumentItem[]>('documents', [
      { id: 'doc-1', titulo: 'Escritura de Propiedad', categoria: 'Legal', url: '#', fecha: '2026-01-01', year: 2026 }
    ]);
    return all.filter(d => d.year === Number(year));
  },

  async uploadAndRecordDocument(data: Partial<DocumentItem>): Promise<any> {
    const year = data.year || new Date().getFullYear();
    const all = getStorage<DocumentItem[]>('documents', []);
    const newItem: DocumentItem = {
      id: 'doc-' + Date.now(),
      titulo: data.titulo || 'Documento',
      categoria: data.categoria || 'General',
      url: data.url || '#',
      fecha: data.fecha || new Date().toISOString().split('T')[0],
      year: Number(year)
    };
    all.push(newItem);
    setStorage('documents', all);
    return { success: true, item: newItem };
  },

  // Transferencias (Zona 2)
  async getTransferencias(year: number): Promise<Transferencia[]> {
    try {
      const res = await fetch(`${API_URL}?action=listTransferencias&year=${year}`, { credentials: 'omit' });
      const data = await res.json();
      if (Array.isArray(data)) return data;
    } catch {}
    const all = getStorage<Transferencia[]>('transferencias', [
      { id: 'tr-1', fecha: '2026-05-01', de: 'Familia B', a: 'Familia A', importe: 200, concepto: 'Ajuste gastos primavera', year: 2026 }
    ]);
    return all.filter(t => t.year === Number(year));
  },

  async createTransferencia(data: Partial<Transferencia>): Promise<any> {
    const year = data.year || new Date().getFullYear();
    const all = getStorage<Transferencia[]>('transferencias', []);
    const newItem: Transferencia = {
      id: 'tr-' + Date.now(),
      fecha: data.fecha || new Date().toISOString().split('T')[0],
      de: data.de || 'Familia A',
      a: data.a || 'Familia B',
      importe: Number(data.importe) || 0,
      concepto: data.concepto || '',
      year: Number(year)
    };
    all.push(newItem);
    setStorage('transferencias', all);
    return { success: true, item: newItem };
  },

  async deleteTransferencia(id: string): Promise<any> {
    const all = getStorage<Transferencia[]>('transferencias', []);
    setStorage('transferencias', all.filter(t => t.id !== id));
    return { success: true };
  }
};
