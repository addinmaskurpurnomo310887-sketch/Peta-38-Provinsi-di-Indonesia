import React from 'react';
import { X, Sparkles, School, UserCheck, MapPin } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-white to-sky-50 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-sky-300 transform transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-2xl bg-rose-100 hover:bg-rose-200 active:scale-95 text-rose-700 transition cursor-pointer"
          aria-label="Tutup dialog"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Header with Flag badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-inner">
            🇮🇩
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              Aplikasi Digital Kreasi Guru
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-display leading-tight mt-1">
              PETUALANGAN PETA INDONESIA – 38 PROVINSI
            </h2>
          </div>
        </div>

        {/* Content Paragraphs */}
        <div className="space-y-4 my-5 text-slate-700 text-base sm:text-lg leading-relaxed">
          <p className="bg-sky-50/80 p-4 rounded-2xl border border-sky-200 text-slate-700">
            Media pembelajaran digital interaktif untuk membantu siswa mengenal wilayah Indonesia, nama provinsi, ibu kota, letak geografis, dan berbagai informasi budaya.
          </p>

          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 font-semibold text-sm sm:text-base">
            <span className="text-xl">🎒</span>
            <span>Dirancang untuk pembelajaran kelas 5 SD.</span>
          </div>

          {/* Developer Card */}
          <div className="bg-white p-4 rounded-2xl border-2 border-indigo-100 shadow-sm flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Pengembang:</p>
              <p className="text-base sm:text-lg font-black text-slate-900">Addin Maskur Purnomo, S.Pd</p>
              <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium mt-0.5">
                <School className="w-4 h-4 text-emerald-600" />
                <span>Guru SDN Paluhombo 02</span>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button Bottom (min 60px touch target) */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full h-15 sm:h-16 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-extrabold text-lg shadow-lg shadow-sky-500/25 active:scale-[0.98] transition cursor-pointer touch-target border-2 border-sky-300"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
