import React from 'react';
import { SectionId } from '../types';
import { Utensils, Sunset, Wine, Map, Castle, TreePine, ShoppingBag, ArrowRight } from 'lucide-react';

export const Activities: React.FC = () => {
  const activities = [
    {
      title: "Tapear en Plaza del Cabildo",
      description: "El corazón de Sanlúcar. Disfruta de las tortillitas de camarones y manzanilla en un ambiente único.",
      icon: <Utensils className="w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Atardecer en Bajo de Guía",
      description: "Pasea frente al Coto de Doñana y cena en los antiguos barrios de pescadores con vistas al río.",
      icon: <Sunset className="w-5 h-5" />,
      image: "https://cdn.shopify.com/s/files/1/0370/2466/1636/files/Carreras_Caballos_Sanlucar_MdLV.jpg?v=1768427096"
    },
    {
      title: "Visita a Bodegas",
      description: "Sanlúcar es tierra de Manzanilla. Visitar una bodega centenaria es una experiencia obligatoria.",
      icon: <Wine className="w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Palacio Ducal de Medina Sidonia",
      description: "Descubre la historia de la ciudad paseando por sus jardines y arquitectura histórica.",
      icon: <Map className="w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Castillo de Santiago",
      description: "Fortaleza del siglo XV. Ofrece visitas guiadas y unas vistas panorámicas increíbles de la ciudad y el río.",
      icon: <Castle className="w-5 h-5" />,
      image: "https://cdn.shopify.com/s/files/1/0370/2466/1636/files/castillo-sirena.jpg?v=1768431216"
    },
    {
      title: "Parque Nacional de Doñana",
      description: "Cruza el río en la barcaza y explora una de las reservas naturales más importantes de Europa en 4x4.",
      icon: <TreePine className="w-5 h-5" />,
      image: "https://cdn.shopify.com/s/files/1/0370/2466/1636/files/flamencos-pn-donana-s316829864.avif?v=1768431263"
    },
    {
      title: "Mercado de Abastos",
      description: "Para los amantes del producto local. Pescado fresco, verduras de la huerta y un ambiente muy auténtico.",
      icon: <ShoppingBag className="w-5 h-5" />,
      image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <section id={SectionId.ACTIVITIES} className="py-24 bg-wedding-100 overflow-hidden">
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block py-1 px-3 border border-wedding-300 rounded-full text-xs font-semibold text-wedding-600 tracking-wider uppercase mb-6 bg-white/50 backdrop-blur-sm">
              Sanlúcar de Barrameda
            </span>
            <h2 className="font-serif text-4xl md:text-5xl text-wedding-900 mb-6">
              Qué hacer
            </h2>
            <p className="text-wedding-700 leading-relaxed">
              Si tenéis tiempo libre, no os perdáis estos planes para disfrutar de la esencia de nuestra ciudad.
            </p>
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative w-full group/container">
            {/* Gradient masks */}
            <div className="absolute left-0 top-0 bottom-0 w-6 md:w-24 bg-gradient-to-r from-wedding-100 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-6 md:w-24 bg-gradient-to-l from-wedding-100 to-transparent z-10 pointer-events-none" />

            <div 
              className="flex gap-4 md:gap-6 overflow-x-auto pb-12 pt-4 px-8 md:px-12 snap-x snap-mandatory scrollbar-hide"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {/* Hide scrollbar styles */}
              <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {activities.map((activity, index) => (
                <div 
                  key={index} 
                  className="w-60 md:w-72 flex-none snap-center bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group select-none hover:-translate-y-1 flex flex-col"
                >
                  <div className="h-80 md:h-96 overflow-hidden relative">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                    <div className="absolute top-4 right-4 bg-white/90 p-2.5 rounded-full text-wedding-800 shadow-sm backdrop-blur-sm z-10">
                      {activity.icon}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col relative">
                    {/* Negative margin to pull text up slightly over image if desired, or just clean layout */}
                    <h3 className="font-serif text-xl text-wedding-900 mb-3 group-hover:text-accent transition-colors leading-tight">{activity.title}</h3>
                    <p className="text-wedding-600 text-sm leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Spacer for right padding visual balance */}
              <div className="w-4 md:w-12 flex-none" />
            </div>
        </div>
        
        <div className="flex justify-center gap-2 text-wedding-400 text-sm animate-pulse px-4 opacity-80">
            <ArrowRight className="rotate-180" size={16} />
            <span>Desliza para descubrir</span>
            <ArrowRight size={16} />
        </div>
      </div>
    </section>
  );
};