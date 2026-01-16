import React, { useState } from 'react';
import { Hotel } from '../types';
import { X, MapPin, Car, Coffee, Waves, Wifi, Ticket, Copy, Check, ExternalLink, Mail, Star } from 'lucide-react';

interface HotelDetailsModalProps {
  hotel: Hotel;
  onClose: () => void;
}

export const HotelDetailsModal: React.FC<HotelDetailsModalProps> = ({ hotel, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (hotel.discountCode) {
      navigator.clipboard.writeText(hotel.discountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-wedding-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in-up flex flex-col max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors z-20 backdrop-blur-md"
        >
          <X size={20} />
        </button>

        {/* Header Image */}
        <div className="h-64 relative flex-shrink-0">
          <img 
            src={hotel.imageUrl} 
            alt={hotel.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h2 className="font-serif text-3xl font-medium mb-1">{hotel.name}</h2>
            <div className="flex items-center gap-2 text-sm opacity-90">
               {hotel.stars && hotel.stars > 0 && (
                 <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
                   <span>{hotel.stars}</span> <Star size={12} fill="currentColor" />
                 </div>
               )}
               <span>•</span>
               <span>{hotel.address}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="flex-1">
               <h3 className="text-sm font-bold text-wedding-400 uppercase tracking-widest mb-3">Descripción</h3>
               <p className="text-wedding-800 leading-relaxed text-lg">
                 {hotel.description}
               </p>
            </div>
            
            {/* Quick Stats Box */}
            <div className="w-full md:w-56 bg-wedding-50 rounded-xl p-5 border border-wedding-100 h-fit">
               <div className="mb-4">
                 <span className="block text-xs text-wedding-500 uppercase">Precio aprox.</span>
                 <span className="font-serif text-2xl text-wedding-900">{hotel.priceRange}</span>
               </div>
               <div>
                 <span className="block text-xs text-wedding-500 uppercase">Distancia Iglesia</span>
                 <div className="flex items-center gap-2 text-accent font-semibold mt-1">
                   <MapPin size={18} />
                   <span>{hotel.walkingDistanceMinutes} min a pie</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-wedding-400 uppercase tracking-widest mb-4">Servicios Destacados</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
               <div className={`flex flex-col items-center justify-center p-4 rounded-xl border ${hotel.amenities.wifi ? 'bg-wedding-50 border-wedding-200 text-wedding-800' : 'bg-gray-50 border-gray-100 text-gray-400 opacity-60'}`}>
                 <Wifi size={24} className="mb-2" />
                 <span className="text-xs font-medium">Wifi</span>
                 {!hotel.amenities.wifi && <span className="text-[10px] text-gray-400">(No disp.)</span>}
               </div>
               <div className={`flex flex-col items-center justify-center p-4 rounded-xl border ${hotel.amenities.parking ? 'bg-wedding-50 border-wedding-200 text-wedding-800' : 'bg-gray-50 border-gray-100 text-gray-400 opacity-60'}`}>
                 <Car size={24} className="mb-2" />
                 <span className="text-xs font-medium">Parking</span>
                 {!hotel.amenities.parking && <span className="text-[10px] text-gray-400">(No disp.)</span>}
               </div>
               <div className={`flex flex-col items-center justify-center p-4 rounded-xl border ${hotel.amenities.breakfast ? 'bg-wedding-50 border-wedding-200 text-wedding-800' : 'bg-gray-50 border-gray-100 text-gray-400 opacity-60'}`}>
                 <Coffee size={24} className="mb-2" />
                 <span className="text-xs font-medium">Desayuno</span>
                 {!hotel.amenities.breakfast && <span className="text-[10px] text-gray-400">(No disp.)</span>}
               </div>
               <div className={`flex flex-col items-center justify-center p-4 rounded-xl border ${hotel.amenities.pool ? 'bg-wedding-50 border-wedding-200 text-wedding-800' : 'bg-gray-50 border-gray-100 text-gray-400 opacity-60'}`}>
                 <Waves size={24} className="mb-2" />
                 <span className="text-xs font-medium">Piscina</span>
                 {!hotel.amenities.pool && <span className="text-[10px] text-gray-400">(No disp.)</span>}
               </div>
            </div>
          </div>

          {/* Discount Section */}
          {hotel.discountCode && (
            <div className="mb-8 bg-orange-50 border border-orange-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-3 bg-white rounded-full text-orange-500 shadow-sm">
                <Ticket size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-orange-900 mb-1">Descuento disponible</h4>
                <p className="text-sm text-orange-800 opacity-90 mb-2">{hotel.discountNote}</p>
                <div className="flex items-center gap-3 bg-white/60 p-2 rounded-lg w-fit border border-orange-100">
                  <span className="font-mono font-bold text-lg text-orange-700 select-text !cursor-text px-1">
                    {hotel.discountCode}
                  </span>
                  <button 
                    onClick={handleCopyCode}
                    className="p-1.5 hover:bg-orange-100 rounded-md transition-colors text-orange-600"
                    title="Copiar al portapapeles"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-wedding-100">
            {hotel.bookingUrl ? (
               <a 
               href={hotel.bookingUrl}
               target="_blank"
               rel="noreferrer"
               className="flex-1 bg-wedding-900 hover:bg-wedding-800 text-white py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-wedding-900/20"
             >
               Ir a la web oficial <ExternalLink size={18} />
             </a>
            ) : null}
            
            {hotel.contactEmail && (
              <a 
              href={`mailto:${hotel.contactEmail}`}
              className="flex-1 bg-white border border-wedding-200 text-wedding-800 hover:bg-wedding-50 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              Contactar por Email <Mail size={18} />
            </a>
            )}
            
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ' ' + hotel.address)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-white border border-wedding-200 text-wedding-800 hover:bg-wedding-50 py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              Ver en Mapa <MapPin size={18} />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};