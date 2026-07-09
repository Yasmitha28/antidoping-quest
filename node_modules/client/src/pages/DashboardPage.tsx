import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Award, BookOpen, Sparkles, Target } from 'lucide-react';
import { api } from '../lib/api';
import { getXpTitle } from '../lib/xpTitle';
import type { DashboardStats, Module, Quiz, Challenge } from '../types';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  const currentXp = user?.xp ?? 0;
  const xpTitle = getXpTitle(currentXp);
  const xpHistory = currentXp > 0
    ? [Math.max(0, currentXp - 120), Math.max(0, currentXp - 80), Math.max(0, currentXp - 45), Math.max(0, currentXp - 20), Math.max(0, currentXp - 10), currentXp]
    : [0, 0, 0, 0, 0, 0];
  const maxXp = Math.max(...xpHistory, 100);
  const chartPoints = xpHistory.map((value, index) => {
    const x = 20 + index * 42;
    const y = 120 - (value / maxXp) * 90;
    return `${x},${y}`;
  }).join(' ');

  useEffect(() => {
    Promise.all([
      api<DashboardStats>('/analytics/dashboard'),
      api<{ modules: Module[] }>('/modules'),
      api<{ quizzes: Quiz[] }>('/quizzes'),
      api<{ challenges: Challenge[] }>('/challenges')
    ]).then(([dashboardData, modulesData, _quizzesData, challengesData]) => {
      setDashboard(dashboardData);
      setModules(modulesData.modules);
      setChallenges(challengesData.challenges);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-brand-500/20 to-slate-900 p-6 shadow-2xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-brand-200">Your progress</p>
            <h1 className="mt-2 text-3xl font-semibold">Welcome back, {user?.name}</h1>
            <p className="mt-2 max-w-2xl text-slate-300">Stay consistent with daily training, earn XP, and unlock new achievements.</p>
            <div className="mt-3 inline-flex rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-sm text-brand-100">{xpTitle}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-center">
            <p className="text-sm text-slate-400">Current level</p>
            <p className="text-3xl font-semibold">{user?.level ?? 1}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'XP', value: user?.xp ?? 0, icon: Sparkles },
          { label: 'Daily streak', value: `${user?.streak ?? 0} days`, icon: Activity },
          { label: 'Modules', value: dashboard?.stats.modules ?? 0, icon: BookOpen },
          { label: 'Quizzes', value: dashboard?.stats.quizzes ?? 0, icon: Target }
        ].map(({ label, value, icon: Icon }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-slate-400">{label}</p>
              <Icon className="text-brand-300" size={18} />
            </div>
            <p className="mt-3 text-2xl font-semibold">{value}</p>
          </motion.div>
        ))}
      </div>
      <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">XP progression</h2>
            <p className="mt-1 text-sm text-slate-400">Your recent XP growth stays visible while your learning journey continues.</p>
          </div>
          <div className="rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-sm text-brand-100">{currentXp} XP</div>
        </div>
        <svg viewBox="0 0 260 140" className="h-44 w-full">
          <line x1="20" y1="120" x2="240" y2="120" stroke="#334155" strokeWidth="1" />
          <line x1="20" y1="30" x2="20" y2="120" stroke="#334155" strokeWidth="1" />
          <polyline fill="none" stroke="#5eead4" strokeWidth="3" points={chartPoints} />
          {xpHistory.map((value, index) => {
            const x = 20 + index * 42;
            const y = 120 - (value / maxXp) * 90;
            return <circle key={`${value}-${index}`} cx={x} cy={y} r="4" fill="#8b5cf6" />;
          })}
        </svg>
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Learning modules</h2>
            <p className="text-sm text-slate-400">Unlock with completion</p>
          </div>
          <div className="space-y-3">
            {modules.map((module) => <div key={module.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"><div className="flex items-start justify-between"><div><h3 className="font-medium">{module.title}</h3><p className="mt-1 text-sm text-slate-400">{module.description}</p></div><span className="rounded-full bg-brand-500/15 px-3 py-1 text-sm text-brand-100">+{module.xpReward} XP</span></div></div>)}
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold">Weekly challenges</h2><Target className="text-brand-300" size={18} /></div>
            <div className="space-y-3">
              {challenges.map((challenge) => <div key={challenge.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"><div className="flex items-center justify-between"><div><h3 className="font-medium">{challenge.title}</h3><p className="mt-1 text-sm text-slate-400">{challenge.description}</p></div><span className="text-sm text-brand-200">+{challenge.xpReward} XP</span></div></div>)}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold">Badges</h2><Award className="text-brand-300" size={18} /></div>
            <div className="flex flex-wrap gap-2">
              {(user?.badges.length ? user.badges : ['First Steps', 'Knowledge Seeker']).map((badge) => <span key={badge} className="rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-sm text-brand-100">{badge}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
