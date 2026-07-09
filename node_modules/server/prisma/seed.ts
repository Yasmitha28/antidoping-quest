import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Password123!', 10);

  await prisma.user.createMany({
    data: [
      {
        name: 'Admin User',
        email: 'admin@antidoping.com',
        password,
        role: 'ADMIN',
        xp: 420,
        level: 5,
        streak: 7,
        badges: ['First Steps', 'Quiz Master']
      },
      {
        name: 'Alex Rivera',
        email: 'alex@antidoping.com',
        password,
        xp: 280,
        level: 3,
        streak: 4,
        badges: ['Knowledge Seeker']
      }
    ],
    skipDuplicates: true
  });

  await prisma.module.createMany({
    data: [
      {
        title: 'What is Doping?',
        description: 'Understand the definition and impact of prohibited substances.',
        category: 'Basics',
        xpReward: 60,
        duration: 8,
        content: 'Doping is the use of prohibited substances or methods to artificially enhance performance. It harms athletes and undermines fair competition.'
      },
      {
        title: 'Testing & Compliance',
        description: 'Learn why testing protocols and compliance matter.',
        category: 'Compliance',
        xpReward: 70,
        duration: 10,
        content: 'Strict testing procedures protect athletes and maintain trust in sport. Awareness of rules helps prevent accidental violations.'
      },
      {
        title: 'Scenario Decisions',
        description: 'Practice making informed choices in realistic situations.',
        category: 'Scenarios',
        xpReward: 90,
        duration: 12,
        content: 'Scenario-based learning helps players recognize risky decisions before they become violations.'
      }
    ],
    skipDuplicates: true
  });

  await prisma.quiz.createMany({
    data: [
      {
        title: 'Daily Quiz 1',
        question: 'Which action is considered anti-doping misconduct?',
        options: ['Using a doctor-approved supplement without checking the list', 'Following a prescribed medical treatment', 'Keeping your medication records ready'],
        correctAnswer: 0,
        xpReward: 25
      },
      {
        title: 'Daily Quiz 2',
        question: 'Why should athletes review supplements carefully?',
        options: ['Some supplements may contain prohibited substances', 'Supplements always improve performance legally', 'Supplements are never tested'],
        correctAnswer: 0,
        xpReward: 25
      },
      {
        title: 'Daily Quiz 3',
        question: 'What should athletes do before taking a new supplement?',
        options: ['Check the prohibited list and consult medical staff', 'Take it immediately to boost performance', 'Hide it from support staff'],
        correctAnswer: 0,
        xpReward: 30
      },
      {
        title: 'Daily Quiz 4',
        question: 'Which record is important for anti-doping compliance?',
        options: ['Medical treatment history', 'Favorite playlist', 'Training costume color'],
        correctAnswer: 0,
        xpReward: 30
      },
      {
        title: 'Daily Quiz 5',
        question: 'Why is reporting medication important for athletes?',
        options: ['It prevents accidental rule violations', 'It is not important', 'It delays competition'],
        correctAnswer: 0,
        xpReward: 35
      }
    ],
    skipDuplicates: true
  });

  await prisma.challenge.createMany({
    data: [
      {
        title: 'Complete a module',
        description: 'Finish one educational module to earn your first reward.',
        xpReward: 100,
        difficulty: 'EASY',
        active: true
      },
      {
        title: 'Streak Keeper',
        description: 'Log in for 3 consecutive days to unlock the streak badge.',
        xpReward: 150,
        difficulty: 'MEDIUM',
        active: true
      }
    ],
    skipDuplicates: true
  });
}

main().finally(() => prisma.$disconnect());
