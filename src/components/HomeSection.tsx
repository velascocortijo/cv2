import React from 'react';

interface HomeSectionProps {
  onNavigate: (section: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ onNavigate }) => {
  return (
    <div className="py-8">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 text-white min-h-[500px] flex items-center">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src="/hero.jpg"
          alt="Cortijo Velasco"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 max-w-2xl px-8 sm:px-16 py-12 space-y-6">
          <h1 className="text-4xl sm:text-6xl font-serif font-bold leading-tight">
            Bienvenidos al <span className="text-amber-400">Cortijo Velasco</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200">
            Un refugio de paz en el corazón de Andalucía donde la historia y el descanso se encuentran.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              onClick={() => onNavigate('history')}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all"
            >
              Descubrir Historia
            </button>
            <a
              href="https://www.escapadarural.com/casa-rural/cordoba/cortijo-velasco"
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 hover:bg-white/25 backdrop-blur text-white border border-white/30 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all inline-flex items-center"
            >
              Reservar Ahora
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
