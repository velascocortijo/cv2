import React, { useEffect, useState } from 'react';
import { Plus, Trash2, DollarSign } from 'lucide-react';
import { Income } from '../types';
import { CortijoAPI } from '../services/api';

export const IncomeSection: React.FC = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [incomeList, setIncomeList] = useState<Income[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [concepto, setConcepto] = useState('');
  const [importe, setImporte] = useState('');
  const [recibidoPor, setRecibidoPor] = useState('Cortijo');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const loadIncome = async () => {
    setLoading(true);
    try {
      const data = await CortijoAPI.getIncome(year);
      setIncomeList(data);
    } catch {
      setIncomeList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncome();
  }, [year]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!concepto || !importe) return;
    try {
      await CortijoAPI.createIncome({
        concepto,
        importe: Number(importe),
        recibidoPor,
        fecha,
        year
      });
      setIsModalOpen(false);
      setConcepto('');
      setImporte('');
      loadIncome();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este ingreso?')) return;
    await CortijoAPI.deleteIncome(id);
    loadIncome();
  };

  const totalIncome = incomeList.reduce((sum, item) => sum + item.importe, 0);

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-serif font-bold text-gray-900">Gestión de Ingresos</h2>
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
          <Plus className="w-4 h-4" /> Añadir Ingreso
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
          <p className="text-emerald-100 text-sm font-semibold">Total Ingresos {year}</p>
          <h3 className="text-3xl font-serif font-bold mt-1">{totalIncome.toLocaleString()} €</h3>
        </div>
        <div className="card">
          <p className="text-gray-500 text-sm font-semibold">Registros</p>
          <h3 className="text-3xl font-serif font-bold mt-1 text-gray-900">{incomeList.length}</h3>
        </div>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Recibido Por</th>
                <th className="text-right">Importe</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">Cargando ingresos...</td></tr>
              ) : incomeList.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">No hay ingresos registrados para {year}.</td></tr>
              ) : (
                incomeList.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="text-sm text-gray-600">{item.fecha}</td>
                    <td className="font-medium text-gray-900">{item.concepto}</td>
                    <td className="text-sm font-medium text-emerald-700">{item.recibidoPor}</td>
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

      {/* Modal Añadir Ingreso */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-serif font-bold text-gray-900">Registrar Nuevo Ingreso</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Concepto</label>
                <input
                  type="text"
                  required
                  value={concepto}
                  onChange={(e) => setConcepto(e.target.value)}
                  placeholder="Ej. Alquiler o Subvención"
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
                    placeholder="500.00"
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
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Recibido Por</label>
                <input
                  type="text"
                  required
                  value={recibidoPor}
                  onChange={(e) => setRecibidoPor(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
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
                  Guardar Ingreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
