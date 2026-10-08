export interface ProvinceChallenge {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Province {
  id: number;
  name: string;
  capital: string;
  island: string;
  geographicLocation: string; // Letak geografis singkat
  culture: string; // Salah satu budaya khas
  food: string; // Salah satu makanan khas
  artAndHouse: string; // Salah satu rumah adat / tarian atau kesenian khas
  funFact: string; // Fakta menarik sederhana
  x: number; // percentage (0-100) on map image (DO NOT CHANGE)
  y: number; // percentage (0-100) on map image (DO NOT CHANGE)
  traditionalHouse?: string;
  traditionalCloth?: string;
  specialty?: string;
  challenge?: ProvinceChallenge;
}

export interface GameProgress {
  xp: number;
  score: number;
  foundProvinceIds: number[];
  unlockedBadges: number[];
  correctCount: number;
  incorrectCount: number;
  hasClaimedGrandBonus?: boolean;
}

export type QuizDifficulty = 'MUDAH' | 'SEDANG' | 'SULIT';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: QuizDifficulty;
  category: 'ibu-kota' | 'letak' | 'pulau' | 'budaya' | 'makanan' | 'rumah-adat' | 'tarian' | 'geografi';
}

export type GameMode = 'eksplorasi' | 'cari-provinsi' | 'tebak-provinsi' | 'kuis';


export interface AppDeveloper {
  name: string;
  title: string;
  school: string;
}

export interface AppMetadataInfo {
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  targetAudience: string;
  developer: AppDeveloper;
}

