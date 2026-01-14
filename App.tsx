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
    // Optional: Scroll to top to ensure modal is seen comfortably or reload
    window.scrollTo(0, 0);
  };

  if (!isNameSet) {
    return <GuestNameModal onNameSubmit={handleNameSubmit} />;
  }

  return (
    <div className="min-h-screen w-full relative flex flex-col">
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
    </div>
  );
};

export default App;