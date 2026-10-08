import { GameProgress } from '../types';

const STORAGE_KEY = 'petualangan_peta_game_progress_v1';

export const INITIAL_PROGRESS: GameProgress = {
  xp: 0,
  score: 0,
  foundProvinceIds: [],
  unlockedBadges: [],
  correctCount: 0,
  incorrectCount: 0,
  hasClaimedGrandBonus: false,
};

export function loadGameProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...INITIAL_PROGRESS };
    const parsed = JSON.parse(raw);
    return {
      xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
      score: typeof parsed.score === 'number' ? parsed.score : 0,
      foundProvinceIds: Array.isArray(parsed.foundProvinceIds) ? parsed.foundProvinceIds : [],
      unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : [],
      correctCount: typeof parsed.correctCount === 'number' ? parsed.correctCount : 0,
      incorrectCount: typeof parsed.incorrectCount === 'number' ? parsed.incorrectCount : 0,
      hasClaimedGrandBonus: !!parsed.hasClaimedGrandBonus,
    };
  } catch (err) {
    console.error('Error loading game progress from localStorage:', err);
    return { ...INITIAL_PROGRESS };
  }
}

export function saveGameProgress(progress: GameProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (err) {
    console.error('Error saving game progress to localStorage:', err);
  }
}

export function resetGameProgress(): GameProgress {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error resetting game progress:', err);
  }
  return { ...INITIAL_PROGRESS };
}
