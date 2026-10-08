import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  CheckCircle2,
  AlertCircle,
  Trophy,
  ArrowRight,
  Sparkles,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import { QuizDifficulty, QuizQuestion } from '../../types';
import { QUIZ_QUESTIONS } from '../../data/quizData';
import { PanduAvatar, PANDU_FEEDBACK } from './PanduNusantara';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCorrectAnswer: () => void;
  onWrongAnswer: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  onCorrectAnswer,
  onWrongAnswer,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<QuizDifficulty>('MUDAH');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  // Filter questions by difficulty
  const questions = QUIZ_QUESTIONS.filter((q) => q.difficulty === selectedDifficulty);
  const currentQ = questions[currentQuestionIndex % questions.length];

  const handleSelectAnswer = (index: number) => {
    if (hasSubmitted) return;
    setSelectedAnswerIndex(index);
    setHasSubmitted(true);

    if (index === currentQ.correctAnswer) {
      onCorrectAnswer();
    } else {
      onWrongAnswer();
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswerIndex(null);
    setHasSubmitted(false);
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  const handleChangeDifficulty = (diff: QuizDifficulty) => {
    setSelectedDifficulty(diff);
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setHasSubmitted(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in pointer-events-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 to-slate-950 border-4 border-amber-400 rounded-3xl p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.6)] text-white animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
              <Trophy className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 block">
                MODE 3 • KUIS NUSANTARA
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                Uji Pengetahuan 38 Provinsi
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 transition cursor-pointer"
            aria-label="Tutup kuis"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Difficulty Selector: MUDAH, SEDANG, SULIT */}
        <div className="my-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Pilih Tingkat Kesulitan:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(['MUDAH', 'SEDANG', 'SULIT'] as QuizDifficulty[]).map((level) => {
              const isActive = selectedDifficulty === level;
              const colorClass =
                level === 'MUDAH'
                  ? isActive
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-lg shadow-emerald-500/30'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/60'
                  : level === 'SEDANG'
                  ? isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-lg shadow-amber-500/30'
                    : 'bg-amber-950/60 text-amber-300 border-amber-800/80 hover:bg-amber-900/60'
                  : isActive
                  ? 'bg-rose-500 text-white border-rose-400 font-black shadow-lg shadow-rose-500/30'
                  : 'bg-rose-950/60 text-rose-300 border-rose-800/80 hover:bg-rose-900/60';

              return (
                <button
                  key={level}
                  onClick={() => handleChangeDifficulty(level)}
                  className={`h-11 sm:h-12 rounded-xl text-xs sm:text-sm border-2 font-display uppercase tracking-wider transition cursor-pointer active:scale-95 flex items-center justify-center gap-1 ${colorClass}`}
                >
                  <span>{level}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Card */}
        {currentQ && (
          <div className="space-y-3.5 my-3">
            <div className="bg-sky-950/80 p-4 sm:p-5 rounded-2xl border-2 border-sky-400/50 shadow-inner">
              <div className="flex items-center justify-between text-xs text-sky-300 font-bold mb-1.5">
                <span className="uppercase tracking-wider">Soal #{currentQuestionIndex + 1}</span>
                <span className="bg-sky-900/80 px-2.5 py-0.5 rounded-full text-amber-300 uppercase">
                  {currentQ.difficulty}
                </span>
              </div>
              <p className="text-base sm:text-lg font-black text-white font-display leading-snug">
                {currentQ.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswerIndex === idx;
                const isCorrect = idx === currentQ.correctAnswer;

                let btnStyle = 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700 text-white';
                if (hasSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-600 border-emerald-400 text-white font-bold shadow-md';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-600 border-rose-400 text-white font-bold';
                  } else {
                    btnStyle = 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-50';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    disabled={hasSubmitted}
                    className={`w-full p-3 sm:p-3.5 rounded-xl border-2 flex items-center justify-between text-left text-sm font-semibold transition active:scale-[0.98] cursor-pointer ${btnStyle}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-lg bg-slate-950/60 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {['A', 'B', 'C', 'D'][idx]}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {hasSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
                    {hasSubmitted && isSelected && !isCorrect && <AlertCircle className="w-5 h-5 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next Button with Pandu Feedback */}
            {hasSubmitted && (
              <div
                className={`p-4 rounded-2xl border text-xs sm:text-sm leading-relaxed ${
                  selectedAnswerIndex === currentQ.correctAnswer
                    ? 'bg-emerald-950/95 border-emerald-500 text-emerald-100'
                    : 'bg-amber-950/95 border-amber-500 text-amber-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <PanduAvatar
                    size="sm"
                    isThinking={selectedAnswerIndex !== currentQ.correctAnswer}
                  />
                  <div className="flex-1">
                    <p className="font-black text-sm sm:text-base text-amber-300 font-display mb-1">
                      {selectedAnswerIndex === currentQ.correctAnswer
                        ? PANDU_FEEDBACK.correct
                        : PANDU_FEEDBACK.wrong}
                    </p>
                    <p className="text-white font-medium mb-2">{currentQ.explanation}</p>
                    <div className="flex justify-end">
                      <button
                        onClick={handleNextQuestion}
                        className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shrink-0 flex items-center gap-1 cursor-pointer shadow-md active:scale-95 font-display"
                      >
                        <span>Soal Berikutnya</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Close */}
        <div className="pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full h-13 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm cursor-pointer transition touch-target"
          >
            Tutup &amp; Kembali ke Peta
          </button>
        </div>
      </div>
    </div>
  );
};
