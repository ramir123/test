import { useState } from 'react';
import type { Character } from '../types/game';
import { BACKGROUNDS } from '../data/backgrounds';
import { SKILLS } from '../data/skills';

export function useCharacter(initialCharacter?: Partial<Character>) {
  const [character, setCharacter] = useState<Character>({
    name: initialCharacter?.name || '',
    gender: initialCharacter?.gender || 'male',
    age: initialCharacter?.age || 18,
    clothing: initialCharacter?.clothing || 'Modern casual',
    skills: initialCharacter?.skills || [],
    background: initialCharacter?.background || BACKGROUNDS[0].id,
    health: initialCharacter?.health || 100,
    energy: initialCharacter?.energy || 100,
    hunger: initialCharacter?.hunger || 100,
    money: initialCharacter?.money || 5000,
    education: initialCharacter?.education || 50,
    happiness: initialCharacter?.happiness || 80
  });

  const updateStats = (updates: Partial<Character>) => {
    setCharacter(prev => ({
      ...prev,
      ...updates,
      health: Math.max(0, Math.min(100, updates.health || prev.health)),
      energy: Math.max(0, Math.min(100, updates.energy || prev.energy)),
      hunger: Math.max(0, Math.min(100, updates.hunger || prev.hunger)),
      happiness: Math.max(0, Math.min(100, updates.happiness || prev.happiness))
    }));
  };

  const addSkill = (skillId: string) => {
    if (SKILLS.find(s => s.id === skillId) && !character.skills.includes(skillId)) {
      setCharacter(prev => ({
        ...prev,
        skills: [...prev.skills, skillId]
      }));
    }
  };

  return {
    character,
    updateStats,
    addSkill
  };
}