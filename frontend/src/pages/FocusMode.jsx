import { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Play, Pause, RotateCcw, Coffee, Brain, CheckCircle } from 'lucide-react';

const MODES = {
  focus: { label: 'Focus', duration: 25 * 60, color: 'text-primary', bg: 'bg-primary' },
  short: { label: 'Short Break', duration: 5 * 60, color: 'text-success', bg: 'bg-success' },
  long: { label: 'Long Break', duration: 15 * 60, color: 'text-secondary', bg: 'bg-secondary' },
};

const FocusMode = () => {
  const { isGuest } = useAuth();
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [isActive, setIsActive] = useState(false);
  const [sessionsToday, setSessionsToday] = useState(0);
  const intervalRef = useRef(null);
  const cur = MODES[mode];
  const progress = ((cur.duration - timeLeft) / cur.duration) * 100;
  const radius = 110;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (progress / 100) * circ;

  const switchMode = (m) => { setIsActive(false); setMode(m); setTimeLeft(MODES[m].duration); };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => setTimeLeft(p => p - 1), 1000);
    } else if (timeLeft === 0) {
      clearInterval(intervalRef.current);
      setIsActive(false);
      if (mode === 'focus') {
        setSessionsToday(s => s + 1);
        // Skip API call for guest users — timer still works fully
        if (!isGuest) api.post('/api/focus', { duration: 25 }).catch(console.error);
      }
    }
    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, mode]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const strokeColor = mode === 'focus' ? '#6366f1' : mode === 'short' ? '#22c55e' : '#a855f7';
  const glowColor = mode === 'focus' ? '#6366f140' : mode === 'short' ? '#22c55e40' : '#a855f740';

  return (
    <div className="max-w-lg mx-auto text-center space-y-7 md:space-y-10 animate-fade-in pt-4 md:pt-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2"><span className="text-gradient">Focus Mode</span></h1>
        <p className="text-textSecondary text-sm md:text-base">Stay in the zone with the Pomodoro Technique.</p>
      </div>

      <div className="flex justify-center gap-2 p-1.5 bg-surface/60 backdrop-blur rounded-2xl border border-white/10 w-fit mx-auto">
        {Object.entries(MODES).map(([key, val]) => (
          <button key={key} onClick={() => switchMode(key)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === key ? `${val.bg} text-white shadow-lg` : 'text-textSecondary hover:bg-white/5'}`}>{val.label}</button>
        ))}
      </div>

      {/* Timer — 240px on mobile, 280px on md+ */}
      <div className="relative flex items-center justify-center">
        <svg className="-rotate-90 w-[240px] h-[240px] md:w-[280px] md:h-[280px]" viewBox="0 0 280 280">
          <circle cx="140" cy="140" r={radius} fill="none" stroke="#1e1e1e" strokeWidth="10"/>
          <circle cx="140" cy="140" r={radius} fill="none" stroke={strokeColor} strokeWidth="10" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{transition:'stroke-dashoffset 1s linear'}}/>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[44px] md:text-[56px] font-bold leading-none tracking-tighter font-mono">{String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}</div>
          <div className={`text-sm font-semibold mt-2 ${cur.color}`}>{cur.label}</div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button onClick={() => { setIsActive(false); setTimeLeft(cur.duration); }} className="w-12 h-12 rounded-full bg-surface border border-white/10 text-textSecondary hover:text-white flex items-center justify-center transition-all hover:scale-110"><RotateCcw className="w-5 h-5"/></button>
        <button onClick={() => setIsActive(!isActive)} className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-105 active:scale-95 ${cur.bg}`} style={{boxShadow:`0 0 40px ${glowColor}`}}>
          {isActive ? <Pause className="w-8 h-8"/> : <Play className="w-8 h-8 ml-1"/>}
        </button>
        <button onClick={() => switchMode(mode === 'focus' ? 'short' : 'focus')} className="w-12 h-12 rounded-full bg-surface border border-white/10 text-textSecondary hover:text-white flex items-center justify-center transition-all hover:scale-110">
          {mode === 'focus' ? <Coffee className="w-5 h-5"/> : <Brain className="w-5 h-5"/>}
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-textSecondary">
        <CheckCircle className="w-4 h-4 text-success"/>
        <span>{sessionsToday} session{sessionsToday !== 1 ? 's' : ''} completed today</span>
      </div>

      <div className="glass-card p-5 text-left">
        <h3 className="font-bold mb-3 text-sm">How Pomodoro Works</h3>
        <div className="space-y-2 text-sm text-textSecondary">
          <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">1</span>Focus for 25 minutes</div>
          <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-success/20 text-success text-xs font-bold flex items-center justify-center">2</span>Take a 5 minute break</div>
          <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-full bg-secondary/20 text-secondary text-xs font-bold flex items-center justify-center">3</span>After 4 sessions, take a long break</div>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
