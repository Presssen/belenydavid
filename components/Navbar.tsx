import React, { useState, useEffect } from 'react';
import { SectionId, ViewState } from '../types';
import { Menu, X, Car } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [activeSection, setActiveSection] = useState<SectionId>(SectionId.HERO);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (id: SectionId) => {
    if (currentView !== 'home') {
      onNavigate('home');
      // Esperar un tick para que se renderice la home antes de hacer scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(id);
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(id);
      }
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: SectionId.HERO, label: 'Inicio' },
    { id: SectionId.DETAILS, label: 'La Boda' },
    { id: SectionId.HOTELS, label: 'Hoteles' },
    { id: SectionId.ACTIVITIES, label: 'Planes' },
    { id: SectionId.GIFT, label: 'Regalo' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
      <nav 
        className={`
          pointer-events-auto
          transition-all duration-500 ease-out
          ${scrolled ? 'py-3 px-4 md:px-6' : 'py-4 px-6 md:px-8'}
          backdrop-blur-md bg-white/80 
          border border-white/40
          rounded-full shadow-lg shadow-black/5
          flex items-center justify-between gap-4 md:gap-8
          max-w-3xl w-full
        `}
      >
        {/* Logo / Initials */}
        <div 
          className="font-script text-2xl text-wedding-800 cursor-pointer select-none"
          onClick={() => handleNavigation(SectionId.HERO)}
        >
          B <span className="text-accent">&</span> D
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={`
                text-sm font-medium tracking-wide transition-colors
                ${activeSection === item.id && currentView === 'home'
                  ? 'text-wedding-900 font-semibold' 
                  : 'text-wedding-600 hover:text-wedding-900'}
              `}
            >
              {item.label}
            </button>
          ))}
          
          <div className="h-4 w-px bg-wedding-300"></div>

          {/* Carpool Button Desktop */}
          <button
            onClick={() => {
              onNavigate('carpool');
              setIsMobileMenuOpen(false);
            }}
            className={`
              flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-all
              ${currentView === 'carpool' 
                ? 'bg-wedding-900 text-white shadow-md' 
                : 'bg-wedding-100 text-wedding-800 hover:bg-wedding-200'}
            `}
          >
            <Car size={16} />
            <span>Coche</span>
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-3">
           {/* Carpool Button Mobile Icon */}
           <button
            onClick={() => {
              onNavigate('carpool');
              setIsMobileMenuOpen(false);
            }}
            className={`
              p-2 rounded-full transition-all
              ${currentView === 'carpool' 
                ? 'bg-wedding-900 text-white' 
                : 'bg-wedding-100 text-wedding-800'}
            `}
          >
            <Car size={18} />
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-wedding-800 focus:outline-none p-1"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-24 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-4 flex flex-col gap-2 pointer-events-auto md:hidden animate-fade-in-down border border-white/20">
           {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className="py-3 px-4 rounded-xl text-left text-wedding-800 hover:bg-wedding-50 font-medium border-b border-wedding-50 last:border-0"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate('carpool');
              setIsMobileMenuOpen(false);
            }}
            className="py-3 px-4 rounded-xl text-left bg-wedding-50 text-wedding-900 font-semibold flex items-center gap-2 mt-2"
          >
            <Car size={18} />
            Compartir Coche / Buscar
          </button>
        </div>
      )}
    </div>
  );
};