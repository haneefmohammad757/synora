import { Link } from 'react-router-dom';
import { Zap, Calendar, Clock, CheckCircle, BarChart2, Target, ArrowRight, Star } from 'lucide-react';

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

const LandingPage = () => (
  <div className="min-h-screen bg-background">
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Synora</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-textSecondary">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="btn-secondary text-sm">Log in</Link>
          <Link to="/signup" className="btn-primary text-sm">Get Started</Link>
        </div>
      </div>
    </nav>

    <section className="max-w-7xl mx-auto px-6 pt-40 pb-28 text-center relative">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="relative">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-sm font-medium text-primary animate-fade-in">
          <Zap className="w-3.5 h-3.5" /> AI-Powered Study Planning
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight animate-slide-up">
          From <span className="text-gradient">Chaos</span><br />to <span className="text-gradient">Clarity</span>
        </h1>
        <p className="text-lg md:text-xl text-textSecondary max-w-2xl mx-auto mb-10 leading-relaxed">
          An AI-powered productivity system that helps students study smarter, manage backlog, and achieve consistency.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/signup" className="btn-primary text-base px-8 py-3 flex items-center gap-2 justify-center shadow-xl shadow-primary/20">
            Start for Free <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/login" className="btn-secondary text-base px-8 py-3 flex items-center gap-2 justify-center">
            Demo Account
          </Link>
        </div>
        <p className="text-xs text-textSecondary mt-4">No credit card required.</p>
      </div>
    </section>

    <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Everything you need to <span className="text-gradient">study smarter</span></h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div key={i} className="glass-card flex flex-col items-start text-left">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
              <f.icon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-textSecondary leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    <section id="testimonials" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Students <span className="text-gradient">love Synora</span></h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className="glass-card flex flex-col gap-4">
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

    <section className="max-w-4xl mx-auto px-6 py-24 text-center">
      <div className="glass-card p-12 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to study smarter?</h2>
        <p className="text-textSecondary mb-8 max-w-lg mx-auto">Join students already using Synora to clear their backlog and achieve consistency.</p>
        <Link to="/signup" className="btn-primary text-base px-10 py-3 inline-flex items-center gap-2 shadow-xl shadow-primary/20">
          Create your free account <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>

    <footer className="border-t border-white/5 py-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
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

export default LandingPage;
