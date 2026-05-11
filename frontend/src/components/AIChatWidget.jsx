import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Loader2, RotateCcw, ChevronDown } from 'lucide-react';
import api from '../utils/api';

const SUGGESTIONS = [
  "Explain the Pythagorean theorem",
  "How do I study for exams effectively?",
  "What is Newton's second law?",
  "Help me understand recursion",
  "Give me a 2-hour study plan",
];

const MessageBubble = ({ msg }) => (
  <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
    {msg.role === 'assistant' && (
      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center flex-shrink-0 mr-2 mt-0.5 shadow-lg shadow-primary/20">
        <Sparkles className="w-3.5 h-3.5 text-white" />
      </div>
    )}
    <div
      className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
        msg.role === 'user'
          ? 'bg-primary text-white rounded-tr-sm shadow-lg shadow-primary/20'
          : 'bg-surface border border-white/10 text-textPrimary rounded-tl-sm'
      }`}
    >
      {msg.content}
    </div>
  </div>
);

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm Synora AI 🎓\n\nI can help you with study questions, explain concepts, or guide your learning. What would you like to explore?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  const sendMessage = async (text) => {
    const content = text || input.trim();
    if (!content || loading) return;

    const userMsg = { role: 'user', content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/api/ai/chat', {
        messages: newMessages.map(m => ({ role: m.role, content: m.content }))
      });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: err.response?.data?.message || "Sorry, I'm having trouble connecting. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: "Chat cleared! Ask me anything 😊" }]);
  };

  return (
    <>
      {/* Chat Panel */}
      <div className={`fixed bottom-24 right-6 z-50 w-[360px] transition-all duration-300 ease-out ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <div className="glass rounded-2xl border border-white/10 shadow-2xl shadow-black/50 flex flex-col overflow-hidden" style={{ height: '520px' }}>
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-gradient-to-r from-primary/10 to-secondary/10 flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Synora AI</p>
              <p className="text-[10px] text-textSecondary">Your study assistant</p>
            </div>
            <button onClick={clearChat} className="p-1.5 text-textSecondary hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Clear chat">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setOpen(false)} className="p-1.5 text-textSecondary hover:text-white hover:bg-white/10 rounded-lg transition-all">
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1">
            {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}

            {loading && (
              <div className="flex items-start mb-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-surface border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  <span className="text-xs text-textSecondary">Thinking...</span>
                </div>
              </div>
            )}

            {/* Suggestions (only when just started) */}
            {messages.length === 1 && !loading && (
              <div className="mt-3 space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-textSecondary font-semibold px-1">Try asking:</p>
                {SUGGESTIONS.map((s, i) => (
                  <button key={i} onClick={() => sendMessage(s)} className="block w-full text-left text-xs px-3 py-2 rounded-xl bg-surface/60 border border-white/10 text-textSecondary hover:text-textPrimary hover:border-primary/30 hover:bg-primary/5 transition-all">
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10 flex-shrink-0">
            <div className="flex items-end gap-2 bg-surface/60 border border-white/10 rounded-xl px-3 py-2 focus-within:border-primary/40 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-textPrimary placeholder-textSecondary resize-none outline-none max-h-24 leading-relaxed"
                style={{ minHeight: '24px' }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-lg bg-primary hover:bg-primaryHover disabled:opacity-30 flex items-center justify-center flex-shrink-0 transition-all hover:scale-105 active:scale-95"
              >
                <Send className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <p className="text-[10px] text-textSecondary text-center mt-1.5">Powered by Llama 3 · Enter to send</p>
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-secondary shadow-2xl shadow-primary/40 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${open ? 'rotate-12' : 'rotate-0'}`}
        title="Ask Synora AI"
      >
        {open
          ? <X className="w-6 h-6 text-white" />
          : <Sparkles className="w-6 h-6 text-white" />
        }
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background animate-pulse" />
        )}
      </button>
    </>
  );
};

export default AIChatWidget;
