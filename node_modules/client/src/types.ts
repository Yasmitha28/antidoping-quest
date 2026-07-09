export type Certificate = {
  id: number;
  title: string;
  description: string;
  percentage: number;
  score: number;
  issuedAt: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  certificates?: Certificate[];
};

export type Module = {
  id: number;
  title: string;
  description: string;
  category: string;
  xpReward: number;
  duration: number;
  content: string;
};

export type Quiz = {
  id: number;
  title: string;
  question: string;
  options: string[];
  correctAnswer: number;
  xpReward: number;
};

export type Challenge = {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  difficulty: string;
  active: boolean;
};

export type DashboardStats = {
  stats: {
    users: number;
    modules: number;
    quizzes: number;
    completedChallenges: number;
  };
  topUsers: Array<{ id: number; name: string; xp: number; level: number }>;
};
