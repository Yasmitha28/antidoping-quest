import { PrismaClient } from '@prisma/client';

const seededModules = [
  {
    id: 1,
    title: 'What is Doping?',
    description: 'Understand the definition and impact of prohibited substances.',
    category: 'Basics',
    xpReward: 60,
    duration: 8,
    content: 'Doping is the use of prohibited substances or methods to artificially enhance performance. It harms athletes and undermines fair competition.'
  },
  {
    id: 2,
    title: 'Testing & Compliance',
    description: 'Learn why testing protocols and compliance matter.',
    category: 'Compliance',
    xpReward: 70,
    duration: 10,
    content: 'Strict testing procedures protect athletes and maintain trust in sport. Awareness of rules helps prevent accidental violations.'
  },
  {
    id: 3,
    title: 'Scenario Decisions',
    description: 'Practice making informed choices in realistic situations.',
    category: 'Scenarios',
    xpReward: 90,
    duration: 12,
    content: 'Scenario-based learning helps players recognize risky decisions before they become violations.'
  }
];

const seededQuizzes = [
  {
    id: 1,
    title: 'Daily Quiz 1',
    question: 'Which action is considered anti-doping misconduct?',
    options: ['Using a doctor-approved supplement without checking the list', 'Following a prescribed medical treatment', 'Keeping your medication records ready'],
    correctAnswer: 0,
    xpReward: 25
  },
  {
    id: 2,
    title: 'Daily Quiz 2',
    question: 'Why should athletes review supplements carefully?',
    options: ['Some supplements may contain prohibited substances', 'Supplements always improve performance legally', 'Supplements are never tested'],
    correctAnswer: 0,
    xpReward: 25
  },
  {
    id: 3,
    title: 'Daily Quiz 3',
    question: 'What should athletes do before taking a new supplement?',
    options: ['Check the prohibited list and consult medical staff', 'Take it immediately to boost performance', 'Hide it from support staff'],
    correctAnswer: 0,
    xpReward: 30
  },
  {
    id: 4,
    title: 'Daily Quiz 4',
    question: 'Which record is important for anti-doping compliance?',
    options: ['Medical treatment history', 'Favorite playlist', 'Training costume color'],
    correctAnswer: 0,
    xpReward: 30
  },
  {
    id: 5,
    title: 'Daily Quiz 5',
    question: 'Why is reporting medication important for athletes?',
    options: ['It prevents accidental rule violations', 'It is not important', 'It delays competition'],
    correctAnswer: 0,
    xpReward: 35
  }
];

const seededChallenges = [
  {
    id: 1,
    title: 'Complete a module',
    description: 'Finish one educational module to earn your first reward.',
    xpReward: 100,
    difficulty: 'EASY',
    active: true
  },
  {
    id: 2,
    title: 'Streak Keeper',
    description: 'Log in for 3 consecutive days to unlock the streak badge.',
    xpReward: 150,
    difficulty: 'MEDIUM',
    active: true
  }
];

let users: Array<any> = [];
let modules = seededModules.map((module) => ({ ...module }));
let quizzes = seededQuizzes.map((quiz) => ({ ...quiz }));
let challenges = seededChallenges.map((challenge) => ({ ...challenge }));
let progress: Array<any> = [];
let quizAttempts: Array<any> = [];
let challengeProgress: Array<any> = [];
let certificates: Array<any> = [];
let nextUserId = 1;

export async function withFallback<T>(operation: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    return fallback();
  }
}

export const fallbackStore = {
  async findUserByEmail(email: string) {
    return users.find((user) => user.email === email) || null;
  },
  async createUser(input: any) {
    const user = {
      id: nextUserId++,
      name: input.name,
      email: input.email,
      password: input.password,
      role: 'USER',
      xp: 0,
      level: 1,
      streak: 0,
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    users.push(user);
    return user;
  },
  async findUserById(id: number) {
    return users.find((user) => user.id === id) || null;
  },
  async updateUser(id: number, data: any) {
    users = users.map((user) => (user.id === id ? { ...user, ...data, updatedAt: new Date() } : user));
    return users.find((user) => user.id === id) || null;
  },
  async countUsers() {
    return users.length;
  },
  async listUsers() {
    return users.map((user) => ({ ...user }));
  },
  async listModules() {
    return modules.map((module) => ({ ...module }));
  },
  async createProgress(input: any) {
    const record = { id: progress.length + 1, ...input, createdAt: new Date(), updatedAt: new Date() };
    progress.push(record);
    return record;
  },
  async findProgress(userId: number, moduleId: number) {
    return progress.find((entry) => entry.userId === userId && entry.moduleId === moduleId) || null;
  },
  async listProgress(userId: number) {
    return progress.filter((entry) => entry.userId === userId).map((entry) => ({ moduleId: entry.moduleId }));
  },
  async updateProgress(id: number, data: any) {
    progress = progress.map((entry) => (entry.id === id ? { ...entry, ...data, updatedAt: new Date() } : entry));
    return progress.find((entry) => entry.id === id) || null;
  },
  async listQuizzes() {
    return quizzes.map((quiz) => ({ ...quiz }));
  },
  async createQuizAttempt(input: any) {
    const record = { id: quizAttempts.length + 1, ...input, createdAt: new Date() };
    quizAttempts.push(record);
    return record;
  },
  async listQuizAttempts(userId: number) {
    return quizAttempts.filter((entry) => entry.userId === userId).map((entry) => ({ ...entry }));
  },
  async listChallenges() {
    return challenges.map((challenge) => ({ ...challenge }));
  },
  async upsertChallengeProgress(input: any) {
    const existing = challengeProgress.find((entry) => entry.userId === input.userId && entry.challengeId === input.challengeId);
    if (existing) {
      const updated = { ...existing, ...input, completed: true, updatedAt: new Date() };
      challengeProgress = challengeProgress.map((entry) => (entry.id === existing.id ? updated : entry));
      return updated;
    }
    const record = { id: challengeProgress.length + 1, ...input, completed: true, createdAt: new Date() };
    challengeProgress.push(record);
    return record;
  },
  async countCompletedChallenges() {
    return challengeProgress.filter((entry) => entry.completed).length;
  },
  async listCertificates(userId: number) {
    return certificates.filter((entry) => entry.userId === userId).map((entry) => ({ ...entry }));
  },
  async createCertificate(input: any) {
    const certificate = { id: certificates.length + 1, ...input, issuedAt: new Date() };
    certificates.push(certificate);
    return certificate;
  },
  async listTopUsers() {
    return [...users].sort((a, b) => b.xp - a.xp).slice(0, 5).map(({ id, name, xp, level }) => ({ id, name, xp, level }));
  }
};
