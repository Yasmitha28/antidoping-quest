import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, Clock3, Sparkles } from 'lucide-react';
import { api } from '../lib/api';
import type { Module } from '../types';

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([
      api<{ modules: Module[] }>('/modules'),
      api<{ completedModuleIds: number[] }>('/modules/progress').catch(() => ({ completedModuleIds: [] }))
    ]).then(([modulesResponse, progressResponse]) => {
      setModules(modulesResponse.modules);
      setCompletedModules(progressResponse.completedModuleIds);
    });
  }, []);

  const handleComplete = async (moduleId: number) => {
    if (completedModules.includes(moduleId)) {
      setMessage('This module is already marked complete.');
      return;
    }

    try {
      await api(`/modules/${moduleId}/progress`, { method: 'POST' });
      setCompletedModules((prev) => [...prev, moduleId]);
      setMessage('Module completed and XP awarded.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Unable to update progress');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
        <div className="flex items-center gap-3"><BookOpen className="text-brand-300" size={20} /><h1 className="text-2xl font-semibold">Interactive learning modules</h1></div>
        <p className="mt-3 max-w-2xl text-slate-400">Each module explains real anti-doping principles, then rewards you with XP when you complete it.</p>
      </div>
      {message && <div className="rounded-2xl border border-brand-500/20 bg-brand-500/10 p-3 text-sm text-brand-100">{message}</div>}
      <div className="grid gap-4 lg:grid-cols-2">
        {modules.map((module, index) => (
          <motion.div key={module.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{module.category}</p>
                <h3 className="mt-2 text-xl font-semibold">{module.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{module.description}</p>
              </div>
              <span className="rounded-full bg-brand-500/15 px-3 py-1 text-sm text-brand-100">+{module.xpReward} XP</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-300">{module.content}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-2"><Clock3 size={16} />{module.duration} min</span>
              <span className="flex items-center gap-2"><Sparkles size={16} />Gamified learning</span>
            </div>
            <button onClick={() => handleComplete(module.id)} className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${completedModules.includes(module.id) ? 'bg-emerald-600 text-white' : 'bg-brand-500 text-white'}`}>
              <CheckCircle2 size={16} />{completedModules.includes(module.id) ? 'Completed' : 'Mark complete'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
