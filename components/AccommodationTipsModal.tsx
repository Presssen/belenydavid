import React from 'react';
import { X, Car, Home, Phone, MapPin, Clock, AlertCircle } from 'lucide-react';

interface AccommodationTipsModalProps {
  onClose: () => void;
}

export const AccommodationTipsModal: React.FC<AccommodationTipsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-wedding-900/60 backdrop-blur-sm transition-opacity animate-fade-in-up"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-wedding-50 p-6 border-b border-wedding-100 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-wedding-900">Consejos e Info</h2>
            <button 
                onClick={onClose}
                className="p-2 bg-white hover:bg-wedding-100 text-wedding-500 rounded-full transition-colors border border-wedding-200"
            >
                <X size={20} />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          
          {/* General Tips */}
          <div className="space-y-4">
            <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Home size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-wedding-800 mb-1">Apartamentos vs Hoteles</h3>
                    <p className="text-sm text-wedding-600 leading-relaxed">
                        Si venís muchos días o en grupo grande, os recomendamos mirar pisos o apartamentos en <strong>Booking</strong> o <strong>Airbnb</strong>. Suelen salir mejor de precio para estancias largas.
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                    <Car size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-wedding-800 mb-1">El Aparcamiento</h3>
                    <p className="text-sm text-wedding-600 leading-relaxed">
                        Aparcar en Sanlúcar no es fácil (mucha zona azul y calles estrechas). Fijaros bien si vuestro alojamiento incluye parking.
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                    <Clock size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-wedding-800 mb-1">Distancias</h3>
                    <p className="text-sm text-wedding-600 leading-relaxed">
                        En los hoteles hemos indicado el tiempo a pie hasta la Iglesia. Tenred en cuenta que para ir a la Finca (Banquete) necesitaréis coche o autobús.
                    </p>
                </div>
            </div>
          </div>

          <div className="h-px bg-wedding-100 w-full" />

          {/* Parking Info */}
          <div className="bg-wedding-50 rounded-xl p-5 border border-wedding-200">
             <div className="flex items-center gap-2 mb-3">
                <div className="bg-wedding-900 text-white p-1.5 rounded">
                    <Car size={16} />
                </div>
                <h3 className="font-serif text-lg text-wedding-900">Parking Recomendado</h3>
             </div>
             <p className="text-sm text-wedding-700 mb-3 font-medium">
                Parking Parkia - Playa de la Calzada
             </p>
             <p className="text-xs text-wedding-600 mb-4 leading-relaxed">
                Es un parking de pago pero económico y muy grande. Está situado en la calzada, cerca de la playa y del centro.
             </p>
             <a 
                href="https://www.google.com/maps/search/?api=1&query=Parking+Parkia+Sanlucar+de+Barrameda"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-wedding-900 hover:text-accent transition-colors"
             >
                <MapPin size={14} /> Ver ubicación en Maps
             </a>
          </div>

          <div className="h-px bg-wedding-100 w-full" />

          {/* Contact */}
          <div>
            <div className="flex items-center gap-2 mb-4 text-wedding-800">
                <AlertCircle size={18} className="text-accent" />
                <h3 className="font-bold text-sm uppercase tracking-wide">¿Necesitas Ayuda?</h3>
            </div>
            <p className="text-sm text-wedding-600 mb-4">
                Si tenéis dudas con la reserva o no encontráis sitio, escribidnos sin problema:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a href="tel:+34676382167" className="flex items-center justify-center gap-2 p-3 bg-white border border-wedding-200 rounded-lg hover:bg-wedding-50 transition-colors text-wedding-800">
                    <Phone size={16} className="text-wedding-400" />
                    <span className="font-medium">David: 676 38 21 67</span>
                </a>
                <a href="tel:+34645442995" className="flex items-center justify-center gap-2 p-3 bg-white border border-wedding-200 rounded-lg hover:bg-wedding-50 transition-colors text-wedding-800">
                    <Phone size={16} className="text-wedding-400" />
                    <span className="font-medium">Belén: 645 44 29 95</span>
                </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};