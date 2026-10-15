import React from 'react';

export const HistorySection: React.FC = () => {
  return (
    <div className="py-8 max-w-4xl mx-auto">
      <div className="card space-y-6">
        <h2 className="text-3xl font-serif font-bold text-gray-900 border-b pb-4">Nuestra Historia</h2>
        <div className="prose prose-lg text-gray-700 space-y-4">
          <p>
            El Cortijo Velasco es una construcción tradicional andaluza con décadas de historia. Situado en un entorno privilegiado, ha sido testigo del paso de generaciones, manteniendo siempre su esencia rústica y acogedora.
          </p>
          <p>
            Hoy, abrimos sus puertas para que puedas disfrutar de la tranquilidad del campo, rodeado de olivos y cielos despejados, con todas las comodidades modernas pero sin perder el encanto de lo antiguo.
          </p>
        </div>
      </div>
    </div>
  );
};
