import React, { useState } from 'react';
import { Plus, MapPin, Wine, PartyPopper, X, Navigation } from 'lucide-react';

export const QuickAccessFAB: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const locations = [
    {
      label: "Ir a la Finca",
      subLabel: "Bodegas Barón",
      icon: <Wine size={20} />,
      url: "https://www.google.com/maps/search/?api=1&query=Bodegas+Baron+Sanlucar",
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

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-white transition-all duration-300 z-50
          ${isOpen ? 'bg-wedding-700 rotate-45' : 'bg-wedding-900 hover:scale-105'}
        `}
      >
        {isOpen ? <Plus size={28} /> : <Navigation size={24} className="ml-0.5 mt-0.5" />}
      </button>
    </div>
  );
};