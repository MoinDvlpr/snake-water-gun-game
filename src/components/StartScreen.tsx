import { HighScoreEntry } from '../types';

interface Props {
  onStart: () => void;
  highScores: HighScoreEntry[];
}

export default function StartScreen({ onStart, highScores }: Props) {
  return (
    <div className="scanlines flex flex-col items-center justify-center min-h-screen px-4 py-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-56 h-56 bg-green-500/[0.04] rounded-full blur-[80px] animate-float" />
        <div className="absolute bottom-1/3 right-1/5 w-72 h-72 bg-cyan-500/[0.04] rounded-full blur-[80px] animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-purple-500/[0.03] rounded-full blur-[80px] animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-7 max-w-sm w-full">
        {/* Animated Icons */}
        <div className="flex items-center justify-center gap-4 text-5xl sm:text-7xl mb-1">
          <span className="animate-float drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]" style={{ animationDelay: '0s' }}>🐍</span>
          <span className="animate-float drop-shadow-[0_0_15px_rgba(0,255,245,0.3)]" style={{ animationDelay: '0.6s' }}>💧</span>
          <span className="animate-float drop-shadow-[0_0_15px_rgba(255,0,110,0.3)]" style={{ animationDelay: '1.2s' }}>🔫</span>
        </div>

        {/* Title */}
        <div className="text-center animate-slide-up">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            SNAKE WATER GUN
          </h1>
          <p className="mt-2 text-white/30 text-xs sm:text-sm font-semibold tracking-[0.3em] uppercase">
            The Arena Awaits
          </p>
        </div>

        {/* Rules Card */}
        <div className="glass rounded-2xl p-4 sm:p-5 w-full animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">Rules of Combat</h3>
          <div className="space-y-2.5">
            <RuleRow emoji="🐍" action="drinks" target="💧 Water" color="text-green-400" />
            <RuleRow emoji="💧" action="douses" target="🔫 Gun" color="text-cyan-400" />
            <RuleRow emoji="🔫" action="shoots" target="🐍 Snake" color="text-red-400" />
          </div>
          <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-white/25 text-center">
            3 lives • Win streaks = bonus points • Best of ∞
          </div>
        </div>

        {/* Controls hint */}
        <div className="flex gap-4 text-[11px] text-white/20 font-medium animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <span>⌨️ S / W / G</span>
          <span>•</span>
          <span>📱 Tap to play</span>
        </div>

        {/* Play button */}
        <button
          onClick={onStart}
          className="w-full py-4 rounded-2xl font-extrabold text-base sm:text-lg uppercase tracking-widest bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:scale-[1.03] active:scale-[0.97] transition-all animate-slide-up relative overflow-hidden"
          style={{ animationDelay: '0.2s' }}
        >
          <span className="relative z-10">⚔️ Enter the Arena</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700" />
        </button>

        <p className="text-[10px] text-white/15 animate-slide-up" style={{ animationDelay: '0.25s' }}>
          Press ENTER or SPACE to start
        </p>

        {/* High scores */}
        {highScores.length > 0 && (
          <div className="glass rounded-2xl p-4 sm:p-5 w-full animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-3">🏆 Hall of Fame</h3>
            <div className="space-y-2">
              {highScores.slice(0, 5).map((s, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-black w-5 text-center ${
                      i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-white/20'
                    }`}>
                      {i === 0 ? '👑' : `${i + 1}`}
                    </span>
                    <span className="text-white/60 font-semibold tabular-nums">{s.score.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-white/25 tabular-nums">
                    <span>🔥{s.streak}</span>
                    <span>{s.rounds}R</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RuleRow({ emoji, action, target, color }: { emoji: string; action: string; target: string; color: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-white/60">
      <span className="text-xl w-8 text-center">{emoji}</span>
      <span>
        <span className={`font-bold ${color}`}>{action}</span> {target}
      </span>
    </div>
  );
}
