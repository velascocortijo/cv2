import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeSection } from './components/HomeSection';
import { HistorySection } from './components/HistorySection';
import { ContactSection } from './components/ContactSection';
import { LoginModal } from './components/LoginModal';
import { CalendarSection } from './components/CalendarSection';
import { ExpensesSection } from './components/ExpensesSection';
import { IncomeSection } from './components/IncomeSection';
import { SplitSection } from './components/SplitSection';
import { InventorySection } from './components/InventorySection';
import { TasksSection } from './components/TasksSection';
import { DocumentsSection } from './components/DocumentsSection';
import { ProfileSection } from './components/ProfileSection';
import { UserProfile } from './types';

export function App() {
  const [currentSection, setCurrentSection] = useState<string>('home');
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('cv_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('cv_user', JSON.stringify(user));
      if (currentSection === 'home' || currentSection === 'login') {
        setCurrentSection('calendar');
      }
    } else {
      localStorage.removeItem('cv_user');
    }
  }, [user]);

  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    setCurrentSection('calendar');
  };

  const handleSignOut = () => {
    setUser(null);
    setCurrentSection('home');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        user={user}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onSignOut={handleSignOut}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!user ? (
          <>
            {currentSection === 'home' && <HomeSection onNavigate={setCurrentSection} />}
            {currentSection === 'history' && <HistorySection />}
            {currentSection === 'contact' && <ContactSection />}
          </>
        ) : (
          <>
            {currentSection === 'calendar' && <CalendarSection />}
            {currentSection === 'expenses' && <ExpensesSection />}
            {currentSection === 'income' && <IncomeSection />}
            {currentSection === 'split' && <SplitSection />}
            {currentSection === 'inventory' && <InventorySection />}
            {currentSection === 'tasks' && <TasksSection />}
            {currentSection === 'documents' && <DocumentsSection />}
            {currentSection === 'profile' && <ProfileSection user={user} />}
          </>
        )}
      </main>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
