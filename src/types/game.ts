export interface Character {
  name: string;
  gender: 'male' | 'female';
  age: number;
  clothing: string;
  skills: string[];
  background: string;
  health: number;
  energy: number;
  hunger: number;
  money: number;
  education: number;
  happiness: number;
  spirituality: number;
}

export interface GameState {
  character: Character;
  day: number;
  location: string;
  inventory: string[];
  relationships: Record<string, number>;
  events: string[];
  lastMeal: string | null;
  prayersDone: string[];
}

export type GameAction = 
  | { type: 'WORK' }
  | { type: 'REST' }
  | { type: 'EAT' }
  | { type: 'STUDY' }
  | { type: 'PRAY' }
  | { type: 'ADVANCE_DAY' };