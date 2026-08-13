import { Choice } from '../types';
import { CHOICE_EMOJI, CHOICE_LABELS, CHOICE_COLORS } from '../gameLogic';

interface Props {
  choice: Choice;
  onSelect: (c: Choice) => void;
  disabled: boolean;
  keyHint: string;
  delay?: number;
}

export default function ChoiceButton({ choice, onSelect, disabled, keyHint, delay = 0 }: Props) {
  const c = CHOICE_COLORS[choice];

  return (
    <button
      className={`
        choice-btn glow-border relative flex flex-col items-center gap-2
        rounded-2xl border-2 ${c.border}
        bg-gradient-to-br ${c.bg}
        px-5 py-4 sm:px-8 sm:py-6
        shadow-lg ${c.glow}
        backdrop-blur-sm
        transition-all duration-150
        disabled:opacity-30 disabled:pointer-events-none
        animate-bounce-in
        focus:outline-none focus:ring-2 focus:ring-white/20
      `}
      style={{
        animationDelay: `${delay}ms`,
        animationFillMode: 'both',
      }}
      onClick={() => onSelect(choice)}
      disabled={disabled}
      aria-label={`Choose ${CHOICE_LABELS[choice]}`}
    >
      <span className="text-4xl sm:text-5xl drop-shadow-lg select-none">
        {CHOICE_EMOJI[choice]}
      </span>
      <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-widest ${c.text}`}>
        {CHOICE_LABELS[choice]}
      </span>
      {/* Key hint badge */}
      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-white/10 text-[9px] sm:text-[10px] font-bold text-white/50 backdrop-blur-sm border border-white/10">
        {keyHint}
      </span>
    </button>
  );
}
