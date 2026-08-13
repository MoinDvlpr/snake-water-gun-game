import { HighScoreEntry } from '../types';

interface Props {
  score: number;
  wins: number;
  losses: number;
  draws: number;
  maxStreak: number;
  rounds: number;
  isNewHighScore: boolean;
  highScores: HighScoreEntry[];
  onRestart: () => void;
  onHome: () => void;
}

export default function GameOverScreen({
  score, wins, losses, draws, maxStreak, rounds,
  isNewHighScore, highScores, onRestart, onHome
}: Props) {
  const winRate = rounds > 0 ? Math.round((wins / rounds) * 100) : 0;

  return (
    <div className="scanlines flex flex-col items-center justify-center min-h-screen px-4 py-8 overflow-auto">
      <div className="flex flex-col items-center gap-5 max-w-sm w-full">
        {/* Header */}
        <div className="text-center animate-slam-in">
          {isNewHighScore ? (
            <>
              <div className="text-5xl mb-2">🏆</div>
              <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-streak-fire">
                NEW HIGH SCORE!
              </h1>
            </>
          ) : (
            <>
              <div className="text-5xl mb-2">💀</div>
              <h1 className="text-3xl sm:text-4xl font-black text-white/70">
                Game Over
              </h1>
            </>
          )}
        </div>

        {/* Score */}
        <div className="glass rounded-2xl p-5 sm:p-6 w-full text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent tabular-nums">
            {score.toLocaleString()}
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-semibold mt-1">
            Total Score
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-1.5 w-full animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <StatCard label="Wins" value={wins} color="text-green-400" />
          <StatCard label="Losses" value={losses} color="text-red-400" />
          <StatCard label="Draws" value={draws} color="text-yellow-400" />
          <StatCard label="Streak" value={maxStreak} color="text-orange-400" icon="🔥" />
          <StatCard label="Win%" value={`${winRate}`} color="text-cyan-400" icon="📊" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 w-full animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={onHome}
            className="flex-1 py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs border border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70 active:scale-95 transition-all"
          >
            🏠 Home
          </button>
          <button
            onClick={onRestart}
            className="flex-[2.5] py-3.5 rounded-xl font-extrabold uppercase tracking-wider text-sm bg-gradient-to-r from-green-500 to-cyan-500 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:scale-[1.02] active:scale-95 transition-all"
          >
            ⚔️ Play Again
          </button>
        </div>

        {/* High Scores */}
        {highScores.length > 0 && (
          <div className="glass rounded-2xl p-4 sm:p-5 w-full animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">
              🏆 Leaderboard
            </h3>
            <div className="space-y-2">
              {highScores.slice(0, 7).map((s, i) => {
                const isCurrent = s.score === score && s.rounds === rounds;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between text-sm rounded-lg px-2 py-1 transition-all ${
                      isCurrent ? 'bg-green-500/10 border border-green-500/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs font-black w-5 text-center ${
                        i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-white/20'
                      }`}>
                        {i === 0 ? '👑' : `${i + 1}`}
                      </span>
                      <span className={`font-semibold tabular-nums ${isCurrent ? 'text-green-400' : 'text-white/60'}`}>
                        {s.score.toLocaleString()}
                      </span>
                      {isCurrent && <span className="text-[9px] text-green-400/70 font-bold uppercase">← You</span>}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-white/25 tabular-nums">
                      <span>🔥{s.streak}</span>
                      <span>{s.rounds}R</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className="text-[10px] text-white/15 animate-slide-up" style={{ animationDelay: '0.35s' }}>
          Press SPACE or ENTER to play again
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: string | number; color: string; icon?: string }) {
  return (
    <div className="glass rounded-xl p-2.5 text-center">
      <div className={`text-base sm:text-lg font-bold ${color} tabular-nums`}>
        {icon && <span className="text-xs">{icon}</span>}
        {value}
      </div>
      <div className="text-[9px] uppercase tracking-wider text-white/25 font-semibold mt-0.5">{label}</div>
    </div>
  );
}
