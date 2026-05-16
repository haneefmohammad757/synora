import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, CheckCircle, Clock, Zap, Flame, ArrowRight, AlertTriangle, Target } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const quotes = ["The secret of getting ahead is getting started.", "Don't watch the clock; do what it does. Keep going.", "Push yourself, because no one else is going to do it for you.", "Great things never come from comfort zones.", "Success doesn't just find you. You have to go out and get it.", "Dream it. Wish it. Do it.", "It always seems impossible until it's done."];

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [aiMessage, setAiMessage] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const quote = quotes[new Date().getDay() % quotes.length];

  useEffect(() => {
    const fetch = async () => {
      try {
        const [t, r, a] = await Promise.all([
          api.get('/api/tasks'),
          api.get('/api/tasks/recommendations'),
          api.get('/api/analytics'),
        ]);
        setTasks(t.data.data);
        setRecommendations(r.data.data.recommendations);
        setAiMessage(r.data.data.message);
        setAnalytics(a.data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full pt-32">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-textSecondary text-sm">Loading your dashboard...</p>
      </div>
    </div>
  );

  const now = new Date();
  const progress = analytics?.completionRate ?? 0;
  const streak = analytics?.streak ?? 0;
  const totalFocusTime = analytics?.totalFocusTime ?? 0;
  const focusDisplay = totalFocusTime >= 60 ? `${Math.floor(totalFocusTime/60)}h ${totalFocusTime%60}m` : totalFocusTime > 0 ? `${totalFocusTime}m` : '—';
  const overdueTasks = tasks.filter(t => !t.completed && new Date(t.deadline) < now);
  const upcomingDeadlines = tasks.filter(t => !t.completed).sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 4);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <header className="flex justify-between items-start md:items-end flex-wrap gap-3">
        <div>
          <p className="text-xs md:text-sm text-textSecondary mb-1">{format(now, 'EEEE, MMMM do, yyyy')}</p>
          <h1 className="text-2xl md:text-3xl font-bold">Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>!</h1>
          <p className="text-textSecondary mt-1 text-sm italic hidden sm:block">"{quote}"</p>
        </div>
        <Link to="/tasks" className="btn-primary flex items-center gap-2 text-sm shrink-0"><span>+</span> Add Task</Link>
      </header>

      {overdueTasks.length > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-danger/10 border border-danger/20">
          <AlertTriangle className="text-danger w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-danger text-sm">Overdue Tasks Detected</h3>
            <p className="text-xs text-textSecondary mt-0.5">You have {overdueTasks.length} overdue task(s): <span className="text-textPrimary">{overdueTasks.map(t => t.topic).join(', ')}</span>. They've been reprioritized.</p>
          </div>
        </div>
      )}

      <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 flex items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Zap className="text-primary w-4 h-4" />
        </div>
        <div>
          <h3 className="font-semibold text-primary text-sm mb-0.5">AI Smart Planner</h3>
          <p className="text-sm text-textSecondary">{aiMessage || 'Analyzing your schedule...'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
        <div className="glass-card flex flex-col gap-3">
          <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-success/15 text-success flex items-center justify-center"><CheckCircle className="w-5 h-5"/></div><span className="text-sm font-medium text-textSecondary">Task Progress</span></div>
          <div className="text-2xl md:text-3xl font-bold">{progress}%</div>
          <div className="w-full bg-white/5 rounded-full h-1.5"><div className="bg-success h-1.5 rounded-full transition-all duration-1000" style={{width:`${progress}%`}}/></div>
          <p className="text-xs text-textSecondary">{analytics?.completedTasks ?? 0} of {analytics?.totalTasks ?? 0} tasks completed</p>
        </div>
        <div className="glass-card flex flex-col gap-3">
          <div className="flex items-center gap-3"><div className={`w-9 h-9 rounded-lg flex items-center justify-center ${streak > 0 ? 'bg-orange-500/15 text-orange-400' : 'bg-white/5 text-textSecondary'}`}><Flame className="w-5 h-5"/></div><span className="text-sm font-medium text-textSecondary">Study Streak</span></div>
          <div className="text-2xl md:text-3xl font-bold">{streak > 0 ? `${streak} day${streak !== 1 ? 's' : ''}` : '—'}</div>
          <p className="text-xs text-textSecondary">{streak >= 3 ? '🔥 You\'re on fire!' : streak > 0 ? 'Come back tomorrow!' : 'Complete a task to start'}</p>
        </div>
        <div className="glass-card flex flex-col gap-3">
          <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-lg bg-secondary/15 text-secondary flex items-center justify-center"><Clock className="w-5 h-5"/></div><span className="text-sm font-medium text-textSecondary">Focus Time</span></div>
          <div className="text-2xl md:text-3xl font-bold">{focusDisplay}</div>
          <p className="text-xs text-textSecondary">{totalFocusTime > 0 ? 'Total time logged' : 'No sessions yet'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-bold">What Should I Study Now?</h2>
            <Link to="/tasks" className="flex items-center gap-1 text-sm text-primary hover:text-primaryHover">All tasks <ArrowRight className="w-3.5 h-3.5"/></Link>
          </div>
          {recommendations.length > 0 ? (
            <div className="space-y-3">
              {recommendations.map((task, idx) => (
                <div key={task._id} className="glass-card p-4 flex items-center gap-4 group hover:border-primary/30">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">{idx+1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-textSecondary">{task.subject}</span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${task.difficulty==='hard'?'bg-danger/20 text-danger':task.difficulty==='medium'?'bg-yellow-500/20 text-yellow-400':'bg-success/20 text-success'}`}>{task.difficulty}</span>
                    </div>
                    <h4 className="font-semibold text-sm text-textPrimary group-hover:text-primary transition-colors truncate">{task.topic}</h4>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-semibold">{task.estimatedTime} min</div>
                    <div className="text-xs text-textSecondary">{format(new Date(task.deadline), 'MMM d')}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-10 text-center">
              <CheckCircle className="w-10 h-10 text-success mx-auto mb-3 opacity-60"/>
              <p className="font-medium mb-1">You're all caught up!</p>
              <p className="text-sm text-textSecondary">No urgent tasks. Add new tasks to plan ahead.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg md:text-xl font-bold">Upcoming Deadlines</h2>
          <div className="glass-card overflow-hidden p-0">
            {upcomingDeadlines.length > 0 ? (
              <div className="divide-y divide-white/5">
                {upcomingDeadlines.map(task => {
                  const daysLeft = Math.ceil((new Date(task.deadline) - now) / (1000*60*60*24));
                  const isUrgent = daysLeft <= 1;
                  return (
                    <div key={task._id} className="p-4 flex items-center gap-3 hover:bg-white/5 transition-colors">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isUrgent?'bg-danger':daysLeft<=3?'bg-yellow-400':'bg-success'}`}/>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{task.topic}</p>
                        <p className="text-xs text-textSecondary">{task.subject}</p>
                      </div>
                      <div className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${isUrgent?'bg-danger/20 text-danger':'bg-surface text-textSecondary'}`}>
                        {isUrgent ? 'Due today!' : `${daysLeft}d left`}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Calendar className="w-8 h-8 text-textSecondary mx-auto mb-3 opacity-50"/>
                <p className="text-sm text-textSecondary">No upcoming deadlines.</p>
              </div>
            )}
          </div>
          {analytics?.insights?.length > 0 && (
            <div className="glass-card p-4 border border-primary/15 bg-primary/5">
              <div className="flex items-center gap-2 mb-2"><Target className="w-4 h-4 text-primary"/><span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Insight</span></div>
              <p className="text-sm text-textPrimary leading-relaxed">{analytics.insights[0]}</p>
              <Link to="/analytics" className="flex items-center gap-1 text-xs text-primary mt-2 hover:underline">View all insights <ArrowRight className="w-3 h-3"/></Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
