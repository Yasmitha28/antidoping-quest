import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/60 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold">{isLogin ? 'Welcome back' : 'Create your account'}</h2>
          <p className="mt-2 text-sm text-slate-400">Start your anti-doping learning journey with purpose.</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none" placeholder="Full name" required />}
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none" placeholder="Email" required />
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 outline-none" placeholder="Password" required />
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-medium text-white">{isLogin ? 'Sign in' : 'Create account'}</button>
        </form>
        <button className="mt-4 w-full text-sm text-slate-400" onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Need an account? Register' : 'Already have an account? Sign in'}</button>
      </motion.div>
    </div>
  );
}
