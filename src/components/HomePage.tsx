import React, { useState } from 'react';
import { Play, Info, Sparkles, School, Compass, MapPin } from 'lucide-react';
import { AboutModal } from './AboutModal';

interface HomePageProps {
  onStart: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between items-center bg-gradient-to-b from-sky-400 via-sky-300 to-blue-500 overflow-hidden text-slate-800 p-4 sm:p-6 md:p-8">
      {/* Decorative Ocean Waves Background & Gentle Ornaments */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft sun / glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-200/40 rounded-full blur-3xl" />
        
        {/* Cloud shapes */}
        <div className="absolute top-8 left-6 sm:left-16 bg-white/70 backdrop-blur-xs px-6 py-3 rounded-full shadow-sm text-sky-600 font-bold text-xs flex items-center gap-2 animate-pulse">
          <span>☁️</span>
          <span>Edisi Kurikulum SD</span>
        </div>

        <div className="absolute top-10 right-6 sm:right-16 bg-white/70 backdrop-blur-xs px-6 py-3 rounded-full shadow-sm text-emerald-700 font-bold text-xs flex items-center gap-2">
          <span>🏝️</span>
          <span>Negara Kepulauan Terbesar</span>
        </div>

        {/* Floating playful decorative icons */}
        <div className="absolute bottom-32 left-8 sm:left-24 text-3xl sm:text-4xl opacity-80 animate-bounce duration-1000">
          🐬
        </div>
        <div className="absolute bottom-40 right-10 sm:right-28 text-3xl sm:text-4xl opacity-80 animate-bounce duration-700">
          ⛵
        </div>
        <div className="absolute top-1/3 left-4 sm:left-12 text-2xl sm:text-3xl opacity-60">
          🦜
        </div>
        <div className="absolute top-1/3 right-6 sm:right-16 text-2xl sm:text-3xl opacity-60">
          🐢
        </div>

        {/* Subtle wave curve at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-blue-600/40 to-transparent pointer-events-none" />
      </div>

      {/* Top Bar: Subtitle & About Button */}
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between pt-2">
        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border-2 border-sky-200 shadow-md">
          <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs sm:text-sm font-black tracking-wide text-sky-800 uppercase">
            Aplikasi Digital Kreasi Guru
          </span>
        </div>

        {/* "ⓘ Tentang Aplikasi" Button (Touch target min 60px) */}
        <button
          onClick={() => setIsAboutOpen(true)}
          className="touch-target inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl bg-white/95 hover:bg-white active:scale-95 text-sky-800 hover:text-sky-900 font-bold text-sm sm:text-base border-2 border-sky-300 shadow-md hover:shadow-lg transition cursor-pointer"
          title="Tentang Aplikasi"
        >
          <Info className="w-5 h-5 text-sky-600 stroke-[2.5]" />
          <span>Tentang Aplikasi</span>
        </button>
      </header>

      {/* Main Center Content */}
      <main className="relative z-10 my-auto w-full max-w-4xl flex flex-col items-center text-center px-4 py-6">
        {/* Indonesian Flag Icon */}
        <div className="mb-3 sm:mb-4 inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white shadow-xl border-4 border-amber-300 transform hover:rotate-6 transition-transform">
          <span className="text-4xl sm:text-5xl" role="img" aria-label="Bendera Indonesia">🇮🇩</span>
        </div>

        {/* Title */}
        <div className="space-y-1 sm:space-y-2">
          <h2 className="text-xs sm:text-sm md:text-base font-extrabold tracking-widest text-amber-900 bg-amber-300/90 px-4 py-1 rounded-full uppercase inline-block border border-amber-400 shadow-xs mb-1">
            Media Pembelajaran Kelas 5 SD
          </h2>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white font-display tracking-wide drop-shadow-[0_4px_8px_rgba(3,105,161,0.6)] leading-tight">
            PETUALANGAN
            <span className="block text-amber-300 drop-shadow-[0_4px_8px_rgba(180,83,9,0.7)]">
              PETA INDONESIA
            </span>
          </h1>
          <div className="inline-block mt-1 sm:mt-2">
            <span className="text-2xl sm:text-4xl md:text-5xl font-black text-rose-500 bg-white px-6 sm:px-8 py-1.5 sm:py-2 rounded-2xl shadow-lg border-3 border-rose-300 inline-block font-display tracking-wider">
              38 PROVINSI
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mt-5 sm:mt-6 max-w-2xl text-base sm:text-lg md:text-xl font-medium text-sky-950 bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-sky-200/80 shadow-md leading-relaxed">
          Media pembelajaran interaktif untuk mengenal 38 provinsi Indonesia melalui peta, eksplorasi, dan permainan edukatif.
        </p>

        {/* Developer Card Banner */}
        <div className="mt-5 sm:mt-6 inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-slate-900/80 backdrop-blur-md px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl border border-white/20 text-white shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center text-xs font-bold">
              👨‍🏫
            </div>
            <span className="text-xs font-semibold text-sky-200 uppercase tracking-wider">Pengembang:</span>
            <span className="text-sm sm:text-base font-bold text-amber-300">Addin Maskur Purnomo, S.Pd</span>
          </div>
          <span className="hidden sm:inline text-white/40">•</span>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-sky-100 font-medium">
            <School className="w-4 h-4 text-emerald-400" />
            <span>Guru SDN Paluhombo 02</span>
          </div>
        </div>

        {/* Primary Action Button: "▶ MULAI" */}
        <div className="mt-7 sm:mt-8 w-full max-w-sm sm:max-w-md">
          <button
            onClick={onStart}
            className="touch-target group relative w-full h-18 sm:h-20 flex items-center justify-center gap-3 sm:gap-4 rounded-3xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:via-amber-400 hover:to-orange-400 text-slate-950 font-black text-2xl sm:text-3xl font-display tracking-wider shadow-[0_10px_25px_rgba(245,158,11,0.5)] hover:shadow-[0_14px_30px_rgba(245,158,11,0.6)] active:scale-95 active:shadow-md transition-all duration-200 cursor-pointer border-4 border-white/90"
            aria-label="Mulai Petualangan Peta Indonesia"
          >
            {/* Pulsing play icon badge */}
            <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white flex items-center justify-center text-amber-600 shadow-inner group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-amber-500 ml-0.5" />
            </span>
            <span>MULAI</span>
            <span className="text-xl sm:text-2xl group-hover:translate-x-1 transition-transform">🚀</span>
          </button>
          <p className="mt-2 text-xs sm:text-sm font-semibold text-white/90 drop-shadow-xs">
            Ketuk tombol untuk membuka Peta Indonesia
          </p>
        </div>
      </main>

      {/* Footer info for IFP Screen / SDN */}
      <footer className="relative z-10 w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm font-semibold text-white/90 drop-shadow-xs pt-4 border-t border-white/20">
        <div className="flex items-center gap-2">
          <span>🏫</span>
          <span>SDN Paluhombo 02</span>
          <span>•</span>
          <span>Tahun Pelajaran 2025/2026</span>
        </div>
        <div className="flex items-center gap-2">
          <span>📺</span>
          <span>Dioptimalkan untuk Touchscreen IFP 75&quot; &amp; Layar 1920 × 1080</span>
        </div>
      </footer>

      {/* About Modal Dialog */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
};
