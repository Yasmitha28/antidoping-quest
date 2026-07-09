import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, CheckCircle2, Circle, Trophy } from 'lucide-react';
import { api } from '../lib/api';
import { getXpTitle } from '../lib/xpTitle';
import { CertificatePreview } from '../components/CertificatePreview';
import { useAuth } from '../context/AuthContext';
import type { Certificate, Quiz } from '../types';

export default function QuizPage() {
  const { user, refreshUser } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState<string>('');
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const completedCount = Object.values(submitted).filter(Boolean).length;
  const xpTitle = getXpTitle((user?.xp ?? 0) + score);
  const completionPercentage = quizzes.length ? Math.round((completedCount / quizzes.length) * 100) : 0;
  const accuracy = completedCount ? Math.round((correctAnswers / completedCount) * 100) : 0;

  useEffect(() => {
    api<{ quizzes: Quiz[] }>('/quizzes').then((res) => setQuizzes(res.quizzes));
  }, []);

  const handleSubmit = async (quiz: Quiz) => {
    const answer = selected[quiz.id];
    if (answer === undefined) {
      setFeedback('Choose an option before submitting.');
      return;
    }
    try {
      const result = await api<{ correct: boolean; score: number; answer: number; certificate: any; percentage: number; user?: any }>(`/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answer })
      });
      const previousLevel = user?.level ?? 1;
      const nextScore = score + result.score;
      const nextCorrectAnswers = correctAnswers + (result.correct ? 1 : 0);
      const updatedSubmitted = { ...submitted, [quiz.id]: true };
      const isAllCompleted = quizzes.length > 0 && Object.values(updatedSubmitted).filter(Boolean).length === quizzes.length;

      setScore(nextScore);
      setCorrectAnswers(nextCorrectAnswers);
      setSubmitted(updatedSubmitted);
      if (result.user) {
        await refreshUser();
      }

      if (isAllCompleted) {
        const completionCertificate: Certificate = {
          id: Date.now(),
          title: 'Quiz Completion Certificate',
          description: 'Awarded for completing all five anti-doping quizzes with steady progress.',
          percentage: Math.max(90, Math.round((nextCorrectAnswers / quizzes.length) * 100)),
          score: nextScore,
          issuedAt: new Date().toISOString()
        };
        const completionMessage = result.correct
          ? `All 5 quizzes completed! Completion certificate unlocked. +${result.score} XP`
          : 'All 5 quizzes completed! Completion certificate unlocked.';
        const levelUpText = result.user && result.user.level > previousLevel ? ` • Level up! You're now level ${result.user.level}.` : '';
        setFeedback(`${completionMessage}${levelUpText}`);
        setCertificate(completionCertificate);
        setShowCertificate(true);
      } else if (result.certificate) {
        const baseMessage = result.correct
          ? `Correct! +${result.score} XP`
          : `Not quite. Correct answer: ${quiz.options[result.answer]}`;
        const levelUpText = result.user && result.user.level > previousLevel ? ` • Level up! You're now level ${result.user.level}.` : '';
        setFeedback(`${baseMessage} • Certificate unlocked: ${result.certificate.title} (${result.percentage}%)${levelUpText}`);
        setCertificate(result.certificate);
        setShowCertificate(true);
      } else {
        setFeedback(result.correct ? `Correct! +${result.score} XP` : `Not quite. Correct answer: ${quiz.options[result.answer]}`);
      }
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Unable to submit quiz');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
        <div className="flex items-center gap-3"><Brain className="text-brand-300" size={20} /><h1 className="text-2xl font-semibold">Daily quiz challenge</h1></div>
        <p className="mt-3 text-slate-400">Answer each challenge to strengthen your anti-doping knowledge and collect XP.</p>
        <div className="mt-4 rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-2 text-sm text-brand-100">
          <div className="flex items-center gap-2">
            <Trophy size={16} />
            <span>Current score: {score} XP</span>
          </div>
          <p className="mt-2 text-sm text-slate-300">Certificate name: {user?.name ?? 'Learner'}</p>
        </div>
      </div>
      {feedback && <div className="rounded-2xl border border-brand-500/20 bg-brand-500/10 p-3 text-sm text-brand-100">{feedback}</div>}
      <div className="rounded-3xl border border-brand-500/20 bg-slate-950/70 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Quiz progress analytics</h2>
            <p className="mt-1 text-sm text-slate-400">Your progress stays visible while you continue learning.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-sm text-brand-100">{completionPercentage}%</div>
            <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">{xpTitle}</div>
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-slate-800">
          <div className="h-2 rounded-full bg-gradient-to-r from-brand-500 via-cyan-400 to-violet-500" style={{ width: `${completionPercentage}%` }} />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
            <p className="text-sm text-slate-400">Completed</p>
            <p className="mt-1 text-xl font-semibold">{completedCount}/{quizzes.length || 5}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
            <p className="text-sm text-slate-400">Accuracy</p>
            <p className="mt-1 text-xl font-semibold">{accuracy}%</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-3">
            <p className="text-sm text-slate-400">XP earned</p>
            <p className="mt-1 text-xl font-semibold">{score} XP</p>
          </div>
        </div>
      </div>
      {showCertificate && certificate && (
        <div className="rounded-3xl border border-brand-500/20 bg-slate-950/70 p-4">
          <CertificatePreview certificate={certificate} recipientName={user?.name ?? 'Learner'} isOpen={showCertificate} onClose={() => setShowCertificate(false)} />
        </div>
      )}
      <div className="space-y-4">
        {quizzes.map((quiz, index) => (
          <motion.div key={quiz.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }} className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
            <h3 className="text-xl font-semibold">{quiz.question}</h3>
            <div className="mt-4 space-y-3">
              {quiz.options.map((option, optionIndex) => {
                const active = selected[quiz.id] === optionIndex;
                return <button key={option} onClick={() => setSelected((prev) => ({ ...prev, [quiz.id]: optionIndex }))} className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left ${active ? 'border-brand-500 bg-brand-500/10 text-brand-100' : 'border-white/10 bg-slate-900/70 text-slate-200'}`}>
                  {active ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  {option}
                </button>;
              })}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button onClick={() => handleSubmit(quiz)} className="rounded-full bg-brand-500 px-4 py-2 text-sm font-medium text-white">{submitted[quiz.id] ? 'Submitted' : 'Submit answer'}</button>
              {submitted[quiz.id] && certificate && (
                <button onClick={() => setShowCertificate(true)} className="rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-100">
                  View certificate
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
