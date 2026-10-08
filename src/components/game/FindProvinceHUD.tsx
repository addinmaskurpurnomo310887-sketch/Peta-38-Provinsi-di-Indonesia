import React from 'react';
import { Target, X, CheckCircle2, AlertCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { Province } from '../../types';
import { PanduAvatar, getPanduClue, PANDU_FEEDBACK } from './PanduNusantara';

interface FindProvinceHUDProps {
  targetProvince: Province;
  feedback: 'idle' | 'correct' | 'wrong';
  wrongAttemptCount: number;
  onNextMission: () => void;
  onExit: () => void;
}

export const FindProvinceHUD: React.FC<FindProvinceHUDProps> = ({
  targetProvince,
  feedback,
  wrongAttemptCount,
  onNextMission,
  onExit,
}) => {
  const panduClue = getPanduClue(targetProvince, wrongAttemptCount);

  return (
    <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-lg pointer-events-auto animate-slide-down">
      <div
        className={`rounded-3xl p-4 sm:p-5 border-4 shadow-2xl backdrop-blur-md transition-all duration-300 ${
          feedback === 'correct'
            ? 'bg-emerald-950/95 border-emerald-400 text-white shadow-emerald-500/40'
            : feedback === 'wrong'
            ? 'bg-slate-900/95 border-amber-400 text-white shadow-amber-500/30'
            : 'bg-slate-900/95 border-amber-400 text-white shadow-black/60'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/15">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
              <Target className="w-5 h-5" />
            </span>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300 font-display">
              🎯 MISI: CARI PROVINSI
            </span>
          </div>

          <button
            onClick={onExit}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center cursor-pointer transition"
            title="Keluar dari Misi"
            aria-label="Keluar Misi"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Content Status */}
        <div className="py-2.5 text-center">
          {feedback === 'correct' ? (
            <div className="space-y-2 animate-bounce">
              <div className="flex items-center justify-center gap-2.5">
                <PanduAvatar size="sm" />
                <span className="text-xl sm:text-2xl font-black text-amber-300 font-display">
                  {PANDU_FEEDBACK.correct}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-emerald-300">
                Kamu berhasil menemukan {targetProvince.name}! (+100 XP ⭐)
              </p>
            </div>
          ) : feedback === 'wrong' ? (
            <div className="space-y-2 animate-fade-in text-left">
              {/* Pandu Nusantara Step-in Box */}
              <div className="bg-amber-950/70 p-3.5 rounded-2xl border-2 border-amber-400/80">
                <div className="flex items-center gap-2 mb-1.5">
                  <PanduAvatar size="sm" isThinking={true} />
                  <div>
                    <span className="text-xs font-black text-amber-300 uppercase tracking-wider font-display block">
                      🧭 PANDU NUSANTARA:
                    </span>
                    <span className="text-[11px] text-amber-200 font-bold">
                      {PANDU_FEEDBACK.wrong}
                    </span>
                  </div>
                </div>

                {/* Progressive Clue */}
                <div className="mt-2 p-2.5 rounded-xl bg-slate-900/90 border border-amber-300/60 text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-0.5">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Petunjuk #{wrongAttemptCount}:</span>
                  </div>
                  <p className="text-white font-semibold leading-relaxed">
                    {panduClue.clueText}
                  </p>
                </div>
              </div>

              <p className="text-center text-xs text-slate-300 font-medium">
                Sentuh kembali pulau di peta sesuai petunjuk Pandu! 👆
              </p>
            </div>
          ) : (
            <div>
              <p className="text-xs sm:text-sm text-sky-300 font-bold uppercase tracking-wider">
                Temukan dan sentuh wilayah ini pada peta:
              </p>
              <h3 className="text-2xl sm:text-3xl font-black text-amber-300 font-display uppercase tracking-wide my-1">
                {targetProvince.name}
              </h3>
              <p className="text-xs text-slate-300">
                Kawasan: <span className="text-emerald-400 font-bold">{targetProvince.island}</span> • Ibu kota: {targetProvince.capital}
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        {feedback === 'correct' && (
          <div className="pt-1">
            <button
              onClick={onNextMission}
              className="w-full h-13 sm:h-14 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-base shadow-lg transition active:scale-95 cursor-pointer font-display"
            >
              <span>Misi Selanjutnya</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
