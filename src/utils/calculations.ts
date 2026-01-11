import { UserProfile } from '../types';

export const calculateTMB = (
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female'
): number => {
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.33 * age);
  }
};

const activityMultipliers: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

export const calculateTDEE = (tmb: number, activityLevel: string): number => {
  const multiplier = activityMultipliers[activityLevel] || 1.2;
  return Math.round(tmb * multiplier);
};

export const calculateDailyGoal = (tdee: number): number => {
  return Math.round(tdee * 0.85);
};

export const getActivityLabel = (level: string): string => {
  const labels: Record<string, string> = {
    sedentary: 'Sedentário',
    light: 'Levemente Ativo',
    moderate: 'Moderadamente Ativo',
    active: 'Muito Ativo',
    veryActive: 'Extremamente Ativo',
  };
  return labels[level] || 'Não especificado';
};

export const getActivityDescription = (level: string): string => {
  const descriptions: Record<string, string> = {
    sedentary: 'Pouco ou nenhum exercício',
    light: '1-3 dias de exercício por semana',
    moderate: '3-5 dias de exercício por semana',
    active: '6-7 dias de exercício por semana',
    veryActive: '2 vezes ou mais por dia',
  };
  return descriptions[level] || '';
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getWeekNumber = (date: Date): number => {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDay.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDay.getDay() + 1) / 7);
};

export const getTodayDate = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const getDateRangeForWeek = (weekNumber: number, year: number): { start: string; end: string } => {
  const simple = new Date(year, 0, 1 + (weekNumber - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
  }

  const startDate = ISOweekStart.toISOString().split('T')[0];
  const endDate = new Date(ISOweekStart);
  endDate.setDate(endDate.getDate() + 6);
  const endDateStr = endDate.toISOString().split('T')[0];

  return { start: startDate, end: endDateStr };
};
