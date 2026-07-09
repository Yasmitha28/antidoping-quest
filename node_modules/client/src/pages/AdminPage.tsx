import { useEffect, useState } from 'react';
import { BarChart3, BookOpen, ShieldCheck, Trophy } from 'lucide-react';
import { api } from '../lib/api';

type AdminData = {
  users: Array<{ id: number; name: string; email: string; role: string; xp: number; level: number }>;
  modules: Array<{ id: number; title: string; category: string; xpReward: number }>;
  quizzes: Array<{ id: number; title: string; xpReward: number }>;
  challenges: Array<{ id: number; title: string; xpReward: number; active: boolean }>;
};

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);

  useEffect(() => {
    api<AdminData>('/analytics/admin').then(setData);
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
        <div className="flex items-center gap-3"><ShieldCheck className="text-brand-300" size={20} /><h1 className="text-2xl font-semibold">Admin dashboard</h1></div>
        <p className="mt-3 text-slate-400">Manage users, content, quizzes, and challenge operations from one place.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6"><div className="flex items-center gap-3"><BarChart3 className="text-brand-300" size={18} /><h2 className="font-semibold">Users</h2></div><p className="mt-4 text-3xl font-semibold">{data?.users.length ?? 0}</p></div>
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6"><div className="flex items-center gap-3"><BookOpen className="text-brand-300" size={18} /><h2 className="font-semibold">Modules</h2></div><p className="mt-4 text-3xl font-semibold">{data?.modules.length ?? 0}</p></div>
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6"><div className="flex items-center gap-3"><Trophy className="text-brand-300" size={18} /><h2 className="font-semibold">Challenges</h2></div><p className="mt-4 text-3xl font-semibold">{data?.challenges.length ?? 0}</p></div>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
          <h2 className="mb-4 text-xl font-semibold">User management</h2>
          <div className="space-y-2">
            {data?.users.map((user) => <div key={user.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"><div className="flex items-center justify-between"><div><p className="font-medium">{user.name}</p><p className="text-sm text-slate-400">{user.email}</p></div><div className="text-right text-sm text-slate-400"><p>{user.role}</p><p>{user.xp} XP</p></div></div></div>)}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
          <h2 className="mb-4 text-xl font-semibold">Content management</h2>
          <div className="space-y-2">
            {data?.modules.map((module) => <div key={module.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4"><p className="font-medium">{module.title}</p><p className="text-sm text-slate-400">{module.category} • {module.xpReward} XP</p></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
