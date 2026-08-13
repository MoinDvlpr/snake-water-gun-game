import { Choice, Result } from '../types';
import { CHOICE_EMOJI, RESULT_CONFIG, getWinExplanation } from '../gameLogic';

interface Props {
  playerChoice: Choice;
  cpuChoice: Choice;
  result: Result;
  scoreGained: number;
  streak: number;
}

export default function ResultDisplay({ playerChoice, cpuChoice, result, scoreGained, streak }: Props) {
  const config = RESULT_CONFIG[result];
  const explanation = result === 'win'
    ? getWinExplanation(playerChoice, cpuChoice)
    : result === 'lose'
    ? getWinExplanation(cpuChoice, playerChoice)
    : '🤝 Same choice!';

  return (
    <div className="flex flex-col items-center gap-5">
      {/* VS Display */}
      <div className="flex items-center gap-8 sm:gap-12">
        {/* Player */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`text-6xl sm:text-7xl animate-slam-in ${
              result === 'win' ? 'drop-shadow-[0_0_20px_rgba(57,255,20,0.4)]' : ''
            }`}
          >
            {CHOICE_EMOJI[playerChoice]}
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
            result === 'win' ? 'text-green-400' : result === 'lose' ? 'text-white/30' : 'text-white/40'
          }`}>
            You
          </span>
        </div>

        {/* VS badge */}
        <div className="animate-bounce-in" style={{ animationDelay: '0.15s' }}>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-xs sm:text-sm font-black text-white/25">VS</span>
          </div>
        </div>

        {/* CPU */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`text-6xl sm:text-7xl animate-slam-in ${
              result === 'lose' ? 'drop-shadow-[0_0_20px_rgba(255,0,110,0.4)]' : ''
            }`}
            style={{ animationDelay: '0.1s' }}
          >
            {CHOICE_EMOJI[cpuChoice]}
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
            result === 'lose' ? 'text-red-400' : result === 'win' ? 'text-white/30' : 'text-white/40'
          }`}>
            CPU
          </span>
        </div>
      </div>

      {/* Result Label */}
      <div className="text-center animate-bounce-in" style={{ animationDelay: '0.2s' }}>
        <h2 className={`text-3xl sm:text-4xl font-black ${config.color} ${
          result === 'win' ? 'animate-streak-fire' : ''
        }`}>
          {config.label}
        </h2>
        <p className="mt-1.5 text-xs text-white/40">{explanation}</p>
      </div>

      {/* Score gained */}
      <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        {scoreGained > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black text-neon-green tabular-nums">
              +{scoreGained}
            </span>
            {streak >= 2 && (
              <span className="text-sm font-bold text-orange-400 animate-streak-fire">
                🔥 {streak}x Streak!
              </span>
            )}
          </div>
        )}
        {scoreGained === 0 && result === 'draw' && (
          <span className="text-sm font-bold text-yellow-400/60 tabular-nums">+10</span>
        )}
      </div>
    </div>
  );
}
