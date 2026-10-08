import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Lightbulb,
} from 'lucide-react';
import { Province } from '../../types';
import { PROVINCES_DATA } from '../../data/provinces';
import { PanduAvatar, getPanduClue, PANDU_FEEDBACK } from './PanduNusantara';

interface GuessProvinceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnswerCorrect: (provinceId: number) => void;
}

export const GuessProvinceModal: React.FC<GuessProvinceModalProps> = ({
  isOpen,
  onClose,
  onAnswerCorrect,
}) => {
  const [targetProvince, setTargetProvince] = useState<Province>(PROVINCES_DATA[13]); // Default Jawa Tengah (id 14)
  const [options, setOptions] = useState<Province[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [wrongCount, setWrongCount] = useState<number>(0);

  const generateNewQuestion = () => {
    const randomIndex = Math.floor(Math.random() * PROVINCES_DATA.length);
    const correct = PROVINCES_DATA[randomIndex];
    setTargetProvince(correct);

    const otherProvinces = PROVINCES_DATA.filter((p) => p.id !== correct.id);
    const shuffledOthers = [...otherProvinces].sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, 3);

    const allOptions = [correct, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(allOptions);

    setSelectedOptionId(null);
    setFeedback('idle');
    setWrongCount(0);
  };

  useEffect(() => {
    if (isOpen) {
      generateNewQuestion();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelect = (option: Province) => {
    setSelectedOptionId(option.id);
    if (option.id === targetProvince.id) {
      setFeedback('correct');
      onAnswerCorrect(targetProvince.id);
    } else {
      setFeedback('wrong');
      setWrongCount((prev) => prev + 1);
    }
  };

  const panduClue = getPanduClue(targetProvince, wrongCount);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in pointer-events-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-amber-400 rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-white animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Pandu Nusantara Avatar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <PanduAvatar size="md" isThinking={wrongCount > 0} />
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block font-display">
                🧭 PANDU NUSANTARA • TEBAK PROVINSI
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                Tebak Siapakah Aku?
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 transition cursor-pointer"
            aria-label="Tutup tebak provinsi"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Clue Box (Riddle) */}
        <div className="my-3.5 bg-gradient-to-b from-sky-900/60 to-blue-900/60 p-4 rounded-2xl border-2 border-sky-400/60 shadow-inner space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Petunjuk Awal:</span>
          </p>
          <div className="space-y-1.5 text-base sm:text-lg font-black text-white font-display leading-relaxed">
            <p>1. &quot;Aku berada di wilayah <strong>{targetProvince.island}</strong>.&quot;</p>
            <p>2. &quot;Ibu kotaku adalah <strong>{targetProvince.capital}</strong>.&quot;</p>
            <p>3. &quot;Salah satu budaya/ciriku adalah <strong>{targetProvince.culture}</strong>.&quot;</p>
          </div>
        </div>

        {/* Pandu Clue on Wrong Attempt */}
        {wrongCount > 0 && feedback !== 'correct' && (
          <div className="p-3.5 rounded-2xl bg-amber-950/80 border-2 border-amber-400 text-amber-100 my-2.5 animate-slide-up">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-1">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="font-display uppercase">Bantuan Pandu #{wrongCount}:</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-white">
              {PANDU_FEEDBACK.wrong}
            </p>
            <div className="mt-1.5 p-2 rounded-xl bg-slate-900/80 border border-amber-400/50 text-xs text-amber-200 font-bold">
              {panduClue.clueText}
            </div>
          </div>
        )}

        {/* Options (A, B, C, D) */}
        <div className="space-y-2.5 my-3">
          {options.map((option, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            const isChosen = selectedOptionId === option.id;
            const isCorrect = option.id === targetProvince.id;

            let btnStyle = 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700 text-white';
            if (feedback === 'correct' && isCorrect) {
              btnStyle = 'bg-emerald-600 border-emerald-400 text-white font-black shadow-lg shadow-emerald-600/40';
            } else if (feedback === 'wrong' && isChosen) {
              btnStyle = 'bg-rose-600 border-rose-400 text-white font-bold';
            }

            return (
              <button
                key={option.id}
                onClick={() => handleSelect(option)}
                disabled={feedback === 'correct'}
                className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between text-left transition-all active:scale-[0.98] cursor-pointer touch-target ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-slate-950/60 text-amber-300 font-black text-sm flex items-center justify-center shrink-0 border border-white/20">
                    {letter}
                  </span>
                  <span className="text-base sm:text-lg font-bold font-display">
                    {option.name}
                  </span>
                </div>

                {feedback === 'correct' && isCorrect && (
                  <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
                )}
                {feedback === 'wrong' && isChosen && (
                  <AlertCircle className="w-6 h-6 text-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Correct Celebration Feedback */}
        {feedback === 'correct' && (
          <div className="p-3.5 rounded-2xl bg-emerald-950 border-2 border-emerald-500 text-emerald-100 flex items-center justify-between my-2 animate-bounce">
            <div>
              <p className="text-base font-black text-amber-300 font-display">
                {PANDU_FEEDBACK.correct}
              </p>
              <p className="text-xs text-emerald-200">
                Provinsi yang tepat adalah {targetProvince.name}! (+100 XP ⭐)
              </p>
            </div>
            <button
              onClick={generateNewQuestion}
              className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-sm hover:bg-amber-300 active:scale-95 cursor-pointer flex items-center gap-1 shadow-md font-display"
            >
              <span>Lanjut</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom Close Button */}
        <div className="pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full h-14 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-base cursor-pointer transition touch-target"
          >
            Tutup &amp; Kembali ke Peta
          </button>
        </div>
      </div>
    </div>
  );
};
