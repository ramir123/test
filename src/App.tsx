import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stats } from './components/Stats';
import { Actions } from './components/Actions';
import { GameLog } from './components/GameLog';
import { CharacterCreation } from './components/CharacterCreation';
import { useGame } from './hooks/useGame';
import { MapPin } from 'lucide-react';

function App() {
  const [hasCreatedCharacter, setHasCreatedCharacter] = useState(false);
  const { gameState, messages, actions, isAlive, initializeCharacter } = useGame();
  const { character } = gameState;

  const handleCharacterCreation = (name: string, age: number, background: string) => {
    initializeCharacter(name, age, background);
    setHasCreatedCharacter(true);
  };

  if (!hasCreatedCharacter) {
    return <CharacterCreation onComplete={handleCharacterCreation} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 p-4"
    >
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-4"
        >
          <div className="flex items-center justify-between mb-4">
            <motion.h1
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="text-3xl font-bold text-gray-800"
            >
              El Hayat
            </motion.h1>
            <motion.div
              initial={{ x: 20 }}
              animate={{ x: 0 }}
              className="flex items-center gap-2 text-gray-600"
            >
              <MapPin size={20} />
              <span>{gameState.location}</span>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="mb-4"
          >
            <h2 className="text-xl font-semibold mb-2">Day {gameState.day}</h2>
            <p className="text-gray-600">
              {character.name}, {character.age} years old - {character.background}
            </p>
            <AnimatePresence>
              {!isAlive && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
                >
                  <strong className="font-bold">Game Over!</strong>
                  <p>You have died due to poor health. May Allah grant you peace.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <Stats character={character} />
          <Actions
            onWork={actions.work}
            onRest={actions.rest}
            onEat={actions.eat}
            onStudy={actions.study}
            disabled={!isAlive}
          />
          <GameLog messages={messages} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default App;