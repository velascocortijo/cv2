import React, { useEffect, useState } from 'react';
import { Plus, CheckSquare, Clock } from 'lucide-react';
import { TaskItem } from '../types';
import { CortijoAPI } from '../services/api';

export const TasksSection: React.FC = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New task form
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [asignadoA, setAsignadoA] = useState('Familia A');
  const [fechaLimite, setFechaLimite] = useState(new Date().toISOString().split('T')[0]);

  const loadTasks = async () => {
    try {
      const data = await CortijoAPI.getTasks(year);
      setTasks(data);
    } catch {
      setTasks([]);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [year]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo) return;
    try {
      await CortijoAPI.createTask({
        titulo,
        descripcion,
        asignadoA,
        fechaLimite,
        estado: 'Pendiente',
        year
      });
      setIsModalOpen(false);
      setTitulo('');
      setDescripcion('');
      loadTasks();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-amber-600" /> Tareas de Mantenimiento
          </h2>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-1.5 border rounded-lg font-semibold text-sm bg-gray-50"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" /> Nueva Tarea
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length === 0 ? (
          <div className="col-span-full card text-center py-12 text-gray-500">
            No hay tareas pendientes registradas para {year}.
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="card space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="font-serif font-bold text-lg text-gray-900">{task.titulo}</h3>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">{task.estado}</span>
                </div>
                {task.descripcion && <p className="text-sm text-gray-600 mt-2">{task.descripcion}</p>}
              </div>
              <div className="pt-4 border-t flex justify-between items-center text-xs text-gray-500">
                <span className="font-semibold text-amber-700">{task.asignadoA}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {task.fechaLimite}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Nueva Tarea */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-serif font-bold text-gray-900">Crear Nueva Tarea</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej. Revisar riego por goteo"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Asignado A</label>
                  <select
                    value={asignadoA}
                    onChange={(e) => setAsignadoA(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="Familia A">Familia A</option>
                    <option value="Familia B">Familia B</option>
                    <option value="Familia C">Familia C</option>
                    <option value="Familia D">Familia D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    required
                    value={fechaLimite}
                    onChange={(e) => setFechaLimite(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Descripción</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Detalles de la tarea..."
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  rows={3}
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
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
