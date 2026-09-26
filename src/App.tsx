import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ClassroomConsole } from './components/ClassroomConsole';
import { HowItWorks } from './components/HowItWorks';
import { LanguageShowcase } from './components/LanguageShowcase';
import { Impact } from './components/Impact';
import { Team } from './components/Team';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  return (
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
  );
};

export default App;
