import { Link, NavLink, useLocation } from 'react-router-dom';
import { BarChart3, BookOpen, Compass, LayoutDashboard, LogOut, Shield, Trophy, UserCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { AntiDopingAgent } from './AntiDopingAgent';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/modules', label: 'Modules', icon: BookOpen },
  { to: '/quiz', label: 'Quiz', icon: Compass },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/profile', label: 'Profile', icon: UserCircle2 }
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 text-lg font-semibold">
            <div className="rounded-full bg-brand-500/20 p-2 text-brand-100">
              <Shield size={18} />
            </div>
            Anti-Doping Quest
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${isActive ? 'bg-brand-500/20 text-brand-100' : 'text-slate-300 hover:bg-white/10'}`}>
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
            {user?.role === 'ADMIN' && <NavLink to="/admin" className={({ isActive }) => `flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${isActive ? 'bg-brand-500/20 text-brand-100' : 'text-slate-300 hover:bg-white/10'}`}><BarChart3 size={16} />Admin</NavLink>}
          </nav>
          <div className="flex items-center gap-3">
            {user ? <><span className="hidden text-sm text-slate-300 sm:block">{user.name}</span><button onClick={logout} className="rounded-full border border-white/10 bg-white/10 p-2 text-slate-100" aria-label="Logout"><LogOut size={16} /></button></> : <Link to="/auth" className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white">Sign in</Link>}
          </div>
        </div>
      </header>
      <motion.main initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={location.pathname} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </motion.main>
      <footer className="border-t border-white/10 px-4 py-6 text-center text-sm text-slate-400">
        Built for education, fairness, and confident athlete decisions.
      </footer>
      <AntiDopingAgent />
    </div>
  );
}
