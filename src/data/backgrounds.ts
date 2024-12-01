export const BACKGROUNDS = [
  {
    id: 'university_graduate',
    name: 'University Graduate',
    description: 'Recently graduated with high education but limited work experience',
    initialStats: {
      education: 80,
      money: 3000,
      skills: ['academic']
    }
  },
  {
    id: 'farmers_child',
    name: 'Farmer\'s Child',
    description: 'Grew up learning agricultural skills and hard work',
    initialStats: {
      education: 40,
      money: 2000,
      skills: ['farming']
    }
  },
  {
    id: 'tradesman',
    name: 'Tradesman\'s Apprentice',
    description: 'Learned the art of trading in the souk',
    initialStats: {
      education: 50,
      money: 4000,
      skills: ['trading']
    }
  }
] as const;