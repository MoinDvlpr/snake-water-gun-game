import { Choice, Result, HighScoreEntry } from './types';

export const CHOICES: Choice[] = ['snake', 'water', 'gun'];

export const CHOICE_EMOJI: Record<Choice, string> = {
  snake: '🐍',
  water: '💧',
  gun: '🔫',
};

export const CHOICE_LABELS: Record<Choice, string> = {
  snake: 'Snake',
  water: 'Water',
  gun: 'Gun',
};

export const CHOICE_KEYS: Record<string, Choice> = {
  '1': 'snake',
  '2': 'water',
  '3': 'gun',
  's': 'snake',
  'w': 'water',
  'g': 'gun',
};

export const CHOICE_COLORS: Record<Choice, { bg: string; border: string; glow: string; text: string }> = {
  snake: {
    bg: 'from-green-500/20 to-emerald-600/20',
    border: 'border-green-500/50',
    glow: 'shadow-green-500/30',
    text: 'text-green-400',
  },
  water: {
    bg: 'from-cyan-500/20 to-blue-600/20',
    border: 'border-cyan-500/50',
    glow: 'shadow-cyan-500/30',
    text: 'text-cyan-400',
  },
  gun: {
    bg: 'from-red-500/20 to-orange-600/20',
    border: 'border-red-500/50',
    glow: 'shadow-red-500/30',
    text: 'text-red-400',
  },
};

export const RESULT_CONFIG = {
  win: { label: 'YOU WIN!', color: 'text-neon-green', bg: 'from-green-500/10 to-emerald-500/10' },
  lose: { label: 'YOU LOSE', color: 'text-neon-pink', bg: 'from-red-500/10 to-pink-500/10' },
  draw: { label: 'DRAW!', color: 'text-neon-yellow', bg: 'from-yellow-500/10 to-amber-500/10' },
};

// Snake drinks Water (Snake wins)
// Water douses Gun (Water wins)
// Gun shoots Snake (Gun wins)
export function getResult(player: Choice, cpu: Choice): Result {
  if (player === cpu) return 'draw';
  if (
    (player === 'snake' && cpu === 'water') ||
    (player === 'water' && cpu === 'gun') ||
    (player === 'gun' && cpu === 'snake')
  ) {
    return 'win';
  }
  return 'lose';
}

export function getWinExplanation(winner: Choice, loser: Choice): string {
  const explanations: Record<string, string> = {
    'snake-water': '🐍 Snake drinks Water',
    'water-gun': '💧 Water douses Gun',
    'gun-snake': '🔫 Gun shoots Snake',
  };
  return explanations[`${winner}-${loser}`] || '';
}

export function getCpuChoice(): Choice {
  return CHOICES[Math.floor(Math.random() * 3)];
}

export function calculateScore(result: Result, streak: number): number {
  if (result === 'win') return 100 + streak * 25;
  if (result === 'draw') return 10;
  return 0;
}

const HIGH_SCORE_KEY = 'swg_highscores';

export function getHighScores(): HighScoreEntry[] {
  try {
    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export function saveHighScore(entry: HighScoreEntry): HighScoreEntry[] {
  const scores = getHighScores();
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  const top = scores.slice(0, 10);
  try {
    localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(top));
  } catch {}
  return top;
}
