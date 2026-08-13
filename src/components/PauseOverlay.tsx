interface Props {
  onResume: () => void;
  onQuit: () => void;
}

export default function PauseOverlay({ onResume, onQuit }: Props) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md">
      <div className="flex flex-col items-center gap-5 p-7 glass rounded-3xl max-w-xs w-full mx-4 animate-bounce-in border border-white/10">
        <div className="text-5xl">⏸️</div>
        <h2 className="text-2xl font-black text-white/80 tracking-wide">PAUSED</h2>
        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={onResume}
            className="w-full py-3.5 rounded-xl font-bold uppercase tracking-wider text-sm bg-gradient-to-r from-green-500 to-cyan-500 text-white shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            ▶️ Resume
          </button>
          <button
            onClick={onQuit}
            className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-xs border border-white/10 text-white/50 hover:bg-white/5 hover:text-white/70 active:scale-95 transition-all"
          >
            🏳️ Quit &amp; Save Score
          </button>
        </div>
        <p className="text-[10px] text-white/20">Press ESC to resume</p>
      </div>
    </div>
  );
}
