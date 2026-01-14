import React from 'react';
import { SectionId } from '../types';
import { MapPin, Clock, CalendarHeart, Wine, CalendarPlus, Navigation } from 'lucide-react';

export const EventDetails: React.FC = () => {
  // Configuración del evento para Google Calendar
  const eventTitle = encodeURIComponent("Boda Belén & David");
  const eventDates = "20260919/20260920"; // Formato YYYYMMDD/YYYYMMDD (día siguiente) para evento de todo el día
  const eventLocation = encodeURIComponent("Iglesia de Santo Domingo, C. Santo Domingo, 11540 Sanlúcar de Barrameda, Cádiz");
  const eventDetails = encodeURIComponent(
`CEREMONIA: 12:00h en Iglesia de Santo Domingo.

BANQUETE: A continuación en Bodegas Barón.

¡Os esperamos en Sanlúcar de Barrameda!`
  );

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${eventDates}&details=${eventDetails}&location=${eventLocation}`;

  return (
    <section id={SectionId.DETAILS} className="py-24 px-6 bg-wedding-50 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        
        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 border border-wedding-300 rounded-full text-xs font-semibold text-wedding-600 tracking-wider uppercase mb-6 bg-white/50 backdrop-blur-sm">
            Los Detalles
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-wedding-900">
            Dónde & Cuándo
          </h2>
        </div>

        {/* Timeline Container */}
        <div className="space-y-16">
          
          {/* Church Section */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-wedding-100 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-wedding-100 text-wedding-600 mb-4">
                <CalendarHeart size={24} />
              </div>
              <h3 className="font-serif text-3xl text-wedding-900 mb-2">La Ceremonia</h3>
              <p className="text-xl text-wedding-600 font-medium mb-4">Sábado, 19 de Septiembre • 12:00h</p>
              <div className="text-wedding-700 mb-6">
                <p className="font-serif text-lg">Iglesia de Santo Domingo</p>
                <p className="text-sm opacity-80">Sanlúcar de Barrameda</p>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Iglesia+de+Santo+Domingo+Sanlucar+de+Barrameda"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-wedding-900 text-white rounded-lg text-sm font-medium hover:bg-wedding-800 transition-colors"
                >
                  <Navigation size={16} />
                  Cómo llegar
                </a>
                <a 
                  href={calendarUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-wedding-200 text-wedding-900 rounded-lg text-sm font-medium hover:bg-wedding-50 transition-colors"
                >
                  <CalendarPlus size={16} />
                  Guardar fecha
                </a>
              </div>
            </div>
            
            {/* Church Image */}
            <div className="w-full md:w-1/3 h-64 md:h-auto min-h-[250px] rounded-2xl overflow-hidden relative">
               <img 
                src="https://cdn.shopify.com/s/files/1/0370/2466/1636/files/iglesia-santo-domingo_1.jpg?v=1768426281" 
                alt="Iglesia Santo Domingo" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Connection Line */}
          <div className="w-px h-16 bg-wedding-300 mx-auto"></div>

          {/* Reception Section */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-wedding-100 flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
            <div className="flex-1 text-center md:text-right">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 text-accent mb-4">
                <Wine size={24} />
              </div>
              <h3 className="font-serif text-3xl text-wedding-900 mb-2">El Banquete</h3>
              <p className="text-xl text-wedding-600 font-medium mb-4">A continuación</p>
              <div className="text-wedding-700 mb-6">
                <p className="font-serif text-lg">Bodegas Barón</p>
                <p className="text-sm opacity-80">Celebración entre botas centenarias</p>
              </div>

               <a 
                  href="https://www.google.com/maps/search/?api=1&query=Bodegas+Baron+Sanlucar"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-wedding-900 text-white rounded-lg text-sm font-medium hover:bg-wedding-800 transition-colors"
                >
                  <Navigation size={16} />
                  Ver ubicación
                </a>
            </div>
             {/* Bodega Image */}
             <div className="w-full md:w-1/3 h-64 md:h-auto min-h-[250px] rounded-2xl overflow-hidden relative">
               <img 
                src="https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&q=80&w=800" 
                alt="Bodegas Barón" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

        </div>

        <div className="mt-16 text-center">
          <p className="font-serif text-wedding-800 italic text-lg opacity-80">
            "El resto de detalles se irán avisando más adelante"
          </p>
        </div>
      </div>
    </section>
  );
};