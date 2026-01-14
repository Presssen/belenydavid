import React from 'react';
import { SectionId } from '../types';
import { ChevronDown } from 'lucide-react';

interface HeroProps {
  guestName?: string;
}

export const Hero: React.FC<HeroProps> = ({ guestName }) => {
  const imageUrl = "https://cdn.shopify.com/s/files/1/0370/2466/1636/files/Boda.jpg?v=1768409111";

  return (
    <section id={SectionId.HERO} className="relative h-screen min-h-[700px] w-full overflow-hidden flex items-center justify-center bg-wedding-900">
      {/* Blurred Background Layer (fills screen) */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imageUrl} 
          alt="Background" 
          className="w-full h-full object-cover blur-2xl scale-110 opacity-50 grayscale-[20%]"
        />
      </div>

      {/* Main Image Layer (Constrained Width) */}
      <div className="absolute inset-0 z-0 flex justify-center">
        <div className="w-full max-w-[1600px] h-full relative shadow-2xl">
           <img 
            src={imageUrl} 
            alt="Belén y David" 
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>

      {/* Overlay Gradients (Over both layers for consistent text contrast) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-wedding-900/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 animate-fade-in-up flex flex-col items-center max-w-4xl mx-auto">
        <p className="font-sans text-sm md:text-lg tracking-[0.2em] uppercase mb-6 opacity-95 drop-shadow-md">
          {guestName ? `Hola ${guestName}, nos casamos` : 'Nos casamos'}
        </p>
        <h1 className="font-script text-7xl md:text-9xl mb-8 drop-shadow-lg text-white">
          Belén <span className="text-white/90">&</span> David
        </h1>
        
        {/* Date Container - Liquid Glass */}
        <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl py-6 px-8 md:px-12 shadow-2xl">
          <div className="w-16 h-[1px] bg-white/80 mx-auto mb-4"></div>
          <p className="font-serif text-2xl md:text-4xl tracking-wide font-medium text-white drop-shadow-md">
            19 • Septiembre • 2026
          </p>
          <p className="font-sans text-sm md:text-base uppercase tracking-widest mt-2 opacity-90">
            Sanlúcar de Barrameda
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce text-white/80">
        <ChevronDown size={32} strokeWidth={1.5} />
      </div>
    </section>
  );
};