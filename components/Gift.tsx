import React, { useState, useEffect } from 'react';
import { SectionId } from '../types';
import { Gift as GiftIcon, Copy, Check } from 'lucide-react';

interface GiftProps {
  guestName?: string;
}

export const Gift: React.FC<GiftProps> = ({ guestName }) => {
  const [copied, setCopied] = useState(false);
  const [randomImage, setRandomImage] = useState<string>("");
  // Formato estándar: ESXX Entidad Oficina DC Cuenta
  const iban = "ES97 1583 0001 19 9151124946";

  const footerImages = [
    "https://cdn.shopify.com/s/files/1/0370/2466/1636/files/WhatsApp_Image_2026-01-14_at_17.32.16_3.jpg?v=1768427493",
    "https://cdn.shopify.com/s/files/1/0370/2466/1636/files/WhatsApp_Image_2026-01-14_at_17.32.16_5.jpg?v=1768427493",
    "https://cdn.shopify.com/s/files/1/0370/2466/1636/files/WhatsApp_Image_2026-01-14_at_17.32.16_2.jpg?v=1768427493",
    "https://cdn.shopify.com/s/files/1/0370/2466/1636/files/WhatsApp_Image_2026-01-14_at_17.32.16_1.jpg?v=1768427492",
    "https://cdn.shopify.com/s/files/1/0370/2466/1636/files/WhatsApp_Image_2026-01-14_at_17.32.16.jpg?v=1768427493",
    "https://cdn.shopify.com/s/files/1/0370/2466/1636/files/WhatsApp_Image_2026-01-14_at_17.32.16_4.jpg?v=1768427492"
  ];

  useEffect(() => {
    // Select random image on mount
    const randomIndex = Math.floor(Math.random() * footerImages.length);
    setRandomImage(footerImages[randomIndex]);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(iban);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id={SectionId.GIFT} className="py-20 px-6 bg-white relative">
      <div className="max-w-2xl mx-auto text-center mb-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-wedding-50 text-wedding-600 mb-8 border border-wedding-200">
          <GiftIcon size={32} />
        </div>
        
        <h2 className="font-serif text-3xl md:text-4xl text-wedding-900 mb-6">
          Regalo
        </h2>
        
        <p className="text-wedding-700 leading-relaxed mb-8 font-light italic">
          "Para nosotros{guestName ? `, ${guestName}` : ''}, vuestra presencia es el mejor regalo. <br/>
          No obstante, si deseáis tener un detalle con nosotros, os dejamos nuestro número de cuenta."
        </p>

        <div className="bg-wedding-50 border border-wedding-200 rounded-2xl p-8 shadow-sm max-w-lg mx-auto transform transition-all hover:scale-[1.01]">
          <p className="text-xs uppercase tracking-widest text-wedding-500 mb-2">Número de Cuenta (IBAN)</p>
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="font-mono text-xl md:text-2xl text-wedding-900 font-medium tracking-tight break-all sm:break-normal">
              {iban}
            </span>
            <button 
              onClick={handleCopy}
              className="p-2 text-wedding-500 hover:text-accent hover:bg-wedding-100 rounded-lg transition-all flex-shrink-0"
              title="Copiar número"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
          <p className="text-sm text-wedding-400 mt-4">
            Titulares: Belén y David
          </p>
        </div>
      </div>

      {/* Random Photo Banner */}
      {randomImage && (
        <div className="max-w-5xl mx-auto mt-12 mb-4 animate-fade-in-up">
           <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden shadow-xl group">
             <img 
               src={randomImage} 
               alt="Belén y David" 
               className="w-full h-full object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-wedding-900/30 to-transparent pointer-events-none" />
           </div>
        </div>
      )}
    </section>
  );
};