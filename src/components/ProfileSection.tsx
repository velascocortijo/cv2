import React, { useEffect, useState } from 'react';
import { User, Shield, Mail } from 'lucide-react';
import { UserProfile, FamilyConfig } from '../types';
import { CortijoAPI } from '../services/api';

interface ProfileSectionProps {
  user: UserProfile | null;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
  const [config, setConfig] = useState<FamilyConfig | null>(null);

  useEffect(() => {
    CortijoAPI.getConfiguracion().then(setConfig);
  }, []);

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      <div className="card space-y-6">
        <div className="flex items-center gap-4 border-b pb-6">
          <div className="w-20 h-20 rounded-full bg-amber-100 border-2 border-amber-300 overflow-hidden flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-amber-700" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900">{user?.name || 'Familiar'}</h2>
            <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
              <Mail className="w-4 h-4 text-amber-600" /> {user?.email || 'velascocortijo@gmail.com'}
            </p>
            <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              <Shield className="w-3.5 h-3.5" /> Acceso Familiar Autorizado
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-serif font-bold text-gray-900">Configuración de Familias y Porcentajes</h3>
          <p className="text-sm text-gray-600">
            Los porcentajes de reparto y cuotas asignadas están sincronizados con la hoja de configuración oficial de Google Sheets.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {config?.familias?.map(fam => (
              <div key={fam} className="p-4 rounded-xl border bg-gray-50 flex justify-between items-center">
                <span className="font-semibold text-gray-900">{fam}</span>
                <span className="px-3 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold text-sm">
                  {config.porcentajes[fam] || 25}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
