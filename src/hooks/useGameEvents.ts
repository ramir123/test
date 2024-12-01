import { useState, useCallback } from 'react';
import { calculateJobIncome, calculateEnergyDrain, calculateHappiness } from '../utils/gameLogic';
import type { GameState } from '../types/game';

export function useGameEvents(
  initialState: GameState,
  onStateChange: (newState: GameState) => void
) {
  const [events, setEvents] = useState<string[]>([]);

  const addEvent = useCallback((event: string) => {
    setEvents(prev => [...prev, `Day ${initialState.day}: ${event}`]);
  }, [initialState.day]);

  const handleWork = useCallback(() => {
    const income = calculateJobIncome(initialState.character, initialState.character.background);
    const energyDrain = calculateEnergyDrain('work');

    onStateChange({
      ...initialState,
      character: {
        ...initialState.character,
        energy: Math.max(0, initialState.character.energy - energyDrain),
        money: initialState.character.money + income,
        hunger: Math.max(0, initialState.character.hunger - 15),
        happiness: calculateHappiness({
          ...initialState.character,
          energy: Math.max(0, initialState.character.energy - energyDrain)
        })
      }
    });

    addEvent(`Worked and earned ${income} DZD`);
  }, [initialState, onStateChange, addEvent]);

  return {
    events,
    handleWork,
    addEvent
  };
}