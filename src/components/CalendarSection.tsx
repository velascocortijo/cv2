import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react';

interface Booking {
  id: string;
  title: string;
  start: string;
  end: string;
  family: string;
}

export const CalendarSection: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([
    { id: '1', title: 'Vacaciones Familia A', start: '2026-06-10', end: '2026-06-20', family: 'Familia A' },
    { id: '2', title: 'Fin de semana Familia B', start: '2026-06-25', end: '2026-06-28', family: 'Familia B' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStart, setNewStart] = useState('');
  const [newEnd, setNewEnd] = useState('');
  const [newFamily, setNewFamily] = useState('Familia A');
  const [auditLog, setAuditLog] = useState<string[]>([
    'Reserva creada: Vacaciones Familia A (10/06/2026 - 20/06/2026)',
    'Reserva creada: Fin de semana Familia B (25/06/2026 - 28/06/2026)'
  ]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate days for the month grid
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newStart || !newEnd) return;
    const booking: Booking = {
      id: 'b-' + Date.now(),
      title: newTitle,
      start: newStart,
      end: newEnd,
      family: newFamily
    };
    setBookings([...bookings, booking]);
    setAuditLog([`Reserva creada: ${newTitle} (${newStart} al ${newEnd}) por ${newFamily}`, ...auditLog]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewStart('');
    setNewEnd('');
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-amber-600" /> Calendario de Reservas
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-2 rounded-lg border hover:bg-gray-50"><ChevronLeft className="w-4 h-4" /></button>
            <span className="font-semibold min-w-[140px] text-center">{monthNames[month]} {year}</span>
            <button onClick={nextMonth} className="p-2 rounded-lg border hover:bg-gray-50"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 shadow"
          >
            <Plus className="w-4 h-4" /> Nueva Reserva
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card overflow-hidden p-0">
        <div className="grid grid-cols-7 bg-gray-100 text-center font-semibold text-xs text-gray-700 py-3 border-b">
          <span>Dom</span><span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span>
        </div>
        <div className="grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px">
          {Array.from({ length: (firstDayIndex === 0 ? 6 : firstDayIndex - 1) }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-white min-h-[100px] p-2 text-gray-300"></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const dayBookings = bookings.filter(b => dateStr >= b.start && dateStr <= b.end);

            return (
              <div key={`day-${dayNum}`} className="bg-white min-h-[100px] p-2 flex flex-col justify-between">
                <span className="font-bold text-sm text-gray-800">{dayNum}</span>
                <div className="space-y-1 mt-1">
                  {dayBookings.map(b => (
                    <div key={b.id} className="bg-amber-100 text-amber-800 text-xs px-1.5 py-0.5 rounded truncate font-medium" title={`${b.title} (${b.family})`}>
                      {b.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Log */}
      <div className="card space-y-4">
        <h4 className="font-serif font-bold text-lg text-gray-900 border-b pb-2">Registro de Modificaciones</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          {auditLog.map((log, index) => (
            <li key={index} className="flex items-center gap-2 py-1 border-b border-gray-100 last:border-0">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>{log}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal Nueva Reserva */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-serif font-bold text-gray-900">Añadir Nueva Reserva</h3>
            <form onSubmit={handleAddBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Título de la Reserva</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. Vacaciones Verano"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Fecha Inicio</label>
                  <input
                    type="date"
                    required
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Fecha Fin</label>
                  <input
                    type="date"
                    required
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Familia</label>
                <select
                  value={newFamily}
                  onChange={(e) => setNewFamily(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="Familia A">Familia A</option>
                  <option value="Familia B">Familia B</option>
                  <option value="Familia C">Familia C</option>
                  <option value="Familia D">Familia D</option>
                </select>
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
                  Guardar Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
