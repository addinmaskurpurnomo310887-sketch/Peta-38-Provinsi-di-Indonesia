import React from 'react';
import {
  MapPin,
  Compass,
  Sparkles,
  Utensils,
  Palette,
  Home as HomeIcon,
  X,
  ArrowLeft,
} from 'lucide-react';
import { Province } from '../types';

interface ProvinceInfoCardProps {
  province: Province;
  onBackToMap: () => void;
}

export const ProvinceInfoCard: React.FC<ProvinceInfoCardProps> = ({
  province,
  onBackToMap,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-x-3 bottom-3 sm:bottom-6 sm:right-6 sm:left-auto sm:w-[460px] z-50 animate-slide-up pointer-events-auto"
    >
      <div className="bg-gradient-to-b from-white via-white to-sky-50/90 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-amber-400 overflow-hidden text-slate-800 transition-all">
        {/* Header: 🇮🇩 [NAMA PROVINSI] */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 px-5 py-4 text-white flex items-center justify-between border-b-2 border-sky-400">
          <div className="flex items-center gap-3">
            <span className="text-3xl filter drop-shadow-sm" role="img" aria-label="Bendera Indonesia">
              🇮🇩
            </span>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block">
                KARTU INFORMASI PROVINSI #{province.id}
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-display tracking-wide uppercase drop-shadow-xs">
                {province.name}
              </h2>
            </div>
          </div>

          {/* Quick close button in header */}
          <button
            onClick={onBackToMap}
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/20 hover:bg-white/30 active:scale-95 text-white transition cursor-pointer"
            aria-label="Tutup kartu dan kembali ke peta"
            title="Kembali ke Peta"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Information Body */}
        <div className="p-5 space-y-3.5 max-h-[58vh] overflow-y-auto">
          {/* Ibu Kota & Pulau Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Ibu Kota */}
            <div className="bg-sky-50 p-3 rounded-2xl border border-sky-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wider mb-0.5">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>Ibu Kota</span>
              </div>
              <p className="text-base sm:text-lg font-black text-slate-900 font-display">
                {province.capital}
              </p>
            </div>

            {/* Pulau */}
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pulau</span>
              </div>
              <p className="text-base sm:text-lg font-black text-slate-900 font-display">
                {province.island}
              </p>
            </div>
          </div>

          {/* Letak Geografis Singkat */}
          {province.geographicLocation && (
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                <Compass className="w-3.5 h-3.5 text-indigo-500" />
                <span>Letak Geografis:</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {province.geographicLocation}
              </p>
            </div>
          )}

          {/* Fakta Menarik */}
          <div className="bg-amber-50/90 p-3.5 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-800 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Fakta:</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-semibold">
              {province.funFact}
            </p>
          </div>

          {/* Budaya Khas */}
          <div className="bg-indigo-50/90 p-3.5 rounded-2xl border border-indigo-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
              <span>Budaya:</span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-950 font-bold leading-relaxed">
              {province.culture}
            </p>
          </div>

          {/* Makanan Khas */}
          <div className="bg-rose-50/90 p-3.5 rounded-2xl border border-rose-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
              <Utensils className="w-3.5 h-3.5 text-rose-600" />
              <span>Makanan:</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-950 font-bold leading-relaxed">
              {province.food}
            </p>
          </div>

          {/* Rumah Adat / Kesenian */}
          {province.artAndHouse && (
            <div className="bg-teal-50/90 p-3.5 rounded-2xl border border-teal-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                <HomeIcon className="w-3.5 h-3.5 text-teal-600" />
                <span>Rumah Adat &amp; Kesenian:</span>
              </div>
              <p className="text-xs sm:text-sm text-teal-950 font-bold leading-relaxed">
                {province.artAndHouse}
              </p>
            </div>
          )}
        </div>

        {/* Action Button: [ KEMBALI KE PETA ] */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <button
            onClick={onBackToMap}
            className="w-full h-15 sm:h-16 flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-black text-base sm:text-lg shadow-lg shadow-emerald-500/25 transition-all cursor-pointer font-display border-2 border-emerald-300 touch-target"
            aria-label="Kembali ke Peta"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
            <span>KEMBALI KE PETA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
