import React, { useState } from 'react';
import { Menu, LogOut, Calendar, DollarSign, PieChart, CheckSquare, FileText, User, Home, BookOpen, Mail } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  user: UserProfile | null;
  onOpenLogin: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentSection, onNavigate, user, onOpenLogin, onSignOut }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (sec: string) => {
    onNavigate(sec);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNav(user ? 'calendar' : 'home')}>
          <div className="h-12 w-12 rounded-full overflow-hidden flex items-center justify-center bg-amber-100 border border-amber-300">
            <span className="font-serif font-bold text-amber-800 text-lg">CV</span>
          </div>
          <div>
            <span className="font-serif font-bold text-2xl text-gray-900">Cortijo <span className="text-amber-600">Velasco</span></span>
            <p className="text-xs text-gray-500 tracking-wider uppercase">Gestión Familiar</p>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {!user ? (
            <>
              <button
                onClick={() => handleNav('home')}
                className={`px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-1.5 transition-colors ${currentSection === 'home' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Home className="w-4 h-4" /> Inicio
              </button>
              <button
                onClick={() => handleNav('history')}
                className={`px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-1.5 transition-colors ${currentSection === 'history' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <BookOpen className="w-4 h-4" /> Historia
              </button>
              <a
                href="https://www.escapadarural.com/casa-rural/cordoba/cortijo-velasco"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-lg font-medium text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" /> Reservas
              </a>
              <button
                onClick={() => handleNav('contact')}
                className={`px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-1.5 transition-colors ${currentSection === 'contact' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Mail className="w-4 h-4" /> Contacto
              </button>
              <button
                onClick={onOpenLogin}
                className="ml-4 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow transition-all"
              >
                Acceso Familiar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNav('calendar')}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${currentSection === 'calendar' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Calendar className="w-4 h-4" /> Calendario
              </button>
              <button
                onClick={() => handleNav('expenses')}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${currentSection === 'expenses' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <DollarSign className="w-4 h-4" /> Gastos
              </button>
              <button
                onClick={() => handleNav('income')}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${currentSection === 'income' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <DollarSign className="w-4 h-4" /> Ingresos
              </button>
              <button
                onClick={() => handleNav('split')}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${currentSection === 'split' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <PieChart className="w-4 h-4" /> Reparto
              </button>
              <button
                onClick={() => handleNav('inventory')}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${currentSection === 'inventory' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <CheckSquare className="w-4 h-4" /> Inventario
              </button>
              <button
                onClick={() => handleNav('tasks')}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${currentSection === 'tasks' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <CheckSquare className="w-4 h-4" /> Tareas
              </button>
              <button
                onClick={() => handleNav('documents')}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${currentSection === 'documents' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FileText className="w-4 h-4" /> Documentos
              </button>
              <button
                onClick={() => handleNav('profile')}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${currentSection === 'profile' ? 'bg-amber-50 text-amber-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <User className="w-4 h-4" /> Perfil
              </button>
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm font-medium text-gray-700 hidden lg:inline">{user.name}</span>
                <button
                  onClick={onSignOut}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {!user ? (
            <>
              <button onClick={() => handleNav('home')} className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100">Inicio</button>
              <button onClick={() => handleNav('history')} className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100">Historia</button>
              <a href="https://www.escapadarural.com/casa-rural/cordoba/cortijo-velasco" target="_blank" rel="noreferrer" className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100">Reservas</a>
              <button onClick={() => handleNav('contact')} className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100">Contacto</button>
              <button onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }} className="w-full mt-2 bg-amber-600 text-white px-4 py-2 rounded-md font-semibold text-center">Acceso Familiar</button>
            </>
          ) : (
            <>
              <button onClick={() => handleNav('calendar')} className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100">Calendario</button>
              <button onClick={() => handleNav('expenses')} className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100">Gastos</button>
              <button onClick={() => handleNav('income')} className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100">Ingresos</button>
              <button onClick={() => handleNav('split')} className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100">Reparto</button>
              <button onClick={() => handleNav('inventory')} className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100">Inventario</button>
              <button onClick={() => handleNav('tasks')} className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100">Tareas</button>
              <button onClick={() => handleNav('documents')} className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100">Documentos</button>
              <button onClick={() => handleNav('profile')} className="block w-full text-left px-3 py-2 rounded-md font-medium text-gray-700 hover:bg-gray-100">Perfil</button>
              <button onClick={onSignOut} className="w-full mt-2 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-md font-semibold">
                <LogOut className="w-4 h-4" /> Cerrar Sesión
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
