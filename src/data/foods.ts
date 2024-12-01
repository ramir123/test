export const FOODS = {
  BREAKFAST: [
    { name: 'Kesra with Olive Oil', cost: 100, energy: 20, health: 5 },
    { name: 'Khobz Dar', cost: 80, energy: 15, health: 5 },
    { name: 'Mint Tea', cost: 50, energy: 10, health: 2 }
  ],
  LUNCH: [
    { name: 'Couscous', cost: 300, energy: 40, health: 10 },
    { name: 'Chorba', cost: 250, energy: 35, health: 8 },
    { name: 'Tajine', cost: 280, energy: 38, health: 9 }
  ],
  DINNER: [
    { name: 'Chakchouka', cost: 200, energy: 30, health: 7 },
    { name: 'Lentil Soup', cost: 180, energy: 25, health: 6 },
    { name: 'Leftover Couscous', cost: 150, energy: 20, health: 5 }
  ],
  SNACKS: [
    { name: 'Makroud', cost: 80, energy: 15, health: -2 },
    { name: 'Kalb el Louz', cost: 100, energy: 18, health: -3 },
    { name: 'Tea with Pine Nuts', cost: 120, energy: 12, health: 2 }
  ]
} as const;