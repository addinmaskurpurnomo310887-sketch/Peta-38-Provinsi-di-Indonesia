import React, { useState } from 'react';
import { Compass, Sparkles, X, Lightbulb, MessageCircle, HeartHandshake } from 'lucide-react';
import { Province } from '../../types';

export interface PanduClueState {
  attemptCount: number; // 0 = initial, 1 = wrong 1x, 2 = wrong 2x, 3 = wrong 3x, >=4 = reveal
}

interface PanduNusantaraProps {
  province?: Province;
  wrongCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
  message?: string;
  variant?: 'banner' | 'floating' | 'hint-box';
  onAskHint?: () => void;
}

export function getPanduClue(province: Province, attemptCount: number): {
  clueText: string;
  isLastAttempt: boolean;
  isAnswerRevealed: boolean;
} {
  if (attemptCount === 1) {
    return {
      clueText: `Petunjuk 1: Provinsi ini berada di kawasan ${province.island}.`,
      isLastAttempt: false,
      isAnswerRevealed: false,
    };
  }

  if (attemptCount === 2) {
    return {
      clueText: `Petunjuk 2: Ibu kotanya adalah Kota ${province.capital}.`,
      isLastAttempt: false,
      isAnswerRevealed: false,
    };
  }

  if (attemptCount === 3) {
    const foodOrCulture = province.food || province.culture || province.specialty || 'budayanya yang khas';
    return {
      clueText: `Petunjuk 3: Provinsi ini sangat terkenal dengan ${foodOrCulture}.`,
      isLastAttempt: true,
      isAnswerRevealed: false,
    };
  }

  if (attemptCount >= 4) {
    return {
      clueText: `Jawaban: Provinsi yang kita cari adalah ${province.name}! Ayo sentuh posisinya di peta.`,
      isLastAttempt: false,
      isAnswerRevealed: true,
    };
  }

  return {
    clueText: `Halo! Pandu siap membantumu jika mengalami kesulitan.`,
    isLastAttempt: false,
    isAnswerRevealed: false,
  };
}

export const PANDU_FEEDBACK = {
  correct: 'Hebat! Jawabanmu tepat! 🎉',
  wrong: 'Belum tepat. Jangan menyerah! Coba perhatikan petunjuknya.',
  welcome: 'Halo kawan penjelajah! Aku Pandu Nusantara, teman belajarmu!',
};

export const PanduAvatar: React.FC<{ size?: 'sm' | 'md' | 'lg'; isThinking?: boolean }> = ({
  size = 'md',
  isThinking = false,
}) => {
  const sizeClasses =
    size === 'sm'
      ? 'w-9 h-9 text-lg'
      : size === 'lg'
      ? 'w-16 h-16 text-3xl'
      : 'w-12 h-12 text-2xl';

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 border-2 border-amber-500 shadow-md flex items-center justify-center shrink-0 ${sizeClasses} ${
        isThinking ? 'animate-pulse' : ''
      }`}
    >
      <span role="img" aria-label="Pandu Nusantara">🧭</span>
      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border border-white rounded-full flex items-center justify-center text-[8px] text-white font-black">
        ★
      </span>
    </div>
  );
};

export const PanduNusantaraHintBox: React.FC<{
  province: Province;
  wrongCount: number;
  onAskHint?: () => void;
}> = ({ province, wrongCount, onAskHint }) => {
  if (wrongCount <= 0) return null;

  const { clueText, isAnswerRevealed } = getPanduClue(province, wrongCount);

  return (
    <div className="bg-gradient-to-r from-amber-950/95 via-slate-900/95 to-amber-950/95 border-2 border-amber-400 rounded-2xl p-3 sm:p-4 my-2 text-left shadow-lg animate-slide-up">
      <div className="flex items-start gap-3">
        <PanduAvatar size="md" isThinking={wrongCount > 1} />
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider font-display">
              🧭 PANDU NUSANTARA:
            </span>
            <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.2 rounded-full font-black">
              {isAnswerRevealed ? 'Kunci Jawaban' : `Bantuan #${wrongCount}`}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
            {PANDU_FEEDBACK.wrong}
          </p>

          <div className="mt-2 p-2.5 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-200 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-1.5 text-amber-300 mb-0.5">
              <Lightbulb className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Petunjuk Bertahap:</span>
            </div>
            <p className="text-white font-medium">{clueText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
