import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Battery, Cookie, Coins } from 'lucide-react';
import type { Character } from '../types/game';

interface StatsProps {
  character: Character;
}

export function Stats({ character }: StatsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Heart className="text-red-500" size={20} />
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className="bg-red-500 rounded-full h-2.5"
              initial={{ width: 0 }}
              animate={{ width: `${character.health}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Battery className="text-yellow-500" size={20} />
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className="bg-yellow-500 rounded-full h-2.5"
              initial={{ width: 0 }}
              animate={{ width: `${character.energy}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Cookie className="text-brown-500" size={20} />
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className="bg-orange-500 rounded-full h-2.5"
              initial={{ width: 0 }}
              animate={{ width: `${character.hunger}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <motion.div 
          className="flex items-center gap-2"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Coins className="text-green-500" size={20} />
          <span className="font-semibold">{character.money} DZD</span>
        </motion.div>
      </div>
    </div>
  );
}