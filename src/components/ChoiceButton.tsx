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
        choice-btn glow-border relative flex flex-col items-center gap-1.5 sm:gap-2 md:gap-2.5
        rounded-lg sm:rounded-xl md:rounded-2xl border-2 ${c.border}
        bg-gradient-to-br ${c.bg}
        px-3.5 py-3 sm:px-6 sm:py-5 md:px-8 md:py-6 lg:px-10 lg:py-7
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
      <span className="text-2.5xl sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-lg select-none">
        {CHOICE_EMOJI[choice]}
      </span>
      <span className={`text-[8px] sm:text-[9px] md:text-xs lg:text-sm font-bold uppercase tracking-wide ${c.text}`}>
        {CHOICE_LABELS[choice]}
      </span>
      {/* Key hint badge */}
      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-white/10 text-[7px] sm:text-[8px] md:text-[10px] font-bold text-white/50 backdrop-blur-sm border border-white/10">
        {keyHint}
      </span>
    </button>
  );
}
