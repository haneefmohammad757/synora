import { Link } from 'react-router-dom';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';

/**
 * Subtle amber banner shown at the top of the dashboard when in Guest Demo Mode.
 * Dismissible per session (not persisted — reappears on next visit).
 */
const GuestDemoBanner = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative z-30 w-full">
      {/* Amber gradient bar */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-2.5
                   bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15
                   border-b border-amber-500/20 text-sm"
      >
        {/* Left — icon + message */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Pulsing badge */}
          <div className="flex items-center gap-1.5 shrink-0 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
              Guest Demo
            </span>
          </div>

          <span className="text-amber-200/70 text-xs hidden sm:inline">
            Your data won't be saved permanently.
          </span>
        </div>

        {/* Right — CTA + dismiss */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/signup"
            className="flex items-center gap-1.5 text-xs font-semibold
                       text-amber-300 hover:text-amber-100
                       border border-amber-400/30 hover:border-amber-300/60
                       px-3 py-1 rounded-lg
                       bg-amber-500/10 hover:bg-amber-500/20
                       transition-all duration-150"
          >
            <Sparkles className="w-3 h-3" />
            <span className="hidden xs:inline">Create free account</span>
            <span className="xs:hidden">Sign up</span>
            <ArrowRight className="w-3 h-3" />
          </Link>

          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss demo banner"
            className="p-1.5 text-amber-400/60 hover:text-amber-300
                       hover:bg-white/5 rounded-lg transition-all duration-150"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestDemoBanner;
