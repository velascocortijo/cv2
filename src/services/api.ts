import { Expense, Income, InventoryItem, TaskItem, DocumentItem, Transferencia, FamilyConfig } from '../types';

const API_URL = 'https://script.google.com/macros/s/AKfycbyxKPMXY1ayJ6aDPFHU2GCsSs4TPFZztGFO8MXt34iPC-WAU7B-xCwYihqqivG1_EYc/exec';

export const CortijoAPI = {
  // --- AUTENTICACIÓN ---
  async checkEmail(email: string): Promise<{ authorized: boolean; name?: string; family?: string }> {
    try {
      const response = await fetch(`${API_URL}?action=isAuthorized&email=${encodeURIComponent(email)}`, { credentials: 'omit' });
      const data = await response.json();
      return data;
    } catch (e) {
      console.error('Error checking email authorization:', e);
      return { authorized: false };
    }
  },

  // --- CONFIGURACIÓN ---
  async getConfiguracion(): Promise<FamilyConfig> {
    try {
      const response = await fetch(`${API_URL}?action=getConfiguracion`, { credentials: 'omit' });
      const data = await response.json();
      return data || { familias: ['Familia A', 'Familia B', 'Familia C', 'Familia D'], porcentajes: { 'Familia A': 25, 'Familia B': 25, 'Familia C': 25, 'Familia D': 25 } };
    } catch (e) {
      console.error('Error fetching configuration:', e);
      return { familias: ['Familia A', 'Familia B', 'Familia C', 'Familia D'], porcentajes: { 'Familia A': 25, 'Familia B': 25, 'Familia C': 25, 'Familia D': 25 } };
    }
  },

  // --- GASTOS ---
  async getExpenses(year: number): Promise<Expense[]> {
    try {
      const response = await fetch(`${API_URL}?action=list&year=${year}`, { credentials: 'omit' });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Error fetching expenses:', e);
      return [];
    }
  },

  async createExpense(data: Partial<Expense>): Promise<any> {
    const response = await fetch(API_URL + '?action=create', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      credentials: 'omit'
    });
    return await response.json();
  },

  async deleteExpense(id: string): Promise<any> {
    const response = await fetch(API_URL + '?action=delete', {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      credentials: 'omit'
    });
    return await response.json();
  },

  // --- INGRESOS ---
  async getIncome(year: number): Promise<Income[]> {
    try {
      const response = await fetch(`${API_URL}?action=listIncome&year=${year}`, { credentials: 'omit' });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Error fetching income:', e);
      return [];
    }
  },

  async createIncome(data: Partial<Income>): Promise<any> {
    const response = await fetch(API_URL + '?action=addIncome', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      credentials: 'omit'
    });
    return await response.json();
  },

  async deleteIncome(id: string): Promise<any> {
    const response = await fetch(API_URL + '?action=deleteIncome', {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      credentials: 'omit'
    });
    return await response.json();
  },

  // --- INVENTARIO ---
  async getInventory(): Promise<InventoryItem[]> {
    try {
      const response = await fetch(`${API_URL}?action=listInventory`, { credentials: 'omit' });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Error fetching inventory:', e);
      return [];
    }
  },

  async createInventory(data: Partial<InventoryItem>): Promise<any> {
    const response = await fetch(API_URL + '?action=addInventory', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      credentials: 'omit'
    });
    return await response.json();
  },

  // --- TAREAS ---
  async getTasks(year: number): Promise<TaskItem[]> {
    try {
      const response = await fetch(`${API_URL}?action=listTasks&year=${year}`, { credentials: 'omit' });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Error fetching tasks:', e);
      return [];
    }
  },

  async createTask(data: Partial<TaskItem>): Promise<any> {
    const response = await fetch(API_URL + '?action=addTask', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      credentials: 'omit'
    });
    return await response.json();
  },

  // --- DOCUMENTOS ---
  async getDocuments(year: number): Promise<DocumentItem[]> {
    try {
      const response = await fetch(`${API_URL}?action=listDocs&year=${year}`, { credentials: 'omit' });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Error fetching documents:', e);
      return [];
    }
  },

  async uploadAndRecordDocument(data: Partial<DocumentItem>): Promise<any> {
    const response = await fetch(API_URL + '?action=addDoc', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      credentials: 'omit'
    });
    return await response.json();
  },

  async deleteDoc(id: string): Promise<any> {
    const response = await fetch(API_URL + '?action=deleteDoc', {
      method: 'POST',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      credentials: 'omit'
    });
    return await response.json();
  },

  // --- TRANSFERENCIAS (ZONA 2) ---
  async getTransferencias(year: number): Promise<Transferencia[]> {
    try {
      const response = await fetch(`${API_URL}?action=listTransferencias&year=${year}`, { credentials: 'omit' });
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error('Error fetching transferencias:', e);
      return [];
    }
  },

  async createTransferencia(data: Partial<Transferencia>): Promise<any> {
    const response = await fetch(API_URL + '?action=addTransferencia', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      credentials: 'omit'
    });
    return await response.json();
  },

  async deleteTransferencia(id: string, year: number): Promise<any> {
    const response = await fetch(API_URL + '?action=deleteTransferencia', {
      method: 'POST',
      body: JSON.stringify({ id, year }),
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      credentials: 'omit'
    });
    return await response.json();
  }
};
