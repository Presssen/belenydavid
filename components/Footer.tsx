import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-wedding-900 text-wedding-100 py-12 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-script text-4xl md:text-5xl mb-6">Belén & David</h2>
        <p className="font-sans text-xs uppercase tracking-widest opacity-60 mb-8">
          Sanlúcar de Barrameda • 2026
        </p>
        <div className="w-8 h-px bg-wedding-700 mx-auto mb-8"></div>
        <p className="text-sm font-light opacity-80">
          Esperamos celebrar este día tan especial con vosotros.
        </p>
      </div>
    </footer>
  );
};