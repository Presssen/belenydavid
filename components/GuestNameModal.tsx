import React, { useState } from 'react';
import { Heart } from 'lucide-react';

interface GuestNameModalProps {
  onNameSubmit: (name: string) => void;
}

export const GuestNameModal: React.FC<GuestNameModalProps> = ({ onNameSubmit }) => {
  const [name, setName] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsExiting(true);
      setTimeout(() => {
        onNameSubmit(name.trim());
      }, 500); // Wait for animation
    }
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-wedding-900 flex items-center justify-center px-6 transition-opacity duration-500 ${isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="max-w-md w-full text-center text-white animate-fade-in-up">
        
        <div className="mb-8 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
             <Heart className="text-white" fill="currentColor" size={24} />
          </div>
        </div>

        <h2 className="font-script text-5xl mb-4">¡Bienvenido!</h2>
        <p className="font-serif text-xl opacity-90 mb-8">
          Nos hace mucha ilusión compartir este día contigo. <br/>
          ¿Cómo te llamas?
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Escribe tu nombre aquí..."
              className="w-full bg-transparent border-b-2 border-white/30 text-center text-2xl py-3 text-white placeholder-white/40 focus:outline-none focus:border-white transition-colors font-serif"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="px-8 py-3 bg-white text-wedding-900 rounded-full font-medium tracking-wide uppercase text-sm hover:bg-wedding-100 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-black/20"
          >
            Entrar a la invitación
          </button>
        </form>
      </div>
    </div>
  );
};