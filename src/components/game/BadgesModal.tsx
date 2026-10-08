import React, { useState } from 'react';
import {
  Medal,
  X,
  CheckCircle2,
  Lock,
  Trophy,
  RotateCcw,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { GameProgress, Province } from '../../types';
import { PROVINCES_DATA } from '../../data/provinces';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: GameProgress;
  onResetProgress: () => void;
  onSelectProvince: (province: Province) => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  progress,
  onResetProgress,
  onSelectProvince,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalProvinces = PROVINCES_DATA.length;
  const exploredCount = progress.foundProvinceIds.length;
  const isAllExplored = exploredCount >= totalProvinces;

  const handleConfirmReset = () => {
    onResetProgress();
    setShowConfirmReset(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-fade-in pointer-events-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-4 border-amber-400 rounded-3xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.7)] text-white flex flex-col max-h-[90vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Medal className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block">
                KOLEKSI 38 LENCANA NUSANTARA
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                Lencana Provinsi Indonesia
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 transition cursor-pointer"
            aria-label="Tutup lencana"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Grand Celebration Banner if 38/38 */}
        {isAllExplored && (
          <div className="my-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 shadow-xl border-2 border-white animate-bounce shrink-0 text-center">
            <div className="flex items-center justify-center gap-2 text-2xl font-black font-display">
              <Trophy className="w-8 h-8 text-amber-900" />
              <span>🏆 SELAMAT!</span>
            </div>
            <p className="text-sm sm:text-base font-black mt-1">
              &quot;Kamu telah menjelajahi seluruh 38 provinsi Indonesia!&quot;
            </p>
            <div className="inline-block mt-1 px-3 py-1 rounded-full bg-slate-950 text-amber-300 font-black text-xs">
              Bonus Prestasi: +1000 XP ⭐
            </div>
          </div>
        )}

        {/* Stats Tracker Bar */}
        <div className="grid grid-cols-3 gap-2 my-3 shrink-0">
          {/* Provinsi Djelajahi */}
          <div className="bg-sky-950/80 p-3 rounded-2xl border border-sky-400/40 text-center">
            <span className="text-[10px] sm:text-xs font-bold text-sky-300 uppercase tracking-wider block">
              🗺️ Dijelajahi
            </span>
            <span className="text-lg sm:text-2xl font-black text-white font-display">
              {exploredCount} / {totalProvinces}
            </span>
          </div>

          {/* XP */}
          <div className="bg-amber-950/80 p-3 rounded-2xl border border-amber-400/40 text-center">
            <span className="text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-wider block">
              ⭐ Total XP
            </span>
            <span className="text-lg sm:text-2xl font-black text-amber-300 font-display">
              {progress.xp}
            </span>
          </div>

          {/* Skor */}
          <div className="bg-emerald-950/80 p-3 rounded-2xl border border-emerald-400/40 text-center">
            <span className="text-[10px] sm:text-xs font-bold text-emerald-300 uppercase tracking-wider block">
              🏆 Skor
            </span>
            <span className="text-lg sm:text-2xl font-black text-emerald-300 font-display">
              {progress.score}
            </span>
          </div>
        </div>

        {/* 38 Badges Grid (Scrollable) */}
        <div className="flex-1 overflow-y-auto pr-1 my-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {PROVINCES_DATA.map((prov) => {
              const isUnlocked = progress.foundProvinceIds.includes(prov.id);

              return (
                <div
                  key={prov.id}
                  onClick={() => {
                    onSelectProvince(prov);
                    onClose();
                  }}
                  className={`p-3 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer active:scale-95 ${
                    isUnlocked
                      ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-amber-400 shadow-md hover:border-amber-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-500 grayscale opacity-60 hover:opacity-80'
                  }`}
                  title={`${prov.name} (Ketuk untuk sorot di peta)`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-slate-950/60 text-amber-300">
                      #{prov.id}
                    </span>
                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[11px] font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/50">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>DIBUKA</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md">
                        <Lock className="w-3 h-3 text-slate-500" />
                        <span>KUNCI</span>
                      </span>
                    )}
                  </div>

                  {/* Badge Icon / Symbol */}
                  <div className="text-center my-1.5">
                    <div
                      className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                        isUnlocked
                          ? 'bg-gradient-to-tr from-amber-400 to-orange-400 text-slate-950 shadow-amber-400/30'
                          : 'bg-slate-800 text-slate-600'
                      }`}
                    >
                      {isUnlocked ? '🇮🇩' : '🔒'}
                    </div>
                  </div>

                  <div className="text-center mt-1">
                    <p
                      className={`text-xs sm:text-sm font-black font-display truncate leading-tight ${
                        isUnlocked ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {prov.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {prov.capital}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions: Reset Progres & Tutup */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => setShowConfirmReset(true)}
            className="h-12 px-4 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-800 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RESET PROGRES</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 h-13 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-base cursor-pointer transition touch-target"
          >
            Kembali ke Peta
          </button>
        </div>

        {/* Confirmation Modal for Reset */}
        {showConfirmReset && (
          <div
            role="alertdialog"
            aria-modal="true"
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <div className="bg-slate-900 border-3 border-rose-500 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-2xl">
                <AlertTriangle className="w-8 h-8 text-rose-400" />
              </div>
              <h3 className="text-lg font-black text-white font-display">
                Konfirmasi Reset Progres
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Apakah kamu yakin ingin mereset seluruh progres permainan? Semua lencana, XP, dan skor akan kembali menjadi 0.
              </p>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmReset}
                  className="flex-1 h-12 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm cursor-pointer"
                >
                  Ya, Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
