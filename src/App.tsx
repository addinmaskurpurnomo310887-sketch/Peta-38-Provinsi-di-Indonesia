import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { MapPage } from './components/MapPage';

export type AppPage = 'beranda' | 'peta';

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('beranda');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const navigateTo = (page: AppPage) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsTransitioning(false);
    }, 250);
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 font-sans antialiased overflow-hidden">
      <div
        className={`w-full min-h-screen transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0 scale-[0.99]' : 'opacity-100 scale-100'
        }`}
      >
        {currentPage === 'beranda' ? (
          <HomePage onStart={() => navigateTo('peta')} />
        ) : (
          <MapPage onBackToHome={() => navigateTo('beranda')} />
        )}
      </div>
    </div>
  );
}
