import React, { useState } from 'react';
import { X, Lock, Mail, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import { CortijoAPI } from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await CortijoAPI.checkEmail(emailInput);
      if (res.authorized) {
        const user: UserProfile = {
          email: emailInput,
          name: res.name || emailInput.split('@')[0],
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
          isAuthorized: true,
          familyMember: res.family || 'Familia Velasco'
        };
        onLoginSuccess(user);
        onClose();
      } else {
        setError('Este correo no está autorizado para el acceso familiar.');
      }
    } catch {
      setError('Error al verificar el correo. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const user: UserProfile = {
      email: 'velascocortijo@gmail.com',
      name: 'Familia Velasco',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      isAuthorized: true,
      familyMember: 'Familia Velasco'
    };
    onLoginSuccess(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3 mb-6">
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-gray-900">Acceso Familiar</h3>
          <p className="text-sm text-gray-600">Introduce tu correo electrónico autorizado para acceder a la gestión del cortijo.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="nombre@familia.es"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-lg shadow transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Verificando...' : 'Acceder'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="text-xs text-amber-600 hover:text-amber-700 font-semibold underline"
          >
            Acceso Rápido (Modo Demostración)
          </button>
        </div>
      </div>
    </div>
  );
};
