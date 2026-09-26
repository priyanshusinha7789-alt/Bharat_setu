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
      // If user directly opened a deep anchor link (e.g. #demo, #how-it-works, #team), skip landing
      if (window.location.hash && window.location.hash !== '#home' && window.location.hash !== '#') {
        return true;
      }
      // Check query parameter: e.g. ?landing=false to bypass
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('landing') === 'false') return true;
      return false; // Default to showing the landing page so the user and evaluators always see it
    }
    return false;
  });

  const handleEnter = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('bhasha_setu_entered', 'true');
    }
    setHasEntered(true);
  };

  const handleReplayIntro = () => {
    setHasEntered(false);
  };

  return (
    <>
      {!hasEntered && <WelcomeLanding onEnter={handleEnter} />}
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar onReplayIntro={handleReplayIntro} />
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
