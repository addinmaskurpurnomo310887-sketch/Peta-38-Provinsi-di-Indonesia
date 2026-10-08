import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Trophy,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Compass,
  Utensils,
  Palette,
  Home as HomeIcon,
  ArrowLeft,
} from 'lucide-react';
import { Province } from '../types';

interface ProvincePopupProps {
  province: Province;
  onClose: () => void;
}

type ModeType = 'ringkasan' | 'informasi' | 'tantangan';

export const ProvincePopup: React.FC<ProvincePopupProps> = ({ province, onClose }) => {
  const [currentMode, setCurrentMode] = useState<ModeType>('ringkasan');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
    setHasAnswered(true);
  };

  const handleResetChallenge = () => {
    setSelectedAnswer(null);
    setHasAnswered(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-x-3 bottom-3 sm:bottom-6 sm:right-6 sm:left-auto sm:w-[460px] z-50 animate-slide-up pointer-events-auto"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.45)] border-4 border-amber-400 overflow-hidden text-slate-800 transition-all">
        {/* ============================================================== */}
        {/* MODE 1: KARTU INFORMASI LENGKAP (SESUAI SPESIFIKASI USER)       */}
        {/* ============================================================== */}
        {currentMode === 'informasi' ? (
          <div className="animate-fade-in flex flex-col">
            {/* Header: 🇮🇩 [NAMA PROVINSI] */}
            <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 px-5 py-4 text-white flex items-center justify-between border-b-2 border-sky-400">
              <div className="flex items-center gap-3">
                <span className="text-3xl filter drop-shadow-sm" role="img" aria-label="Bendera Indonesia">
                  🇮🇩
                </span>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block">
                    KARTU INFORMASI PROVINSI
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black font-display tracking-wide uppercase drop-shadow-xs">
                    {province.name}
                  </h2>
                </div>
              </div>

              {/* Close Button top-right */}
              <button
                onClick={onClose}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/20 hover:bg-white/30 active:scale-95 text-white transition cursor-pointer"
                aria-label="Tutup dan kembali ke peta"
                title="Tutup"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

            {/* Scrollable Information Body */}
            <div className="p-5 space-y-3.5 max-h-[58vh] overflow-y-auto">
              {/* Ibu Kota & Pulau */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Ibu Kota */}
                <div className="bg-sky-50/90 p-3.5 rounded-2xl border border-sky-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 uppercase tracking-wider mb-0.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-600" />
                    <span>Ibu Kota</span>
                  </div>
                  <p className="text-base sm:text-lg font-black text-slate-900 font-display">
                    {province.capital}
                  </p>
                </div>

                {/* Pulau */}
                <div className="bg-emerald-50/90 p-3.5 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pulau</span>
                  </div>
                  <p className="text-base sm:text-lg font-black text-slate-900 font-display">
                    {province.island}
                  </p>
                </div>
              </div>

              {/* Fakta */}
              <div className="bg-amber-50/90 p-3.5 rounded-2xl border border-amber-200">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-800 uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Fakta:</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-semibold">
                  {province.funFact}
                </p>
              </div>

              {/* Budaya */}
              <div className="bg-indigo-50/90 p-3.5 rounded-2xl border border-indigo-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">
                  <Palette className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Budaya:</span>
                </div>
                <p className="text-xs sm:text-sm text-indigo-950 font-bold leading-relaxed">
                  {province.culture}
                </p>
              </div>

              {/* Makanan */}
              <div className="bg-rose-50/90 p-3.5 rounded-2xl border border-rose-200">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
                  <Utensils className="w-3.5 h-3.5 text-rose-600" />
                  <span>Makanan:</span>
                </div>
                <p className="text-xs sm:text-sm text-rose-950 font-bold leading-relaxed">
                  {province.food}
                </p>
              </div>

              {/* Kesenian / Rumah Adat */}
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

              {/* Letak Geografis Singkat */}
              {province.geographicLocation && (
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                    <Compass className="w-3.5 h-3.5 text-slate-500" />
                    <span>Letak Geografis:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {province.geographicLocation}
                  </p>
                </div>
              )}
            </div>

            {/* Tombol [ KEMBALI KE PETA ] (Besar, Mudah Disentuh pada IFP) */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-2">
              <button
                onClick={onClose}
                className="w-full h-15 sm:h-16 flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-black text-base sm:text-lg shadow-lg shadow-emerald-500/25 transition-all cursor-pointer font-display border-2 border-emerald-300 touch-target"
                aria-label="Kembali ke Peta"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                <span>KEMBALI KE PETA</span>
              </button>
            </div>
          </div>
        ) : currentMode === 'tantangan' && province.challenge ? (
          /* ============================================================== */
          /* MODE 2: TANTANGAN KUIS INTERAKTIF                             */
          /* ============================================================== */
          <div className="animate-fade-in flex flex-col">
            <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 px-5 py-4 text-slate-950 flex items-center justify-between border-b-2 border-amber-300">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-6 h-6 text-slate-950" />
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 block">
                    Tantangan Pintar
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-display tracking-wide uppercase">
                    {province.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-black/10 hover:bg-black/20 active:scale-95 text-slate-950 transition cursor-pointer"
                aria-label="Tutup kuis"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[55vh] overflow-y-auto">
              <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200">
                <p className="text-sm sm:text-base font-black text-slate-900 leading-snug">
                  {province.challenge.question}
                </p>
              </div>

              <div className="space-y-2.5">
                {province.challenge.options.map((option, idx) => {
                  const isCorrect = idx === province.challenge!.correctAnswer;
                  const isChosen = selectedAnswer === idx;

                  let btnStyle = 'bg-white hover:bg-sky-50 border-slate-200 text-slate-800';
                  if (hasAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-500 border-emerald-600 text-white font-bold shadow-md';
                    } else if (isChosen) {
                      btnStyle = 'bg-rose-500 border-rose-600 text-white font-bold';
                    } else {
                      btnStyle = 'bg-slate-100 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !hasAnswered && handleSelectAnswer(idx)}
                      disabled={hasAnswered}
                      className={`w-full p-3.5 rounded-xl border-2 text-left text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {hasAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-white" />}
                      {hasAnswered && isChosen && !isCorrect && <AlertCircle className="w-5 h-5 text-white" />}
                    </button>
                  );
                })}
              </div>

              {hasAnswered && (
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm font-medium border leading-relaxed ${
                    selectedAnswer === province.challenge.correctAnswer
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <p className="font-bold mb-0.5">
                    {selectedAnswer === province.challenge.correctAnswer
                      ? '🎉 Hebat sekali, jawabanmu benar!'
                      : '💡 Jawaban yang benar:'}
                  </p>
                  <p>{province.challenge.explanation}</p>
                  <button
                    onClick={handleResetChallenge}
                    className="mt-2 text-xs font-bold underline cursor-pointer text-sky-700"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => setCurrentMode('ringkasan')}
                className="flex-1 h-13 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-sm cursor-pointer"
              >
                Kembali
              </button>
              <button
                onClick={onClose}
                className="flex-1 h-13 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* MODE 0: POPUP RINGKASAN AWAL (SESUAI SPESIFIKASI PROVINSI)     */
          /* ============================================================== */
          <div>
            {/* Header: 🇮🇩 [NAMA PROVINSI] */}
            <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 px-5 py-4 text-white flex items-center justify-between border-b-2 border-sky-400">
              <div className="flex items-center gap-3">
                <span className="text-3xl" role="img" aria-label="Bendera Indonesia">
                  🇮🇩
                </span>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block">
                    Provinsi #{province.id}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black font-display tracking-wide uppercase drop-shadow-xs">
                    {province.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/20 hover:bg-white/30 active:scale-95 text-white transition cursor-pointer"
                aria-label="Tutup popup"
                title="Tutup"
              >
                <X className="w-6 h-6 stroke-[2.5]" />
              </button>
            </div>

            {/* Isi Ringkasan: Ibu Kota & Pulau/Kawasan */}
            <div className="p-5 space-y-3 max-h-[50vh] overflow-y-auto">
              {/* Ibu Kota */}
              <div className="bg-sky-50/90 p-4 rounded-2xl border border-sky-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block">
                    Ibu Kota:
                  </span>
                  <span className="text-xl font-black text-slate-900 font-display">
                    {province.capital}
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-sky-200/80 flex items-center justify-center text-2xl shadow-inner">
                  🏛️
                </div>
              </div>

              {/* Pulau/Kawasan */}
              <div className="bg-emerald-50/90 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                    Pulau / Kawasan:
                  </span>
                  <span className="text-xl font-black text-slate-900 font-display">
                    {province.island}
                  </span>
                </div>
                <div className="w-11 h-11 rounded-2xl bg-emerald-200/80 flex items-center justify-center text-2xl shadow-inner">
                  🏝️
                </div>
              </div>

              {/* Highlight Fakta Menarik Singkat */}
              {province.funFact && (
                <div className="bg-amber-50/90 p-3.5 rounded-2xl border border-amber-200 text-xs sm:text-sm text-amber-950 leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{province.funFact}</span>
                </div>
              )}
            </div>

            {/* Tombol Aksi: INFORMASI, TANTANGAN, TUTUP */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2">
                {/* Tombol INFORMASI */}
                <button
                  onClick={() => setCurrentMode('informasi')}
                  className="h-12 flex items-center justify-center gap-2 rounded-2xl font-black text-sm transition-all cursor-pointer border-2 bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-700 shadow-md active:scale-95"
                  title="Lihat Kartu Informasi Lengkap"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>INFORMASI</span>
                </button>

                {/* Tombol TANTANGAN */}
                <button
                  onClick={() => setCurrentMode('tantangan')}
                  className="h-12 flex items-center justify-center gap-2 rounded-2xl font-black text-sm transition-all cursor-pointer border-2 bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-600 shadow-md active:scale-95"
                  title="Mulai Tantangan Kuis"
                >
                  <Trophy className="w-4 h-4" />
                  <span>TANTANGAN</span>
                </button>
              </div>

              {/* Tombol TUTUP (Besar, Jelas, Target Sentuh >60px) */}
              <button
                onClick={onClose}
                className="w-full h-15 sm:h-16 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-base sm:text-lg shadow-lg shadow-rose-500/25 active:scale-95 transition-all cursor-pointer font-display border-2 border-rose-300 touch-target"
                aria-label="Tutup popup"
              >
                <X className="w-6 h-6 stroke-[3]" />
                <span>TUTUP</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
