import React, { useEffect, useState } from 'react';
import { Plus, Trash2, DollarSign, FileText } from 'lucide-react';
import { Expense } from '../types';
import { CortijoAPI } from '../services/api';

export const ExpensesSection: React.FC = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [concepto, setConcepto] = useState('');
  const [importe, setImporte] = useState('');
  const [categoria, setCategoria] = useState('Limpieza');
  const [pagadoPor, setPagadoPor] = useState('Familia A');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [observaciones, setObservaciones] = useState('');

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await CortijoAPI.getExpenses(year);
      setExpenses(data);
    } catch {
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, [year]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concepto || !importe) return;
    try {
      await CortijoAPI.createExpense({
        concepto,
        importe: Number(importe),
        categoria,
        pagadoPor,
        fecha,
        observaciones,
        year
      });
      setIsModalOpen(false);
      setConcepto('');
      setImporte('');
      setObservaciones('');
      loadExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este gasto?')) return;
    await CortijoAPI.deleteExpense(id);
    loadExpenses();
  };

  const totalExpenses = expenses.reduce((sum, item) => sum + item.importe, 0);

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-serif font-bold text-gray-900">Gestión Económica (Gastos)</h2>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-1.5 border rounded-lg font-semibold text-sm bg-gray-50"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
          </select>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" /> Añadir Gasto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-amber-500 to-amber-700 text-white">
          <p className="text-amber-100 text-sm font-semibold">Total Gastos {year}</p>
          <h3 className="text-3xl font-serif font-bold mt-1">{totalExpenses.toLocaleString()} €</h3>
        </div>
        <div className="card">
          <p className="text-gray-500 text-sm font-semibold">Registros</p>
          <h3 className="text-3xl font-serif font-bold mt-1 text-gray-900">{expenses.length}</h3>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Categoría</th>
                <th>Pagado Por</th>
                <th className="text-right">Importe</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Cargando gastos...</td></tr>
              ) : expenses.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No hay gastos registrados para {year}.</td></tr>
              ) : (
                expenses.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="text-sm text-gray-600">{item.fecha}</td>
                    <td className="font-medium text-gray-900">{item.concepto}</td>
                    <td><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{item.categoria}</span></td>
                    <td className="text-sm font-medium text-amber-700">{item.pagadoPor}</td>
                    <td className="text-right font-bold text-gray-900">{item.importe.toLocaleString()} €</td>
                    <td className="text-center">
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Añadir Gasto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-serif font-bold text-gray-900">Registrar Nuevo Gasto</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Concepto</label>
                <input
                  type="text"
                  required
                  value={concepto}
                  onChange={(e) => setConcepto(e.target.value)}
                  placeholder="Ej. Reparación de tubería"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Importe (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={importe}
                    onChange={(e) => setImporte(e.target.value)}
                    placeholder="150.00"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Categoría</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="Herramientas">Herramientas</option>
                    <option value="Camping">Camping</option>
                    <option value="Jardín">Jardín</option>
                    <option value="Limpieza">Limpieza</option>
                    <option value="Mobiliario">Mobiliario</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Pagado Por</label>
                  <select
                    value={pagadoPor}
                    onChange={(e) => setPagadoPor(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="Familia A">Familia A</option>
                    <option value="Familia B">Familia B</option>
                    <option value="Familia C">Familia C</option>
                    <option value="Familia D">Familia D</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Observaciones / Factura</label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Detalles adicionales..."
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  rows={2}
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold shadow"
                >
                  Guardar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
