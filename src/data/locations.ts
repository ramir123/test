export const LOCATIONS = {
  ALGIERS: 'Algiers',
  ORAN: 'Oran',
  CONSTANTINE: 'Constantine',
  GHARDAIA: 'Ghardaia'
} as const;

export const LOCATION_DESCRIPTIONS = {
  [LOCATIONS.ALGIERS]: 'The bustling capital with its iconic Casbah',
  [LOCATIONS.ORAN]: 'A vibrant coastal city known for its cultural diversity',
  [LOCATIONS.CONSTANTINE]: 'The City of Bridges, suspended over dramatic gorges',
  [LOCATIONS.GHARDAIA]: 'An ancient desert city with traditional M\'zab architecture'
};