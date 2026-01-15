import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EventDetails } from './components/EventDetails';
import { Accommodation } from './components/Accommodation';
import { Activities } from './components/Activities';
import { Gift } from './components/Gift';
import { Footer } from './components/Footer';
import { WelcomeModal } from './components/WelcomeModal';
import { Carpool } from './components/Carpool';
import { GuestNameModal } from './components/GuestNameModal';
import { CustomCursor } from './components/CustomCursor';
import { QuickAccessFAB } from './components/QuickAccessFAB';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [guestName, setGuestName] = useState<string>('');
  const [isNameSet, setIsNameSet] = useState(false);

  useEffect(() => {
    // Check if name exists in localStorage
    const savedName = localStorage.getItem('wedding_guest_name');
    if (savedName) {
      setGuestName(savedName);
      setIsNameSet(true);
    }

    // Additional event listeners for protection
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent PrintScreen or shortcuts like Ctrl+C, Ctrl+U (view source), Ctrl+S
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'u' || e.key === 's' || e.key === 'p')) ||
        e.key === 'F12'
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNameSubmit = (name: string) => {
    localStorage.setItem('wedding_guest_name', name);
    setGuestName(name);
    setIsNameSet(true);
  };

  const handleResetName = () => {
    localStorage.removeItem('wedding_guest_name');
    setGuestName('');
    setIsNameSet(false);
    window.scrollTo(0, 0);
  };

  // Prevent default context menu (Right Click)
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Prevent Dragging anywhere
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div 
      className="min-h-screen w-full relative flex flex-col"
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
    >
      <CustomCursor />

      {!isNameSet ? (
        <GuestNameModal onNameSubmit={handleNameSubmit} />
      ) : (
        <>
          {currentView === 'home' && <WelcomeModal guestName={guestName} />}
          
          <Navbar currentView={currentView} onNavigate={setCurrentView} />
          
          <main className="flex-grow">
            {currentView === 'home' ? (
              <>
                <Hero guestName={guestName} />
                <EventDetails />
                <Accommodation />
                <Activities />
                <Gift guestName={guestName} />
              </>
            ) : (
              <Carpool guestName={guestName} />
            )}
          </main>
          
          <Footer onEditName={handleResetName} guestName={guestName} />
          
          {/* Floating Action Button for Quick Access */}
          <QuickAccessFAB />
        </>
      )}
    </div>
  );
};

export default App;