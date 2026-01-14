import React from 'react';
import { Hotel } from '../types';
import { Star, MapPin, Car, Coffee, Waves, Wifi, ExternalLink, Ticket, Mail, ThumbsUp } from 'lucide-react';

interface HotelCardProps {
  hotel: Hotel;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-wedding-100 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={hotel.imageUrl} 
          alt={hotel.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Star Rating Badge */}
        {hotel.stars && hotel.stars > 0 ? (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold text-wedding-800 flex items-center gap-1 shadow-sm">
            <span>{hotel.stars}</span>
            <Star size={10} fill="currentColor" className="text-accent" />
          </div>
        ) : null}
        
        {/* Recommended Badge */}
        {hotel.recommended && (
          <div className="absolute top-3 left-3 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
            <ThumbsUp size={12} />
            Recomendado
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl text-wedding-900 font-medium leading-tight">
            {hotel.name}
          </h3>
        </div>

        <div className="flex items-center text-wedding-500 text-xs mb-4">
          <MapPin size={12} className="mr-1" />
          <span>{hotel.address}</span>
          <span className="mx-2">•</span>
          <span className="font-semibold text-accent">{hotel.walkingDistanceMinutes} min a pie</span>
        </div>

        <p className="text-wedding-700 text-sm leading-relaxed mb-4 flex-1">
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
              <div className="bg-orange-50 border border-orange-100 p-2 rounded text-xs text-orange-800 flex items-start gap-2 mb-3">
                <Ticket size={14} className="mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-bold block">CÓDIGO: {hotel.discountCode}</span>
                  <span className="opacity-80">{hotel.discountNote}</span>
                  {hotel.specialNote && <span className="block mt-1 text-[10px] italic">{hotel.specialNote}</span>}
                </div>
              </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-1 gap-2">
            {hotel.bookingUrl ? (
               <a 
               href={hotel.bookingUrl}
               target="_blank"
               rel="noreferrer"
               className="w-full text-center bg-wedding-900 hover:bg-wedding-800 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
             >
               Reservar / Web <ExternalLink size={14} />
             </a>
            ) : null}
            
            {hotel.contactEmail && (
              <a 
              href={`mailto:${hotel.contactEmail}`}
              className="w-full text-center border border-wedding-200 hover:bg-wedding-50 text-wedding-800 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Mail size={14} /> Email
            </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};