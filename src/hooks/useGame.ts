import { useState, useCallback, useEffect } from 'react';
import type { GameState, Character } from '../types/game';
import { LOCATIONS } from '../data/locations';
import { 
  calculateJobIncome, 
  getAvailableFoods, 
  calculateEnergyDrain, 
  calculateHungerDrain,
  isGameOver 
} from '../utils/gameLogic';
import { calculateHealthChange } from '../utils/healthSystem';

const INITIAL_CHARACTER: Character = {
  name: 'Ahmed',
  gender: 'male',
  age: 20,
  clothing: 'Modern casual',
  skills: ['trading'],
  background: 'University graduate',
  health: 100,
  energy: 100,
  hunger: 100,
  money: 5000,
  education: 70,
  happiness: 80,
  spirituality: 50
};

export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    character: INITIAL_CHARACTER,
    day: 1,
    location: LOCATIONS.ALGIERS,
    inventory: [],
    relationships: {},
    events: [],
    lastMeal: null,
    prayersDone: []
  });

  const [messages, setMessages] = useState<string[]>([
    'Welcome to El Hayat: Algerian Survival Quest!'
  ]);

  const [isAlive, setIsAlive] = useState(true);

  const addMessage = (message: string) => {
    setMessages(prev => [...prev, message]);
  };

  useEffect(() => {
    if (isGameOver(gameState.character) && isAlive) {
      setIsAlive(false);
      addMessage('GAME OVER: You have died due to poor health. May Allah grant you peace.');
    }
  }, [gameState.character, isAlive]);

  const updateCharacterStats = (updates: Partial<Character>, activity: string) => {
    if (!isAlive) return;

    setGameState(prev => {
      const healthChange = calculateHealthChange(prev.character, activity);
      const newStats = {
        ...prev.character,
        ...updates,
        health: Math.max(0, Math.min(100, prev.character.health + healthChange))
      };

      return {
        ...prev,
        character: newStats
      };
    });
  };

  const work = useCallback(() => {
    if (!isAlive) {
      addMessage('You cannot work anymore. The game is over.');
      return;
    }

    if (gameState.character.energy < 20) {
      addMessage('You are too exhausted to work. Get some rest!');
      return;
    }

    const income = calculateJobIncome(gameState.character);
    const energyDrain = calculateEnergyDrain('work', gameState.character.education);
    const hungerDrain = calculateHungerDrain('work');

    updateCharacterStats({
      energy: Math.max(0, gameState.character.energy - energyDrain),
      money: gameState.character.money + income,
      hunger: Math.max(0, gameState.character.hunger - hungerDrain)
    }, 'work');
    
    addMessage(`You worked hard and earned ${income} DZD. You're getting tired and hungry.`);
  }, [gameState.character, isAlive]);

  const eat = useCallback(() => {
    if (!isAlive) {
      addMessage('You cannot eat anymore. The game is over.');
      return;
    }

    const availableFoods = getAvailableFoods(gameState.character);
    const meal = availableFoods.LUNCH[0];
    const energyDrain = calculateEnergyDrain('eating', gameState.character.education);

    if (gameState.character.money >= meal.cost) {
      updateCharacterStats({
        hunger: Math.min(100, gameState.character.hunger + meal.energy),
        money: gameState.character.money - meal.cost,
        health: gameState.character.health + meal.health,
        energy: Math.max(0, gameState.character.energy - energyDrain)
      }, 'eat');
      
      addMessage(`You ate ${meal.name} for ${meal.cost} DZD. The meal made you a bit tired.`);
    } else {
      addMessage('You don\'t have enough money to buy food.');
    }
  }, [gameState.character, isAlive]);

  const rest = useCallback(() => {
    if (!isAlive) {
      addMessage('You cannot rest anymore. The game is over.');
      return;
    }

    const hungerDrain = calculateHungerDrain('rest');

    updateCharacterStats({
      energy: Math.min(100, gameState.character.energy + 30),
      hunger: Math.max(0, gameState.character.hunger - hungerDrain)
    }, 'rest');
    
    addMessage('You took some rest and recovered energy, but you\'re getting hungry.');
  }, [isAlive]);

  const study = useCallback(() => {
    if (!isAlive) {
      addMessage('You cannot study anymore. The game is over.');
      return;
    }

    if (gameState.character.energy < 30) {
      addMessage('You are too tired to study effectively. Get some rest first!');
      return;
    }

    const energyDrain = calculateEnergyDrain('study', gameState.character.education);
    const hungerDrain = calculateHungerDrain('study');

    updateCharacterStats({
      education: Math.min(100, gameState.character.education + 5),
      energy: Math.max(0, gameState.character.energy - energyDrain),
      hunger: Math.max(0, gameState.character.hunger - hungerDrain)
    }, 'study');
    
    addMessage('You studied and improved your knowledge. The mental work made you tired and a bit hungry.');
  }, [gameState.character, isAlive]);

  return {
    gameState,
    messages,
    isAlive,
    actions: {
      work,
      rest,
      eat,
      study
    }
  };
}