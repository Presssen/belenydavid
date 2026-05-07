import React, { useState } from 'react';
import { Plus, MapPin, Wine, PartyPopper, X, Navigation, Car } from 'lucide-react';

export const QuickAccessFAB: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const locations = [
    {
      label: "Ir a la Finca",
      subLabel: "Finca Barón",
      icon: <Wine size={20} />,
      url: "https://www.google.com/maps/search/?api=1&query=Finca+Baron+Sanlucar+de+Barrameda",
      color: "bg-wedding-800"
    },
    {
      label: "Ir a la Iglesia",
      subLabel: "Santo Domingo",
      icon: <MapPin size={20} />,
      url: "https://www.google.com/maps/search/?api=1&query=Iglesia+de+Santo+Domingo+Sanlucar+de+Barrameda",
      color: "bg-wedding-800"
    },
    {
      label: "Parking",
      subLabel: "Económico",
      icon: <Car size={20} />,
      url: "https://www.google.com/maps/search/?api=1&query=Parking+Parkia+Sanlucar+de+Barrameda",
      color: "bg-blue-600"
    },
    {
      label: "Preboda",
      subLabel: "Próximamente",
      icon: <PartyPopper size={20} />,
      url: null, // Disabled
      color: "bg-wedding-400"
    }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[80] flex flex-col items-end gap-3 font-sans">
      
      {/* Menu Items */}
      <div className={`flex flex-col items-end gap-3 transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        {locations.map((loc, index) => (
          <div key={index} className="flex items-center gap-3 group">
            {/* Label */}
            <div className="bg-white px-3 py-1.5 rounded-lg shadow-md border border-wedding-100 text-right transform transition-all group-hover:-translate-x-1">
              <span className="block text-sm font-semibold text-wedding-900 leading-none">
                {loc.label}
              </span>
              {loc.subLabel && (
                <span className="block text-[10px] text-wedding-500 font-medium uppercase tracking-wide mt-0.5">
                  {loc.subLabel}
                </span>
              )}
            </div>

            {/* Button */}
            {loc.url ? (
              <a
                href={loc.url}
                target="_blank"
                rel="noreferrer"
                className={`${loc.color} text-white p-3 rounded-full shadow-lg hover:brightness-110 transition-all active:scale-95 flex items-center justify-center`}
              >
                {loc.icon}
              </a>
            ) : (
              <button
                disabled
                className={`${loc.color} text-white p-3 rounded-full shadow-lg opacity-80 cursor-not-allowed flex items-center justify-center grayscale-[30%]`}
              >
                {loc.icon}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="relative flex items-center justify-center">
        {/* Hint Message Bubble */}
        {showHint && !isOpen && (
          <div className="absolute right-full mr-5 whitespace-nowrap z-50 animate-fade-in-up origin-right">
            <div className="bg-white/95 backdrop-blur-sm pl-4 pr-2 py-2.5 rounded-xl shadow-2xl border border-wedding-200 flex items-center gap-3">
              <span className="text-sm font-semibold text-wedding-800 tracking-tight">¿A dónde quieres ir?</span>
              <div className="h-4 w-px bg-wedding-200"></div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHint(false);
                }} 
                className="p-1 text-wedding-400 hover:text-red-500 hover:bg-wedding-50 rounded-full transition-colors"
                title="Cerrar mensaje"
              >
                <X size={14} />
              </button>
              
              {/* Triangle Arrow */}
              <div className="absolute top-1/2 -right-1.5 -mt-1.5 w-3 h-3 bg-white border-t border-r border-wedding-200 rotate-45 transform"></div>
            </div>
          </div>
        )}

        {/* Pulse effect background (visible only when closed) */}
        {!isOpen && (
          <div className="absolute inset-0 bg-wedding-900/40 rounded-full animate-ping pointer-events-none scale-125" />
        )}

        {/* Main Trigger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-16 h-16 rounded-full shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] flex items-center justify-center text-white transition-all duration-300 z-50 relative overflow-hidden
            ${isOpen 
              ? 'bg-wedding-700 rotate-45' 
              : 'bg-wedding-900 hover:scale-110 hover:bg-wedding-800 animate-attention'}
          `}
        >
          {isOpen ? (
            <Plus size={32} />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <Navigation size={28} className="transform rotate-0" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
};