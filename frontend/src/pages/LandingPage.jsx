import { Link, useNavigate } from 'react-router-dom';
import { Zap, Calendar, Clock, CheckCircle, BarChart2, Target, ArrowRight, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: Zap, color: 'bg-primary/15 text-primary', title: 'AI Smart Planner', desc: 'Auto-sorts tasks by urgency, difficulty, and deadline to generate your perfect daily schedule.' },
  { icon: Calendar, color: 'bg-secondary/15 text-secondary', title: 'Backlog Recovery', desc: 'Missed days? Synora auto-redistributes unfinished tasks to get you back on track.' },
  { icon: Clock, color: 'bg-success/15 text-success', title: 'Pomodoro Focus Mode', desc: 'Built-in timer with session tracking and stats linked to your analytics.' },
  { icon: BarChart2, color: 'bg-orange-500/15 text-orange-400', title: 'AI Insights', desc: 'Intelligent analysis of your study patterns to surface personalized recommendations.' },
  { icon: Target, color: 'bg-primary/15 text-primary', title: 'Streak Rewards', desc: 'Stay consistent with a daily streak tracker powered by your real activity.' },
  { icon: CheckCircle, color: 'bg-success/15 text-success', title: 'Smart Task Management', desc: 'Tasks auto-rank by a real-time priority score based on deadline, difficulty, and importance.' },
];

const testimonials = [
  { name: 'Aisha K.', role: 'Engineering Student', quote: 'Synora completely changed how I study. I went from chaotic all-nighters to finishing assignments days early.', stars: 5 },
  { name: 'Saniya', role: 'Intermediate Student', quote: 'The backlog recovery feature is a lifesaver. I had a terrible week and it just sorted everything out for me.', stars: 5 },
  { name: 'Priya S.', role: 'CS Undergrad', quote: 'The AI insights actually feel personal. It told me my Physics tasks were always delayed — it was right!', stars: 5 },
];

function LandingPage() {
  const { enterGuestMode } = useAuth();
  const navigate = useNavigate();

  /** Instant — no API call, no spinner, no error state */
  const handleDemo = () => {
    enterGuestMode();
    navigate('/dashboard');
  };

  return (
  <div className="min-h-screen bg-background overflow-x-hidden">

    {/* ── Navbar ── */}
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Synora</span>
        </div>

        {/* Desktop nav links — hidden on mobile */}
        <div className="hidden md:flex items-center gap-8 text-sm text-textSecondary">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
        </div>

        {/* Auth buttons — compact on mobile */}
        <div className="flex gap-2 md:gap-3">
          <Link to="/login" className="btn-secondary text-sm py-2 px-3 md:px-4">Log in</Link>
          <Link to="/signup" className="btn-primary text-sm py-2 px-3 md:px-4">Get Started</Link>
        </div>
      </div>
    </nav>

    {/* ── Hero Section ── */}
    <section className="max-w-7xl mx-auto px-4 md:px-6 pt-28 md:pt-40 pb-16 md:pb-28 text-center relative">
      {/* Background glow — smaller on mobile */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[280px] md:w-[600px] h-[200px] md:h-[300px] bg-primary/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      <div className="relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-5 md:mb-6 px-3 md:px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-xs md:text-sm font-medium text-primary animate-fade-in">
          <Zap className="w-3 h-3 md:w-3.5 md:h-3.5" /> AI-Powered Study Planning
        </div>

        {/* Main heading — responsive size */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 tracking-tight leading-tight animate-slide-up">
          From <span className="text-gradient">Chaos</span><br />to <span className="text-gradient">Clarity</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-xl text-textSecondary max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-2 md:px-0">
          An AI-powered productivity system that helps students study smarter, manage backlog, and achieve consistency.
        </p>

        {/* CTA — primary button + inline demo link */}
        <div className="flex flex-col items-center gap-4 px-2 sm:px-0">
          {/* Primary CTA */}
          <Link
            to="/signup"
            className="btn-primary text-sm md:text-base px-8 md:px-10 py-3 flex items-center gap-2 justify-center
                       shadow-xl shadow-primary/25 w-full sm:w-auto
                       hover:scale-105 hover:shadow-primary/40 active:scale-95
                       transition-all duration-200"
          >
            Start for Free <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Inline demo link — instant, no API call */}
          <button
            onClick={handleDemo}
            className="flex items-center gap-1.5 text-sm text-textSecondary hover:text-primary
                       transition-colors duration-200 group"
          >
            Try Live Demo <span className="group-hover:translate-x-0.5 transition-transform duration-200 inline-block">→</span>
          </button>
          <p className="text-xs text-textSecondary -mt-2">No credit card required.</p>
        </div>
      </div>
    </section>

    {/* ── Features Section ── */}
    <section id="features" className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 border-t border-white/5">
      <div className="text-center mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 px-2 md:px-0">
          Everything you need to <span className="text-gradient">study smarter</span>
        </h2>
      </div>
      {/* Mobile: 1-col, md: 2-col, lg: 3-col */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {features.map((f, i) => (
          <div key={i} className="glass-card flex flex-col items-start text-left">
            <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center mb-3 md:mb-4 ${f.color}`}>
              <f.icon className="w-5 h-5" />
            </div>
            <h3 className="text-base md:text-lg font-semibold mb-1.5 md:mb-2">{f.title}</h3>
            <p className="text-sm text-textSecondary leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ── Testimonials Section ── */}
    <section id="testimonials" className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 border-t border-white/5">
      <div className="text-center mb-10 md:mb-14">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
          Students <span className="text-gradient">love Synora</span>
        </h2>
      </div>
      {/* Mobile: 1-col, md: 3-col */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="glass-card flex flex-col gap-3 md:gap-4">
            <div className="flex">{[...Array(t.stars)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
            <p className="text-textSecondary text-sm leading-relaxed italic">"{t.quote}"</p>
            <div className="mt-auto">
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-textSecondary">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* ── Bottom CTA ── */}
    <section className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
      <div className="glass-card p-8 md:p-12 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Ready to study smarter?</h2>
        <p className="text-textSecondary mb-6 md:mb-8 max-w-lg mx-auto text-sm md:text-base">
          Join students already using Synora to clear their backlog and achieve consistency.
        </p>
        <Link
          to="/signup"
          className="btn-primary text-sm md:text-base px-8 md:px-10 py-3 inline-flex items-center gap-2
                     shadow-xl shadow-primary/20 w-full sm:w-auto justify-center
                     hover:scale-105 hover:shadow-primary/40 active:scale-95 transition-all duration-200"
        >
          Create your free account <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>

    {/* ── Footer ── */}
    <footer className="border-t border-white/5 py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold">Synora</span>
        </div>
        <p className="text-xs text-textSecondary">© 2026 Synora. Built for students who mean business.</p>
      </div>
    </footer>
  </div>
  );
}

export default LandingPage;
