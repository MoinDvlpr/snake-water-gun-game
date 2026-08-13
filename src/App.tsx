// Copyright © 2026 Mayudin Rathod. All rights reserved.

import { useState, useCallback, useEffect, useRef } from 'react';
import { Choice, GameState, Result, HighScoreEntry } from './types';
import {
  getCpuChoice,
  getResult,
  calculateScore,
  getHighScores,
  saveHighScore,
  CHOICE_EMOJI,
} from './gameLogic';
import { useParticles } from './useParticles';
import { useSounds } from './useSounds';
import ChoiceButton from './components/ChoiceButton';
import StartScreen from './components/StartScreen';
import ResultDisplay from './components/ResultDisplay';
import GameOverScreen from './components/GameOverScreen';
import PauseOverlay from './components/PauseOverlay';

const MAX_LIVES = 3;
const COUNTDOWN_DURATION = 700;
const RESULT_DISPLAY_TIME = 1600;

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [draws, setDraws] = useState(0);
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [cpuChoice, setCpuChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [scoreGained, setScoreGained] = useState(0);
  const [highScores, setHighScores] = useState<HighScoreEntry[]>(getHighScores());
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [countdownText, setCountdownText] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Use refs for values needed in endGame to avoid stale closures
  const scoreRef = useRef(score);
  const maxStreakRef = useRef(maxStreak);
  const roundRef = useRef(round);
  scoreRef.current = score;
  maxStreakRef.current = maxStreak;
  roundRef.current = round;

  const {
    canvasRef,
    emitWin,
    emitLose,
    emitDraw,
    emitConfetti,
    startLoop,
    stopLoop,
  } = useParticles();

  const { playSelect, playWin, playLose, playDraw, playCountdown } = useSounds();

  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setRound(0);
    setLives(MAX_LIVES);
    setStreak(0);
    setMaxStreak(0);
    setWins(0);
    setLosses(0);
    setDraws(0);
    setPlayerChoice(null);
    setCpuChoice(null);
    setResult(null);
    setIsNewHighScore(false);
    setGameState('playing');
    startLoop();
  }, [startLoop]);

  const endGame = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    const currentScore = scoreRef.current;
    const currentMaxStreak = maxStreakRef.current;
    const currentRound = roundRef.current;

    const entry: HighScoreEntry = {
      score: currentScore,
      streak: currentMaxStreak,
      rounds: currentRound,
      date: new Date().toISOString(),
    };

    const newScores = saveHighScore(entry);
    setHighScores(newScores);
    const isNew = newScores.length > 0 && newScores[0].score === currentScore && newScores[0].rounds === currentRound;
    setIsNewHighScore(isNew);
    setGameState('gameover');

    if (isNew) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        emitConfetti(rect.width, rect.height);
      }
    }
  }, [emitConfetti]);

  const makeChoice = useCallback((choice: Choice) => {
    if (gameState !== 'playing') return;

    setPlayerChoice(choice);
    setGameState('countdown');
    setCountdownText('3');
    playSelect();

    setTimeout(() => { setCountdownText('2'); playCountdown(); }, COUNTDOWN_DURATION * 0.33);
    setTimeout(() => { setCountdownText('1'); playCountdown(); }, COUNTDOWN_DURATION * 0.66);

    setTimeout(() => {
      const cpu = getCpuChoice();
      const res = getResult(choice, cpu);
      const newRound = round + 1;
      const newStreak = res === 'win' ? streak + 1 : 0;
      const gained = calculateScore(res, res === 'win' ? newStreak : streak);

      setCpuChoice(cpu);
      setResult(res);
      setRound(newRound);
      setScoreGained(gained);
      setScore(prev => prev + gained);
      setStreak(newStreak);
      setMaxStreak(prev => Math.max(prev, newStreak));
      setGameState('result');

      if (res === 'win') {
        setWins(prev => prev + 1);
        playWin();
      } else if (res === 'lose') {
        setLosses(prev => prev + 1);
        setLives(prev => prev - 1);
        playLose();
      } else {
        setDraws(prev => prev + 1);
        playDraw();
      }

      // Particles and shake
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const cx = rect.width / 2;
        const cy = rect.height / 2 - 40;
        if (res === 'win') {
          emitWin(cx, cy);
        } else if (res === 'lose') {
          emitLose(cx, cy);
          triggerShake();
        } else {
          emitDraw(cx, cy);
        }
      }

      // After display time, transition
      timerRef.current = setTimeout(() => {
        if (res === 'lose' && lives - 1 <= 0) {
          // Game over - endGame will be called via the effect
        } else {
          setPlayerChoice(null);
          setCpuChoice(null);
          setResult(null);
          setGameState('playing');
        }
      }, RESULT_DISPLAY_TIME);
    }, COUNTDOWN_DURATION);
  }, [gameState, round, streak, lives, emitWin, emitLose, emitDraw, triggerShake, playSelect, playCountdown, playWin, playLose, playDraw]);

  // Handle game over transition
  useEffect(() => {
    if (gameState === 'result' && result === 'lose' && lives <= 0) {
      const t = setTimeout(() => {
        endGame();
      }, RESULT_DISPLAY_TIME + 200);
      return () => clearTimeout(t);
    }
  }, [gameState, result, lives, endGame]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (gameState === 'start') {
        if (key === 'enter' || key === ' ') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      if (gameState === 'gameover') {
        if (key === 'enter' || key === ' ') {
          e.preventDefault();
          startGame();
        }
        return;
      }

      if (gameState === 'paused') {
        if (key === 'escape') {
          e.preventDefault();
          setGameState('playing');
        }
        return;
      }

      if (gameState === 'playing') {
        if (key === 'escape') {
          e.preventDefault();
          setGameState('paused');
          return;
        }

        const choiceMap: Record<string, Choice> = {
          '1': 'snake',
          '2': 'water',
          '3': 'gun',
          s: 'snake',
          w: 'water',
          g: 'gun',
        };

        if (choiceMap[key]) {
          e.preventDefault();
          makeChoice(choiceMap[key]);
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState, makeChoice, startGame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLoop();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stopLoop]);

  // Start particle loop when game starts
  useEffect(() => {
    if (gameState !== 'start' && gameState !== 'gameover') {
      startLoop();
    }
  }, [gameState, startLoop]);

  // ─── RENDER ───────────────────────────────────────────────

  if (gameState === 'start') {
    return <StartScreen onStart={startGame} highScores={highScores} />;
  }

  if (gameState === 'gameover') {
    return (
      <div ref={containerRef} className="relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-50"
        />
        <GameOverScreen
          score={score}
          wins={wins}
          losses={losses}
          draws={draws}
          maxStreak={maxStreak}
          rounds={round}
          isNewHighScore={isNewHighScore}
          highScores={highScores}
          onRestart={startGame}
          onHome={() => {
            setHighScores(getHighScores());
            setGameState('start');
          }}
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`scanlines relative flex flex-col items-center justify-between min-h-screen px-4 py-5 sm:py-6 overflow-hidden ${shaking ? 'animate-shake' : ''}`}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
      />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {result === 'win' && (
          <div className="absolute inset-0 bg-gradient-radial transition-all duration-500">
            <div className="absolute inset-0 bg-green-500/[0.07]" />
          </div>
        )}
        {result === 'lose' && (
          <div className="absolute inset-0 transition-all duration-500">
            <div className="absolute inset-0 bg-red-500/[0.07]" />
          </div>
        )}
        {result === 'draw' && (
          <div className="absolute inset-0 transition-all duration-500">
            <div className="absolute inset-0 bg-yellow-500/[0.05]" />
          </div>
        )}
        {/* Ambient background blobs */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-purple-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-cyan-500/[0.03] rounded-full blur-3xl" />
      </div>

      {/* ─── TOP BAR ─── */}
      <div className="relative z-10 w-full max-w-lg">
        <div className="flex items-center justify-between">
          {/* Lives */}
          <div className="flex items-center gap-1.5" key={lives}>
            {Array.from({ length: MAX_LIVES }).map((_, i) => (
              <span
                key={i}
                className={`text-base sm:text-lg transition-all duration-300 ${
                  i < lives ? 'opacity-100 scale-100' : 'opacity-20 scale-75 grayscale'
                } ${i === lives && result === 'lose' ? 'life-lost' : ''}`}
                style={{
                  transitionDelay: i < lives ? '0ms' : `${(MAX_LIVES - i) * 100}ms`,
                }}
              >
                {i < lives ? '❤️' : '🖤'}
              </span>
            ))}
          </div>

          {/* Score */}
          <div className="text-center flex-1">
            <div
              key={score}
              className={`text-2xl sm:text-3xl font-black bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent tabular-nums ${score > 0 ? 'score-pop' : ''}`}
            >
              {score.toLocaleString()}
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold">
              Score
            </div>
          </div>

          {/* Right side: streak, round, pause */}
          <div className="flex items-center gap-2">
            {streak >= 2 && (
              <span className="text-xs sm:text-sm font-bold text-orange-400 animate-streak-fire tabular-nums">
                🔥{streak}
              </span>
            )}
            <span className="text-xs font-bold text-white/30 tabular-nums">
              R{round + (gameState === 'playing' ? 1 : 0)}
            </span>
            <button
              onClick={() => setGameState('paused')}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 active:scale-90 transition-all text-white/40 text-sm border border-white/5"
              aria-label="Pause"
            >
              ⏸
            </button>
          </div>
        </div>
      </div>

      {/* ─── CENTER AREA ─── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full max-w-lg">
        {/* COUNTDOWN STATE */}
        {gameState === 'countdown' && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-6xl sm:text-8xl animate-slam-in drop-shadow-2xl">
              {playerChoice && CHOICE_EMOJI[playerChoice]}
            </div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/30">
              Your pick
            </div>

            <div className="mt-4 relative">
              <span
                key={countdownText}
                className="text-5xl sm:text-6xl font-black text-white/20 animate-countdown-pop block"
              >
                {countdownText}
              </span>
            </div>

            <div className="flex gap-3 mt-3">
              {['🐍', '💧', '🔫'].map((e, i) => (
                <span
                  key={i}
                  className="text-xl sm:text-2xl opacity-20 animate-float"
                  style={{ animationDuration: '0.4s', animationDelay: `${i * 0.12}s` }}
                >
                  {e}
                </span>
              ))}
            </div>
            <div className="text-[11px] text-white/20 font-medium tracking-wider">
              CPU is choosing...
            </div>
          </div>
        )}

        {/* RESULT STATE */}
        {gameState === 'result' && playerChoice && cpuChoice && result && (
          <ResultDisplay
            playerChoice={playerChoice}
            cpuChoice={cpuChoice}
            result={result}
            scoreGained={scoreGained}
            streak={streak}
          />
        )}

        {/* PLAYING STATE */}
        {gameState === 'playing' && (
          <div className="flex flex-col items-center gap-4 animate-slide-up">
            <div className="flex gap-4 text-4xl sm:text-5xl mb-2">
              <span className="animate-float" style={{ animationDelay: '0s' }}>🐍</span>
              <span className="animate-float" style={{ animationDelay: '0.4s' }}>💧</span>
              <span className="animate-float" style={{ animationDelay: '0.8s' }}>🔫</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white/60">
              Choose your weapon
            </h2>
            <p className="text-xs text-white/25 max-w-[200px] text-center">
              Win rounds to score. Lose 3 and it's game over!
            </p>
          </div>
        )}
      </div>

      {/* ─── BOTTOM - CHOICE BUTTONS ─── */}
      <div className="relative z-10 w-full max-w-4xl px-2 sm:px-3 mb-16 sm:mb-12 md:mb-14">
        {gameState === 'playing' ? (
          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5">
            <ChoiceButton choice="snake" onSelect={makeChoice} disabled={false} keyHint="S" delay={0} />
            <ChoiceButton choice="water" onSelect={makeChoice} disabled={false} keyHint="W" delay={50} />
            <ChoiceButton choice="gun" onSelect={makeChoice} disabled={false} keyHint="G" delay={100} />
          </div>
        ) : (
          <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 opacity-20 pointer-events-none">
            <ChoiceButton choice="snake" onSelect={() => {}} disabled={true} keyHint="S" />
            <ChoiceButton choice="water" onSelect={() => {}} disabled={true} keyHint="W" />
            <ChoiceButton choice="gun" onSelect={() => {}} disabled={true} keyHint="G" />
          </div>
        )}
      </div>

      {/* PAUSE OVERLAY */}
      {gameState === 'paused' && (
        <PauseOverlay
          onResume={() => setGameState('playing')}
          onQuit={() => endGame()}
        />
      )}

      {/* COPYRIGHT FOOTER */}
      <div className="fixed bottom-1 left-0 right-0 flex justify-center px-2 text-[9px] sm:text-[10px] md:text-xs text-white/40 font-medium tracking-wide pointer-events-none whitespace-nowrap overflow-hidden text-ellipsis">
        <span>© 2026 Mayudin Rathod. All rights reserved.</span>
      </div>
    </div>
  );
}
