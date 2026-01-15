import React, { useState, useEffect } from 'react';
import { SectionId } from '../types';
import { MapPin, Clock, CalendarHeart, Wine, CalendarPlus, Navigation, ChevronLeft, ChevronRight } from 'lucide-react';

const RECEPTION_IMAGES = [
  "https://cdn.shopify.com/s/files/1/0370/2466/1636/files/e80e68fd-32d8-4a03-afd6-46d5b8c91434_1_226070-168667643670072.jpg?v=1768468031",
  "https://cdn.shopify.com/s/files/1/0370/2466/1636/files/53931212-0da1-41e3-b7d1-8f6dc9e4a0ef_1_226070-168667643190366.jpg?v=1768468019",
  "https://cdn.shopify.com/s/files/1/0370/2466/1636/files/77-2_1_226070-173736852699558.jpg?v=1768468018",
  "https://cdn.shopify.com/s/files/1/0370/2466/1636/files/5e563bd9-fc41-437d-89d4-c7fb5cf13777_1_226070-168667641749853.jpg?v=1768468002"
];

export const EventDetails: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % RECEPTION_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev + 1) % RECEPTION_IMAGES.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => (prev - 1 + RECEPTION_IMAGES.length) % RECEPTION_IMAGES.length);
  };

  // Configuración del evento para Google Calendar
  const eventTitle = encodeURIComponent("Boda Belén & David");
  const eventDates = "20260919/20260920";
  const eventLocation = encodeURIComponent("Iglesia de Santo Domingo, C. Santo Domingo, 11540 Sanlúcar de Barrameda, Cádiz");
  const eventDetails = encodeURIComponent(
`CEREMONIA: 12:00h en Iglesia de Santo Domingo.

BANQUETE: A continuación en Finca Barón.

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
                <p className="font-serif text-lg">Finca Barón</p>
                <p className="text-sm opacity-80">Celebración al aire libre con encanto</p>
              </div>

               <a 
                  href="https://www.google.com/maps/search/?api=1&query=Finca+Baron+Sanlucar+de+Barrameda"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-wedding-900 text-white rounded-lg text-sm font-medium hover:bg-wedding-800 transition-colors"
                >
                  <Navigation size={16} />
                  Ver ubicación
                </a>
            </div>
             {/* Finca Image Slider */}
             <div className="w-full md:w-1/3 h-64 md:h-auto min-h-[250px] rounded-2xl overflow-hidden relative group">
                <div className="absolute inset-0 transition-opacity duration-1000">
                  {RECEPTION_IMAGES.map((img, idx) => (
                    <img 
                      key={idx}
                      src={img} 
                      alt={`Finca Barón ${idx + 1}`} 
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))}
                </div>
                
                {/* Navigation Arrows (Visible on hover) */}
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 z-10 backdrop-blur-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 z-10 backdrop-blur-sm"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {RECEPTION_IMAGES.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/40'}`} 
                    />
                  ))}
                </div>
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