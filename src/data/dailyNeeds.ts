export const DAILY_NEEDS = {
  WATER: {
    cost: 50,
    healthImpact: 5,
    energyImpact: 10,
    description: 'Clean drinking water'
  },
  TRANSPORTATION: {
    BUS: { cost: 30, energyDrain: 15 },
    TAXI: { cost: 150, energyDrain: 5 },
    SHARED_TAXI: { cost: 80, energyDrain: 10 }
  },
  PRAYER_TIMES: [
    { name: 'Fajr', energyBoost: 5, spiritualBoost: 10 },
    { name: 'Dhuhr', energyBoost: 5, spiritualBoost: 10 },
    { name: 'Asr', energyBoost: 5, spiritualBoost: 10 },
    { name: 'Maghrib', energyBoost: 5, spiritualBoost: 10 },
    { name: 'Isha', energyBoost: 5, spiritualBoost: 10 }
  ]
} as const;