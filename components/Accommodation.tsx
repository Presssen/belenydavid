import React from 'react';
import { SectionId } from '../types';
import { hotels } from '../data/hotels';
import { HotelCard } from './HotelCard';
import { ExternalLink, Home } from 'lucide-react';

export const Accommodation: React.FC = () => {
  return (
    <section id={SectionId.HOTELS} className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
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
          
          <div className="bg-wedding-50 p-4 rounded-xl inline-block border border-wedding-100">
            <p className="text-sm text-wedding-800 font-medium mb-3">
              ¿Prefieres otra cosa? Puedes buscar apartamentos o más hoteles en:
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="https://www.airbnb.es/s/Sanl%C3%BAcar-de-Barrameda--Spain/homes" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-wedding-200 rounded-lg text-sm text-[#FF385C] font-semibold hover:bg-gray-50 transition-colors"
              >
                <Home size={14} /> Airbnb
              </a>
              <a 
                href="https://www.booking.com/searchresults.es.html?ss=Sanl%C3%BAcar+de+Barrameda" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-wedding-200 rounded-lg text-sm text-[#003580] font-semibold hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold">B.</span> Booking
              </a>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
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
    </section>
  );
};