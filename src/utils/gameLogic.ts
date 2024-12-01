import type { Character } from '../types/game';
import { FOODS } from '../data/foods';

export function calculateJobIncome(character: Character): number {
  const baseIncome = 1000;
  const educationMultiplier = 1 + (character.education / 100);
  return Math.floor(baseIncome * educationMultiplier);
}

export function getAvailableFoods(character: Character) {
  const income = calculateJobIncome(character);
  
  if (income >= 2000) {
    return FOODS;
  } else if (income >= 1500) {
    return {
      ...FOODS,
      LUNCH: FOODS.LUNCH.slice(0, 2),
      DINNER: FOODS.DINNER.slice(0, 2)
    };
  } else {
    return {
      BREAKFAST: [FOODS.BREAKFAST[1]],
      LUNCH: [FOODS.LUNCH[2]],
      DINNER: [FOODS.DINNER[2]],
      SNACKS: [FOODS.SNACKS[0]]
    };
  }
}

export function calculateEnergyDrain(activity: string, education: number): number {
  const baseRates = {
    work: 30,
    study: 15,
    exercise: 25,
    socializing: 10,
    eating: 5
  };
  
  const rate = baseRates[activity as keyof typeof baseRates] || 10;
  const educationEfficiency = 1 - (education / 200);
  
  return Math.floor(rate * educationEfficiency);
}

export function calculateHungerDrain(activity: string): number {
  const drainRates = {
    work: 25,
    rest: 10,
    study: 5
  };
  
  return drainRates[activity as keyof typeof drainRates] || 5;
}

export function isGameOver(character: Character): boolean {
  return character.health <= 0;
}