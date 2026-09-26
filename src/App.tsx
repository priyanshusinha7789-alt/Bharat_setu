import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ClassroomConsole } from './components/ClassroomConsole';
import { HowItWorks } from './components/HowItWorks';
import { LanguageShowcase } from './components/LanguageShowcase';
import { Impact } from './components/Impact';
import { Team } from './components/Team';
import { Footer } from './components/Footer';
import { WelcomeLanding } from './components/WelcomeLanding';

export const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      // If user directly opened a section anchor or already entered during this browser session
      if (window.location.hash && window.location.hash !== '#home') return true;
      return sessionStorage.getItem('bhasha_setu_entered') === 'true';
    }
    return false;
  });

  const handleEnter = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('bhasha_setu_entered', 'true');
    }
    setHasEntered(true);
  };

  return (
    <>
      {!hasEntered && <WelcomeLanding onEnter={handleEnter} />}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Hero />
          <ClassroomConsole />
          <HowItWorks />
          <LanguageShowcase />
          <Impact />
          <Team />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default App;
