import React, { useEffect, useState } from 'react';
import { Plus, Search, CheckSquare } from 'lucide-react';
import { InventoryItem } from '../types';
import { CortijoAPI } from '../services/api';

export const InventorySection: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New item form
  const [articulo, setArticulo] = useState('');
  const [categoria, setCategoria] = useState('Herramientas');
  const [marcaModelo, setMarcaModelo] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [ubicacion, setUbicacion] = useState('Taller');
  const [estado, setEstado] = useState('Bueno');
  const [responsible, setResponsible] = useState('Familia A');
  const [observaciones, setObservaciones] = useState('');

  const loadInventory = async () => {
    try {
      const data = await CortijoAPI.getInventory();
      setInventory(data);
    } catch {
      setInventory([]);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articulo) return;
    try {
      await CortijoAPI.createInventory({
        articulo,
        categoria,
        marca_modelo: marcaModelo,
        cantidad: Number(cantidad),
        ubicacion,
        estado,
        responsible,
        observaciones,
        fecha_revision: new Date().toISOString().split('T')[0]
      });
      setIsModalOpen(false);
      setArticulo('');
      setMarcaModelo('');
      setObservaciones('');
      loadInventory();
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = inventory.filter(item => {
    const matchesSearch = item.articulo.toLowerCase().includes(search.toLowerCase()) ||
                          item.marca_modelo.toLowerCase().includes(search.toLowerCase()) ||
                          item.ubicacion.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'Todos' || item.categoria === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-amber-600" /> Inventario del Cortijo
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" /> Nuevo Artículo
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por artículo, marca o ubicación..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm bg-white"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg text-sm font-semibold bg-white"
        >
          <option value="Todos">Todas las Categorías</option>
          <option value="Herramientas">Herramientas</option>
          <option value="Camping">Camping</option>
          <option value="Jardín">Jardín</option>
          <option value="Limpieza">Limpieza</option>
          <option value="Mobiliario">Mobiliario</option>
          <option value="Otros">Otros</option>
        </select>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Artículo</th>
                <th>Categoría</th>
                <th>Ubicación</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Responsable</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">No se encontraron artículos.</td></tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td>
                      <p className="font-semibold text-gray-900">{item.articulo}</p>
                      <p className="text-xs text-gray-500">{item.marca_modelo}</p>
                    </td>
                    <td><span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{item.categoria}</span></td>
                    <td className="text-sm text-gray-700">{item.ubicacion}</td>
                    <td className="font-bold text-gray-900">{item.cantidad} {item.unidad || 'Unidades'}</td>
                    <td>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.estado === 'Bueno' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {item.estado}
                      </span>
                    </td>
                    <td className="text-sm font-medium text-amber-700">{item.responsible}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nuevo Artículo */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-serif font-bold text-gray-900">Añadir Artículo al Inventario</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Artículo</label>
                <input
                  type="text"
                  required
                  value={articulo}
                  onChange={(e) => setArticulo(e.target.value)}
                  placeholder="Ej. Taladro Percutor"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
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
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Marca / Modelo</label>
                  <input
                    type="text"
                    value={marcaModelo}
                    onChange={(e) => setMarcaModelo(e.target.value)}
                    placeholder="Bosch Professional"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Ubicación</label>
                  <select
                    value={ubicacion}
                    onChange={(e) => setUbicacion(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="Taller">Taller</option>
                    <option value="Trastero">Trastero</option>
                    <option value="Jardín">Jardín</option>
                    <option value="Casa Principal">Casa Principal</option>
                    <option value="Piscina">Piscina</option>
                    <option value="Garaje">Garaje</option>
                    <option value="Porche">Porche</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Estado</label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="Bueno">Bueno</option>
                    <option value="Usado">Usado</option>
                    <option value="Reparación">Reparación</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Responsable</label>
                <input
                  type="text"
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
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
                  Guardar Artículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
