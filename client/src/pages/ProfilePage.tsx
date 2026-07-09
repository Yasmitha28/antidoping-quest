import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { CertificatePreview } from '../components/CertificatePreview';
import type { Certificate } from '../types';

export default function ProfilePage() {
  const { user } = useAuth();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Profile</p>
            <h1 className="mt-2 text-2xl font-semibold">{user?.name}</h1>
            <p className="mt-2 text-slate-400">{user?.email}</p>
          </div>
          <div className="rounded-2xl border border-brand-500/20 bg-brand-500/10 px-4 py-3 text-center">
            <p className="text-sm text-slate-400">Level</p>
            <p className="text-2xl font-semibold text-brand-100">{user?.level}</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          <div className="flex items-center gap-3"><Sparkles className="text-brand-300" size={18} /><h2 className="font-semibold">XP Points</h2></div>
          <p className="mt-4 text-3xl font-semibold">{user?.xp}</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          <div className="flex items-center gap-3"><TrendingUp className="text-brand-300" size={18} /><h2 className="font-semibold">Daily Streak</h2></div>
          <p className="mt-4 text-3xl font-semibold">{user?.streak} days</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
          <div className="flex items-center gap-3"><ShieldCheck className="text-brand-300" size={18} /><h2 className="font-semibold">Role</h2></div>
          <p className="mt-4 text-3xl font-semibold">{user?.role}</p>
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
        <div className="flex items-center gap-3"><Award className="text-brand-300" size={18} /><h2 className="font-semibold">Achievements</h2></div>
        <div className="mt-4 flex flex-wrap gap-2">
          {(user?.badges.length ? user.badges : ['Knowledge Seeker', 'Streak Keeper']).map((badge) => <span key={badge} className="rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-sm text-brand-100">{badge}</span>)}
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
        <h2 className="font-semibold">Certificates</h2>
        {user?.certificates?.length ? (
          <div className="mt-4 space-y-3">
            {user.certificates.map((certificate) => (
              <button key={certificate.id} onClick={() => { setSelectedCertificate(certificate); setShowCertificate(true); }} className="w-full rounded-2xl border border-brand-500/20 bg-brand-500/10 p-4 text-left">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="font-medium">{certificate.title}</p>
                    <p className="text-sm text-slate-400">{certificate.description}</p>
                  </div>
                  <span className="rounded-full bg-slate-900/70 px-3 py-1 text-sm text-brand-100">{certificate.percentage}%</span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-400">Certificates unlock after a quiz score above 60%.</p>
        )}
      </div>
      <CertificatePreview certificate={selectedCertificate} recipientName={user?.name || 'Learner'} isOpen={showCertificate} onClose={() => setShowCertificate(false)} />
    </div>
  );
}
