import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';

export const MainLayout = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-grow">
        {React.cloneElement(children, { showToast })}
      </main>
      <Footer />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
};

export default MainLayout;
