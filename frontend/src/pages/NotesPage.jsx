import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => { fetchNotes(); }, []);
  const fetchNotes = async () => {
    try { const res = await api.get('/api/notes'); setNotes(res.data.data); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  const handleDelete = async (id) => {
    try { await api.delete(`/api/notes/${id}`); fetchNotes(); } catch (e) { console.error(e); }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post('/api/notes', formData); setIsModalOpen(false); setFormData({title:'',content:''}); fetchNotes(); }
    catch (e) { console.error(e); }
  };

  if (loading) return <div className="flex items-center justify-center pt-32"><div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"/></div>;

  return (
    <div className="space-y-5 md:space-y-6 animate-fade-in">
      <div className="flex justify-between items-center gap-3">
        <div><h1 className="text-2xl md:text-3xl font-bold">Quick Notes</h1><p className="text-textSecondary text-sm mt-1">Capture resources and study notes.</p></div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2 shrink-0"><Plus className="w-4 h-4"/> Add Note</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <div key={note._id} className="glass-card flex flex-col group relative">
            <button onClick={() => handleDelete(note._id)} className="absolute top-4 right-4 p-2 text-textSecondary hover:text-danger hover:bg-danger/10 rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"><Trash2 className="w-4 h-4"/></button>
            <h3 className="text-lg font-bold mb-2 pr-8">{note.title}</h3>
            <p className="text-sm text-textSecondary mb-4 flex-1 whitespace-pre-wrap">{note.content}</p>
            <div className="text-xs text-textSecondary mt-auto pt-4 border-t border-white/5">{format(new Date(note.createdAt),'MMM do, yyyy')}</div>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="col-span-full text-center py-12 text-textSecondary border border-dashed border-white/10 rounded-xl">
            <div className="text-4xl mb-3">📝</div>
            <p className="font-medium mb-1">No notes yet.</p>
          </div>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-card w-full max-w-lg animate-slide-up rounded-b-none md:rounded-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Add Note</h2><button onClick={() => setIsModalOpen(false)} className="text-textSecondary hover:text-white text-2xl w-10 h-10 flex items-center justify-center">&times;</button></div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Title</label><input required type="text" className="input-field" style={{fontSize:'16px'}} value={formData.title} onChange={e => setFormData({...formData,title:e.target.value})} placeholder="e.g. Physics Formulas"/></div>
              <div><label className="block text-sm font-medium mb-1">Content</label><textarea required className="input-field min-h-[150px] resize-y" style={{fontSize:'16px'}} value={formData.content} onChange={e => setFormData({...formData,content:e.target.value})} placeholder="Write your notes here..."/></div>
              <div className="flex gap-3 pb-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1 md:flex-none">Cancel</button>
                <button type="submit" className="btn-primary flex-1 md:flex-none">Save Note</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
