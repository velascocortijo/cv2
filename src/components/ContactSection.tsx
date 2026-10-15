import React from 'react';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <div className="py-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card space-y-6">
          <h2 className="text-3xl font-serif font-bold text-gray-900 border-b pb-4">Contacto</h2>
          <div className="space-y-4 text-gray-700">
            <p className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-amber-600 mt-1 shrink-0" />
              <span><strong>Dirección:</strong> Camino del Cortijo Velasco, s/n, Córdoba, España</span>
            </p>
            <p className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-amber-600 shrink-0" />
              <span><strong>Teléfono:</strong> <a href="tel:666666666" className="text-amber-600 hover:underline">666.666.666</a></span>
            </p>
            <p className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-amber-600 shrink-0" />
              <span><strong>Email:</strong> <a href="mailto:info@cortijovelasco.es" className="text-amber-600 hover:underline">info@cortijovelasco.es</a></span>
            </p>
          </div>
          <div className="flex gap-4 pt-4 border-t">
            <button className="p-2.5 rounded-full bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-700 transition-colors">
              <Instagram className="w-5 h-5" />
            </button>
            <button className="p-2.5 rounded-full bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-700 transition-colors">
              <Facebook className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="card overflow-hidden p-0">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3157.2306242162576!2d-4.9451833999999995!3d37.69078249999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd6d31cf60b1d9dd%3A0x5d80dc5cfd2bdee1!2sCortijo%20Velasco!5e0!3m2!1ses!2ses!4v1773008610534!5m2!1ses!2ses"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '350px' }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Cortijo Velasco"
          ></iframe>
        </div>
      </div>
    </div>
  );
};
