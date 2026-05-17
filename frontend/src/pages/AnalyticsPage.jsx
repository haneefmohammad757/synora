import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Target, CheckCircle, Clock, Zap, Flame, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { GUEST_ANALYTICS } from '../utils/guestData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) return (
    <div className="bg-surface border border-white/10 rounded-xl px-4 py-2 shadow-xl text-sm">
      <p className="text-textSecondary mb-1">{label}</p>
      <p className="font-bold text-primary">{payload[0].value} tasks</p>
    </div>
  );
  return null;
};

const AnalyticsPage = () => {
  const { isGuest } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isGuest) { setData(GUEST_ANALYTICS); setLoading(false); return; }
    api.get('/api/analytics').then(res => setData(res.data.data)).catch(console.error).finally(() => setLoading(false));
  }, [isGuest]);

  if (loading) return <div className="flex items-center justify-center pt-32"><div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin"/></div>;
  if (!data) return <div className="text-textSecondary">Failed to load analytics.</div>;

  const focusHrs = data.totalFocusTime >= 60 ? `${Math.floor(data.totalFocusTime/60)}h ${data.totalFocusTime%60}m` : data.totalFocusTime > 0 ? `${data.totalFocusTime}m` : '—';
  const statCards = [
    {icon:Target, label:'Total Tasks', value:data.totalTasks, color:'text-primary bg-primary/15'},
    {icon:CheckCircle, label:'Completed', value:data.completedTasks, color:'text-success bg-success/15'},
    {icon:Zap, label:'Completion Rate', value:`${data.completionRate}%`, color:'text-secondary bg-secondary/15'},
    {icon:Clock, label:'Focus Time', value:focusHrs, color:'text-primary bg-primary/15'},
    {icon:Flame, label:'Streak', value:data.streak > 0 ? `${data.streak}d` : '—', color:'text-orange-400 bg-orange-500/15'},
    {icon:TrendingUp, label:'Pending', value:data.totalTasks - data.completedTasks, color:'text-yellow-400 bg-yellow-500/15'},
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Analytics <span className="text-gradient">&amp; Insights</span></h1>
        <p className="text-textSecondary text-sm md:text-base">Your real-time productivity data — tracked live from your activity.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="glass-card p-4 flex flex-col gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color}`}><card.icon className="w-4 h-4"/></div>
            <div className="text-2xl font-bold tracking-tight">{card.value}</div>
            <div className="text-xs text-textSecondary">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-bold mb-1">Tasks Completed — Last 7 Days</h3>
          <p className="text-xs text-textSecondary mb-6">{data.trend.reduce((a,b)=>a+b.completed,0)} total this week</p>
          <div className="h-[180px] md:h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.trend} barSize={28}>
                <defs><linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#a855f7"/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false}/>
                <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} fontSize={12}/>
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} fontSize={12} allowDecimals={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Bar dataKey="completed" fill="url(#barGrad)" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-1">Cumulative Trend</h3>
          <p className="text-xs text-textSecondary mb-6">Running total this week</p>
          <div className="h-[180px] md:h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trend.map((d,i)=>({...d,cumulative:data.trend.slice(0,i+1).reduce((a,b)=>a+b.completed,0)}))}>
                <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={0.3}/><stop offset="100%" stopColor="#6366f1" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false}/>
                <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} fontSize={11}/>
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} fontSize={11} allowDecimals={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Area type="monotone" dataKey="cumulative" stroke="#6366f1" strokeWidth={2} fill="url(#areaGrad)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg md:text-xl font-bold mb-4">AI-Generated Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.insights.length > 0 ? data.insights.map((insight, idx) => (
            <div key={idx} className="glass-card p-4 border border-primary/15 bg-primary/5 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5"><Zap className="w-3.5 h-3.5 text-primary"/></div>
              <p className="text-sm text-textPrimary leading-relaxed">{insight}</p>
            </div>
          )) : (
            <div className="col-span-2 glass-card p-8 text-center text-textSecondary">Complete tasks to generate AI insights.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
