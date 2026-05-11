import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Check, Trash2, Zap, Search, Calendar } from 'lucide-react';
import { format, isPast } from 'date-fns';

const defaultForm = { subject: '', topic: '', deadline: '', difficulty: 'medium', importance: 3, estimatedTime: 30 };

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/api/tasks');
      setTasks(res.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleToggleComplete = async (id, current) => {
    try { await api.put(`/api/tasks/${id}`, { completed: !current }); fetchTasks(); } catch (e) { console.error(e); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/api/tasks/${id}`); fetchTasks(); } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/api/tasks', formData); setIsModalOpen(false); setFormData(defaultForm); fetchTasks(); } catch (e) { console.error(e); }
  };

  const filtered = tasks.filter(t => {
    const matchFilter = filter === 'all' ? true : filter === 'pending' ? !t.completed : t.completed;
    const matchSearch = !search || t.topic.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) return <div className="flex items-center justify-center pt-32"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"/></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold">Smart Tasks</h1>
          <p className="text-textSecondary text-sm mt-1">Auto-sorted by AI Priority Score — most urgent first.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4"/> Add Task</button>
      </div>

      <div className="flex flex-wrap gap-3">
        <span className="px-3 py-1 rounded-full text-sm bg-white/5 border border-white/10 text-textSecondary"><span className="font-bold text-textPrimary">{tasks.length}</span> total</span>
        <span className="px-3 py-1 rounded-full text-sm bg-primary/10 border border-primary/20 text-primary"><span className="font-bold">{tasks.filter(t=>!t.completed).length}</span> pending</span>
        <span className="px-3 py-1 rounded-full text-sm bg-success/10 border border-success/20 text-success"><span className="font-bold">{tasks.filter(t=>t.completed).length}</span> completed</span>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary"/>
          <input type="text" placeholder="Search tasks..." className="input-field pl-10" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>
        <div className="flex rounded-lg border border-white/10 overflow-hidden">
          {['all','pending','completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${filter===f?'bg-primary text-white':'bg-surface text-textSecondary hover:bg-white/5'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((task, idx) => {
          const overdue = !task.completed && isPast(new Date(task.deadline));
          return (
            <div key={task._id} className={`glass-card p-4 flex items-center gap-4 group transition-all animate-slide-up ${task.completed?'opacity-50':overdue?'border-danger/30':''}`} style={{animationDelay:`${idx*0.04}s`}}>
              <button onClick={() => handleToggleComplete(task._id, task.completed)} className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${task.completed?'bg-success border-success text-white':'border-textSecondary hover:border-primary hover:scale-110'}`}>
                {task.completed && <Check className="w-3.5 h-3.5"/>}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-textSecondary">{task.subject}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${task.difficulty==='hard'?'bg-danger/20 text-danger':task.difficulty==='medium'?'bg-yellow-500/20 text-yellow-400':'bg-success/20 text-success'}`}>{task.difficulty}</span>
                  {overdue && <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-danger/20 text-danger">Overdue</span>}
                  {!task.completed && <span className="flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-primary/10 text-primary"><Zap className="w-2.5 h-2.5"/>{Math.round(task.priorityScore)}</span>}
                </div>
                <h4 className={`font-semibold text-sm ${task.completed?'line-through text-textSecondary':'text-textPrimary group-hover:text-primary transition-colors'}`}>{task.topic}</h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-textSecondary mt-1">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/>{format(new Date(task.deadline),'MMM do, yyyy')}</span>
                  <span>{task.estimatedTime} min</span>
                  <span>Importance: {task.importance}/5</span>
                </div>
              </div>
              <button onClick={() => handleDelete(task._id)} className="p-2 text-textSecondary hover:text-danger hover:bg-danger/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                <Trash2 className="w-4 h-4"/>
              </button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-xl">
            <div className="text-4xl mb-3">📚</div>
            <p className="font-medium mb-1">{search ? 'No tasks match your search.' : 'No tasks here.'}</p>
            <p className="text-sm text-textSecondary">{filter==='all'?'Add a new task to get started!':'Switch to "all" to see all tasks.'}</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-md animate-slide-up shadow-2xl shadow-primary/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Add New Task</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-textSecondary hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Subject</label><input required type="text" className="input-field" value={formData.subject} onChange={e => setFormData({...formData,subject:e.target.value})} placeholder="e.g. Calculus"/></div>
              <div><label className="block text-sm font-medium mb-1">Topic</label><input required type="text" className="input-field" value={formData.topic} onChange={e => setFormData({...formData,topic:e.target.value})} placeholder="e.g. Chapter 4 - Integrals"/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Deadline</label><input required type="date" className="input-field" value={formData.deadline} onChange={e => setFormData({...formData,deadline:e.target.value})}/></div>
                <div><label className="block text-sm font-medium mb-1">Difficulty</label>
                  <select className="input-field" value={formData.difficulty} onChange={e => setFormData({...formData,difficulty:e.target.value})}>
                    <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium mb-1">Importance (1-5)</label><input required type="number" min="1" max="5" className="input-field" value={formData.importance} onChange={e => setFormData({...formData,importance:parseInt(e.target.value)})}/></div>
                <div><label className="block text-sm font-medium mb-1">Est. Time (mins)</label><input required type="number" min="5" className="input-field" value={formData.estimatedTime} onChange={e => setFormData({...formData,estimatedTime:parseInt(e.target.value)})}/></div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
