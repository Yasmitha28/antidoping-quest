import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { api } from '../lib/api';
import type { DashboardStats } from '../types';

export default function LeaderboardPage() {
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);

  useEffect(() => {
    api<DashboardStats>('/analytics/dashboard').then(setDashboard);
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
        <div className="flex items-center gap-3"><Trophy className="text-brand-300" size={20} /><h1 className="text-2xl font-semibold">Leaderboard</h1></div>
        <p className="mt-3 text-slate-400">See how your knowledge is performing against the community.</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
        <div className="grid gap-3">
          {dashboard?.topUsers.map((user, index) => (
            <div key={user.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-4">
              <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/20 text-sm font-semibold text-brand-100">#{index + 1}</div><div><p className="font-medium">{user.name}</p><p className="text-sm text-slate-400">Level {user.level}</p></div></div>
              <div className="text-right"><p className="font-semibold">{user.xp} XP</p><p className="text-sm text-slate-400">Top performer</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
