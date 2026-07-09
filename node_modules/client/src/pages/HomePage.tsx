import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, BookOpen, Sparkles, Trophy, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-100">
      <section className="grid items-center gap-10 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-sm text-brand-100"><Sparkles size={16} /> Gamified anti-doping education</div>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Learn fair play, earn rewards, and protect athlete integrity.</h1>
          <p className="max-w-xl text-lg text-slate-300">A production-ready learning platform that turns anti-doping awareness into interactive challenges, daily quizzing, badges, leaderboards, and measurable progress.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/auth" className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-3 font-medium text-white">Start learning <ArrowRight size={16} /></Link>
            <Link to="/dashboard" className="rounded-full border border-white/10 px-5 py-3 font-medium text-slate-200">Explore dashboard</Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: BadgeCheck, title: 'Daily quiz', text: 'Sharpen awareness every day' },
              { icon: Trophy, title: 'XP & levels', text: 'Progress through meaningful milestones' },
              { icon: BookOpen, title: 'Interactive modules', text: 'Explore real-world scenarios' },
              { icon: Users, title: 'Community leaderboard', text: 'Compete fairly and learn together' }
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <Icon className="mb-3 text-brand-300" size={22} />
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
