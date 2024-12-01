import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Coffee, Utensils, Book } from 'lucide-react';

interface ActionsProps {
  onWork: () => void;
  onRest: () => void;
  onEat: () => void;
  onStudy: () => void;
  disabled?: boolean;
}

export function Actions({ onWork, onRest, onEat, onStudy, disabled }: ActionsProps) {
  const buttonClass = (baseColor: string) => `
    flex items-center justify-center gap-2 
    ${disabled ? 'bg-gray-400 cursor-not-allowed' : `${baseColor} hover:${baseColor.replace('500', '600')}`} 
    text-white p-4 rounded-lg transition-colors
  `;

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    disabled: { scale: 1 }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <motion.button
        onClick={onWork}
        disabled={disabled}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        animate={disabled ? "disabled" : ""}
        className={buttonClass('bg-blue-500')}
      >
        <Briefcase size={20} />
        Work
      </motion.button>
      <motion.button
        onClick={onRest}
        disabled={disabled}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        animate={disabled ? "disabled" : ""}
        className={buttonClass('bg-purple-500')}
      >
        <Coffee size={20} />
        Rest
      </motion.button>
      <motion.button
        onClick={onEat}
        disabled={disabled}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        animate={disabled ? "disabled" : ""}
        className={buttonClass('bg-green-500')}
      >
        <Utensils size={20} />
        Eat
      </motion.button>
      <motion.button
        onClick={onStudy}
        disabled={disabled}
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        animate={disabled ? "disabled" : ""}
        className={buttonClass('bg-yellow-500')}
      >
        <Book size={20} />
        Study
      </motion.button>
    </div>
  );
}