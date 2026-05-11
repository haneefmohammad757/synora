import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(name, email, password);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-6">
      <div className="mx-auto w-full max-w-md text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/25">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Synora</span>
        </Link>
        <h2 className="text-3xl font-bold">Create your account</h2>
      </div>
      <div className="mx-auto w-full max-w-md animate-slide-up">
        <div className="glass-card">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm text-center">{error}</div>}
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input type="text" required className="input-field" value={name} onChange={e => { setName(e.target.value); setError(null); }} placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" required className="input-field" value={email} onChange={e => { setEmail(e.target.value); setError(null); }} placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input type="password" required minLength={6} className="input-field" value={password} onChange={e => { setPassword(e.target.value); setError(null); }} placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full btn-primary py-3">Create Account</button>
          </form>
          <p className="mt-6 text-center text-sm text-textSecondary">
            Already have an account? <Link to="/login" className="font-medium text-primary hover:text-primaryHover">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
