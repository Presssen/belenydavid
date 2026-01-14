import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { EventDetails } from './components/EventDetails';
import { Accommodation } from './components/Accommodation';
import { Activities } from './components/Activities';
import { Gift } from './components/Gift';
import { Footer } from './components/Footer';
import { WelcomeModal } from './components/WelcomeModal';
import { Carpool } from './components/Carpool';
import { ViewState } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');

  return (
    <div className="min-h-screen w-full relative flex flex-col">
      {currentView === 'home' && <WelcomeModal />}
      
      <Navbar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-grow">
        {currentView === 'home' ? (
          <>
            <Hero />
            <EventDetails />
            <Accommodation />
            <Activities />
            <Gift />
          </>
        ) : (
          <Carpool />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default App;