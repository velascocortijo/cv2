import React, { useEffect, useState } from 'react';
import { Plus, FileText, Download } from 'lucide-react';
import { DocumentItem } from '../types';
import { CortijoAPI } from '../services/api';

export const DocumentsSection: React.FC = () => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New doc form
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Legal');
  const [url, setUrl] = useState('#');

  const loadDocs = async () => {
    try {
      const data = await CortijoAPI.getDocuments(year);
      setDocuments(data);
    } catch {
      setDocuments([]);
    }
  };

  useEffect(() => {
    loadDocs();
  }, [year]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo) return;
    try {
      await CortijoAPI.uploadAndRecordDocument({
        titulo,
        categoria,
        url,
        fecha: new Date().toISOString().split('T')[0],
        year
      });
      setIsModalOpen(false);
      setTitulo('');
      loadDocs();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-600" /> Documentos del Cortijo
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
          <Plus className="w-4 h-4" /> Subir Documento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.length === 0 ? (
          <div className="col-span-full card text-center py-12 text-gray-500">
            No hay documentos registrados para {year}.
          </div>
        ) : (
          documents.map(doc => (
            <div key={doc.id} className="card space-y-4 flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">{doc.categoria}</span>
                <h3 className="font-serif font-bold text-lg text-gray-900 mt-2">{doc.titulo}</h3>
                <p className="text-xs text-gray-500 mt-1">Fecha: {doc.fecha}</p>
              </div>
              <a
                href={doc.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-amber-50 text-gray-700 hover:text-amber-700 py-2 rounded-lg font-semibold text-sm transition-colors border"
              >
                <Download className="w-4 h-4" /> Ver / Descargar
              </a>
            </div>
          ))
        )}
      </div>

      {/* Modal Subir Documento */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-serif font-bold text-gray-900">Registrar Documento</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej. Factura Seguros Anual"
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
                    <option value="Legal">Legal</option>
                    <option value="Facturas">Facturas</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Enlace / URL</label>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
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
                  Guardar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
