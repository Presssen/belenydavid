import React from 'react';
import { UserCog } from 'lucide-react';

interface FooterProps {
  onEditName?: () => void;
  guestName?: string;
}

export const Footer: React.FC<FooterProps> = ({ onEditName, guestName }) => {
  return (
    <footer className="bg-wedding-900 text-wedding-100 py-12 px-6 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="font-script text-4xl md:text-5xl mb-6">Belén & David</h2>
        <p className="font-sans text-xs uppercase tracking-widest opacity-60 mb-8">
          Sanlúcar de Barrameda • 2026
        </p>
        <div className="w-8 h-px bg-wedding-700 mx-auto mb-8"></div>
        <p className="text-sm font-light opacity-80 mb-12">
          Esperamos celebrar este día tan especial con vosotros.
        </p>

        {onEditName && (
          <button
            onClick={onEditName}
            className="group flex items-center gap-2 text-[10px] uppercase tracking-widest text-wedding-500 hover:text-wedding-300 transition-colors border-t border-transparent hover:border-wedding-700 pt-4 mt-4"
          >
            <UserCog size={14} className="group-hover:scale-110 transition-transform" />
            {guestName ? `¿No eres ${guestName}? Cambiar nombre` : 'Cambiar nombre'}
          </button>
        )}
      </div>
    </footer>
  );
};