import React, { useEffect, useState } from 'react';
import { X, CalendarClock, ChevronRight } from 'lucide-react';
import { SectionId } from '../types';

interface WelcomeModalProps {
  guestName?: string;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ guestName }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Small delay to appear after load (and after name entry animation)
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const scrollToHotels = () => {
    handleClose();
    const element = document.getElementById(SectionId.HOTELS);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-wedding-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-fade-in-up border border-wedding-100">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-wedding-400 hover:text-wedding-800 hover:bg-wedding-50 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CalendarClock size={32} />
          </div>

          <h3 className="font-serif text-2xl text-wedding-900 mb-3">
            {guestName ? `¡Hola ${guestName}!` : '¡Importante!'}
          </h3>
          
          <p className="text-wedding-600 mb-6 leading-relaxed">
            Sanlúcar es un destino muy solicitado. Por favor, <strong>reservad vuestro alojamiento cuanto antes</strong> para aseguraros las mejores opciones.
          </p>

          <div className="space-y-3">
            <button 
              onClick={scrollToHotels}
              className="w-full py-3 bg-wedding-900 text-white rounded-xl font-medium shadow-lg shadow-wedding-900/20 hover:bg-wedding-800 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Ver Alojamientos Recomendados <ChevronRight size={16} />
            </button>
            <button 
              onClick={handleClose}
              className="w-full py-3 text-wedding-500 hover:text-wedding-800 text-sm font-medium"
            >
              Entendido, lo haré luego
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};