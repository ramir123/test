import type { Character } from '../types/game';

export function calculateHealthChange(character: Character, activity: string): number {
  let healthChange = 0;

  // Health decreases when basic needs are low
  if (character.hunger < 30) healthChange -= 5;
  if (character.energy < 20) healthChange -= 5;
  
  // Work impact on health
  if (activity === 'work' && character.energy < 30) {
    healthChange -= 10; // Overworking causes health issues
  }

  // Recovery when resting with good stats
  if (activity === 'rest' && character.hunger > 70) {
    healthChange += 5;
  }

  return healthChange;
}

export function calculateOverallWellbeing(character: Character): {
  physicalHealth: number;
  mentalHealth: number;
  spiritualHealth: number;
} {
  const physicalHealth = Math.min(100, (character.health + character.energy) / 2);
  const mentalHealth = Math.min(100, (character.happiness + character.education) / 2);
  const spiritualHealth = character.happiness; // This could be expanded with a proper spiritual system

  return {
    physicalHealth,
    mentalHealth,
    spiritualHealth
  };
}