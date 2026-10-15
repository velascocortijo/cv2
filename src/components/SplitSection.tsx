import React, { useEffect, useState } from 'react';
import { Plus, Trash2, PieChart, ArrowRightLeft } from 'lucide-react';
import { Transferencia, FamilyConfig, Expense, Income } from '../types';
import { CortijoAPI } from '../services/api';

export const SplitSection: React.FC = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [config, setConfig] = useState<FamilyConfig>({
    familias: ['Familia A', 'Familia B', 'Familia C', 'Familia D'],
    porcentajes: { 'Familia A': 25, 'Familia B': 25, 'Familia C': 25, 'Familia D': 25 }
  });
  const [transferencias, setTransferencias] = useState<Transferencia[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomeList, setIncomeList] = useState<Income[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Transfer form state
  const [de, setDe] = useState('Familia A');
  const [a, setA] = useState('Familia B');
  const [importe, setImporte] = useState('');
  const [concepto, setConcepto] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const loadData = async () => {
    try {
      const cfg = await CortijoAPI.getConfiguracion();
      if (cfg && cfg.familias) setConfig(cfg);
      const trs = await CortijoAPI.getTransferencias(year);
      setTransferencias(trs);
      const exps = await CortijoAPI.getExpenses(year);
      setExpenses(exps);
      const incs = await CortijoAPI.getIncome(year);
      setIncomeList(incs);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [year]);

  const handleCreateTransferencia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importe || !concepto) return;
    try {
      await CortijoAPI.createTransferencia({
        de,
        a,
        importe: Number(importe),
        concepto,
        fecha,
        year
      });
      setIsModalOpen(false);
      setImporte('');
      setConcepto('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTransferencia = async (id: string) => {
    if (!confirm('¿Eliminar transferencia?')) return;
    await CortijoAPI.deleteTransferencia(id, year);
    loadData();
  };

  const totalExpenses = expenses.reduce((s, e) => s + e.importe, 0);
  const totalIncome = incomeList.reduce((s, i) => s + i.importe, 0);
  const netExpense = totalExpenses - totalIncome;

  return (
    <div className="py-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
          <PieChart className="w-6 h-6 text-amber-600" /> Reparto General del Cortijo
        </h2>
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

      {/* ZONA 1: Resumen del Año */}
      <div className="card space-y-6">
        <h3 className="text-xl font-serif font-bold text-gray-900 border-b pb-3">ZONA 1 — Resumen del Año {year}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-xs font-semibold text-amber-800 uppercase">Gastos Totales</p>
            <p className="text-2xl font-bold text-amber-900 mt-1">{totalExpenses.toLocaleString()} €</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <p className="text-xs font-semibold text-emerald-800 uppercase">Ingresos Totales</p>
            <p className="text-2xl font-bold text-emerald-900 mt-1">{totalIncome.toLocaleString()} €</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <p className="text-xs font-semibold text-blue-800 uppercase">Gasto Neto</p>
            <p className="text-2xl font-bold text-blue-900 mt-1">{netExpense.toLocaleString()} €</p>
          </div>
        </div>

        {/* Breakdown table per family */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Familia</th>
                <th>Porcentaje Teórico</th>
                <th>Cuota Teórica</th>
                <th>Gastos Pagados</th>
                <th>Balance Final</th>
              </tr>
            </thead>
            <tbody>
              {config.familias.map(fam => {
                const pct = config.porcentajes[fam] || (100 / config.familias.length);
                const cuotaTeorica = (netExpense * pct) / 100;
                const paidByFam = expenses.filter(e => e.pagadoPor === fam).reduce((s, e) => s + e.importe, 0);
                const balance = paidByFam - cuotaTeorica;

                return (
                  <tr key={fam} className="hover:bg-gray-50">
                    <td className="font-semibold text-gray-900">{fam}</td>
                    <td>{pct}%</td>
                    <td>{cuotaTeorica.toFixed(2)} €</td>
                    <td>{paidByFam.toLocaleString()} €</td>
                    <td className={`font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {balance > 0 ? `+${balance.toFixed(2)} €` : `${balance.toFixed(2)} €`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ZONA 2: Transferencias y Bizums */}
      <div className="card space-y-6">
        <div className="flex justify-between items-center border-b pb-3">
          <div>
            <h3 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-amber-600" /> ZONA 2 — Transferencias y Bizums
            </h3>
            <p className="text-xs text-gray-500 mt-1">Gestión de pagos directos enviados entre familias para equilibrar cuentas.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 shadow"
          >
            <Plus className="w-4 h-4" /> Añadir Envío
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>De</th>
                <th>A</th>
                <th>Concepto</th>
                <th className="text-right">Importe</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {transferencias.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No hay transferencias registradas para {year}.</td></tr>
              ) : (
                transferencias.map(tr => (
                  <tr key={tr.id} className="hover:bg-gray-50">
                    <td className="text-sm text-gray-600">{tr.fecha}</td>
                    <td className="font-medium text-gray-900">{tr.de}</td>
                    <td className="font-medium text-gray-900">{tr.a}</td>
                    <td>{tr.concepto}</td>
                    <td className="text-right font-bold text-gray-900">{tr.importe.toLocaleString()} €</td>
                    <td className="text-center">
                      <button onClick={() => handleDeleteTransferencia(tr.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

      {/* Modal Añadir Transferencia */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-serif font-bold text-gray-900">Registrar Transferencia / Bizum</h3>
            <form onSubmit={handleCreateTransferencia} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">De (Pagador)</label>
                  <select
                    value={de}
                    onChange={(e) => setDe(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    {config.familias.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">A (Receptor)</label>
                  <select
                    value={a}
                    onChange={(e) => setA(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    {config.familias.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
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
                    placeholder="100.00"
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
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Concepto</label>
                <input
                  type="text"
                  required
                  value={concepto}
                  onChange={(e) => setConcepto(e.target.value)}
                  placeholder="Ej. Ajuste de cuentas"
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
                  Guardar Transferencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
