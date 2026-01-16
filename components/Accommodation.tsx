import React, { useState } from 'react';
import { SectionId, Hotel } from '../types';
import { hotels } from '../data/hotels';
import { HotelCard } from './HotelCard';
import { HotelDetailsModal } from './HotelDetailsModal';
import { AccommodationTipsModal } from './AccommodationTipsModal';
import { ExternalLink, Home, ChevronDown, Lightbulb } from 'lucide-react';

export const Accommodation: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showTips, setShowTips] = useState(false);
  
  // Mostrar solo los primeros 4 si no se ha pulsado "Ver más"
  const displayedHotels = showAll ? hotels : hotels.slice(0, 4);

  return (
    <section id={SectionId.HOTELS} className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block py-1 px-3 border border-wedding-300 rounded-full text-xs font-semibold text-wedding-600 tracking-wider uppercase mb-6">
            Alojamiento
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-wedding-900 mb-6">
            Dónde descansar
          </h2>
          <p className="text-wedding-700 leading-relaxed mb-6">
            Hemos seleccionado estos hoteles pensando en vuestra comodidad y cercanía. 
            Son nuestras recomendaciones principales, pero Sanlúcar ofrece muchas más opciones.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button
                onClick={() => setShowTips(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-wedding-100 text-wedding-800 rounded-full text-sm font-semibold hover:bg-wedding-200 transition-colors shadow-sm"
            >
                <Lightbulb size={18} className="text-accent" />
                Consejos e info
            </button>

            <div className="flex gap-3">
                <a 
                    href="https://www.airbnb.es/s/Sanl%C3%BAcar-de-Barrameda--Spain/homes" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-wedding-200 rounded-full text-sm text-[#FF385C] font-semibold hover:bg-gray-50 transition-colors"
                >
                    <Home size={14} /> Airbnb
                </a>
                <a 
                    href="https://www.booking.com/searchresults.es.html?ss=Sanl%C3%BAcar+de+Barrameda" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-wedding-200 rounded-full text-sm text-[#003580] font-semibold hover:bg-gray-50 transition-colors"
                >
                    <span className="font-bold">B.</span> Booking
                </a>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedHotels.map((hotel) => (
            <HotelCard 
              key={hotel.id} 
              hotel={hotel} 
              onShowDetails={(h) => setSelectedHotel(h)}
            />
          ))}
        </div>

        {/* Botón Ver Más */}
        {!showAll && hotels.length > 4 && (
          <div className="mt-12 text-center animate-fade-in-up">
            <button
              onClick={() => setShowAll(true)}
              className="group inline-flex items-center gap-2 px-8 py-3 bg-white border border-wedding-300 text-wedding-800 rounded-full text-sm font-semibold hover:bg-wedding-50 hover:border-wedding-400 transition-all shadow-sm hover:shadow-md"
            >
              Ver más alojamientos
              <span className="text-xs bg-wedding-100 px-2 py-0.5 rounded-full text-wedding-600 group-hover:bg-wedding-200 transition-colors">
                +{hotels.length - 4}
              </span>
              <ChevronDown size={16} className="text-wedding-400 group-hover:text-wedding-600 transition-colors" />
            </button>
          </div>
        )}

        {/* Footer Note */}
        <div className={`text-center transition-all duration-500 ${showAll ? 'mt-16' : 'mt-8'}`}>
          <a 
            href="https://www.google.com/maps/search/hoteles+en+Sanlúcar+de+Barrameda" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-wedding-900 text-white rounded-full font-medium text-sm hover:bg-wedding-800 transition-transform hover:-translate-y-0.5 shadow-lg shadow-wedding-900/20"
          >
            Ver más opciones en Google Maps
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* Hotel Details Modal */}
      {selectedHotel && (
        <HotelDetailsModal 
          hotel={selectedHotel} 
          onClose={() => setSelectedHotel(null)} 
        />
      )}

      {/* Tips Modal */}
      {showTips && (
        <AccommodationTipsModal onClose={() => setShowTips(false)} />
      )}
    </section>
  );
};