export function getXpTitle(xp: number): string {
  if (xp <= 100) return 'Beginner';
  if (xp <= 300) return 'Learner';
  if (xp <= 600) return 'Expert';
  return 'Anti-Doping Champion';
}
