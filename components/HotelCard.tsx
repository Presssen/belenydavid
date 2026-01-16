import React, { useState } from 'react';
import { Hotel } from '../types';
import { Star, MapPin, Car, Coffee, Waves, Wifi, ExternalLink, Ticket, Mail, ThumbsUp, Copy, Check, Info } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
  onShowDetails?: (hotel: Hotel) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onShowDetails }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hotel.discountCode) {
      navigator.clipboard.writeText(hotel.discountCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-wedding-100 flex flex-col h-full relative">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onShowDetails?.(hotel)}>
        <img 
          src={hotel.imageUrl} 
          alt={hotel.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Star Rating Badge */}
        {hotel.stars && hotel.stars > 0 ? (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-wedding-800 flex items-center gap-1 shadow-sm z-10">
            <span>{hotel.stars}</span>
            <Star size={10} fill="currentColor" className="text-accent" />
          </div>
        ) : null}
        
        {/* Recommended Badge */}
        {hotel.recommended && (
          <div className="absolute top-3 left-3 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1 z-10">
            <ThumbsUp size={12} />
            Recomendado
          </div>
        )}

        {/* Overlay on hover for 'View More' */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onShowDetails?.(hotel);
              }}
              className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/90 text-wedding-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg flex items-center gap-2"
            >
              <Info size={14} /> Ver más detalles
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl text-wedding-900 font-medium leading-tight cursor-pointer hover:text-wedding-600 transition-colors" onClick={() => onShowDetails?.(hotel)}>
            {hotel.name}
          </h3>
        </div>

        <div className="flex items-center text-wedding-500 text-xs mb-4">
          <MapPin size={12} className="mr-1" />
          <span>{hotel.address}</span>
          <span className="mx-2">•</span>
          <span className="font-semibold text-accent">{hotel.walkingDistanceMinutes} min a pie</span>
        </div>

        <p className="text-wedding-700 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
          {hotel.description}
        </p>

        {/* Price & Amenities */}
        <div className="border-t border-wedding-100 pt-4 mt-auto">
          <div className="flex justify-between items-center mb-4">
             <span className="text-lg font-serif font-semibold text-wedding-900">
               {hotel.priceRange} 
               <span className="text-xs font-sans text-wedding-400 font-normal ml-1">/noche</span>
             </span>
             <div className="flex gap-2 text-wedding-400">
               {hotel.amenities.parking && (
                 <span title="Parking">
                   <Car size={16} className="hover:text-wedding-600" />
                 </span>
               )}
               {hotel.amenities.breakfast && (
                 <span title="Desayuno">
                   <Coffee size={16} className="hover:text-wedding-600" />
                 </span>
               )}
               {hotel.amenities.pool && (
                 <span title="Piscina">
                   <Waves size={16} className="hover:text-wedding-600" />
                 </span>
               )}
               {hotel.amenities.wifi && (
                 <span title="Wifi">
                   <Wifi size={16} className="hover:text-wedding-600" />
                 </span>
               )}
             </div>
          </div>

          {/* Special Notes (Codes) */}
          {hotel.discountCode && (
              <div className="bg-orange-50 border border-orange-100 p-2 rounded text-xs text-orange-800 flex items-start gap-2 mb-3 relative group/code">
                <Ticket size={14} className="mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold select-text !cursor-text">CÓDIGO: {hotel.discountCode}</span>
                    <button 
                      onClick={handleCopyCode}
                      className="p-1 hover:bg-orange-100 rounded transition-colors text-orange-600"
                      title="Copiar código"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                  <span className="opacity-80 block">{hotel.discountNote}</span>
                  {hotel.specialNote && <span className="block mt-1 text-[10px] italic">{hotel.specialNote}</span>}
                </div>
              </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
             <button
               onClick={() => onShowDetails?.(hotel)}
               className="col-span-1 bg-white border border-wedding-200 text-wedding-700 py-2 rounded-lg text-sm font-medium hover:bg-wedding-50 transition-colors"
             >
               Más detalles
             </button>

            {hotel.bookingUrl ? (
               <a 
               href={hotel.bookingUrl}
               target="_blank"
               rel="noreferrer"
               className="col-span-1 bg-wedding-900 hover:bg-wedding-800 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
             >
               Reservar <ExternalLink size={14} />
             </a>
            ) : hotel.contactEmail ? (
              <a 
              href={`mailto:${hotel.contactEmail}`}
              className="col-span-1 bg-wedding-900 hover:bg-wedding-800 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              Email <Mail size={14} />
            </a>
            ) : <div/>}
          </div>
        </div>
      </div>
    </div>
  );
};