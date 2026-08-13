export type Choice = 'snake' | 'water' | 'gun';
export type Result = 'win' | 'lose' | 'draw';
export type GameState = 'start' | 'playing' | 'countdown' | 'result' | 'paused' | 'gameover';

export interface RoundResult {
  playerChoice: Choice;
  cpuChoice: Choice;
  result: Result;
  round: number;
}

export interface HighScoreEntry {
  score: number;
  streak: number;
  rounds: number;
  date: string;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'spark' | 'confetti' | 'ring' | 'star';
  rotation: number;
  rotationSpeed: number;
}
