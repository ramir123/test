import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar } from 'lucide-react';
import { BACKGROUNDS } from '../data/backgrounds';

interface CharacterCreationProps {
  onComplete: (name: string, age: number, background: string) => void;
}

export function CharacterCreation({ onComplete }: CharacterCreationProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState(18);
  const [background, setBackground] = useState(BACKGROUNDS[0].id);
  const [step, setStep] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && age >= 18 && age <= 25) {
      onComplete(name, age, background);
    }
  };

  const steps = [
    {
      title: "What's your name?",
      content: (
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
              required
            />
          </div>
        </div>
      )
    },
    {
      title: "How old are you?",
      content: (
        <div className="space-y-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              min="18"
              max="25"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <p className="text-sm text-gray-500">Age must be between 18 and 25</p>
        </div>
      )
    },
    {
      title: "Choose your background",
      content: (
        <div className="space-y-4">
          {BACKGROUNDS.map((bg) => (
            <motion.div
              key={bg.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                background === bg.id ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => setBackground(bg.id)}
            >
              <h3 className="font-semibold">{bg.name}</h3>
              <p className="text-sm opacity-90">{bg.description}</p>
            </motion.div>
          ))}
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-2xl font-bold text-gray-800">{steps[step].title}</h2>
            {steps[step].content}
          </motion.div>

          <div className="flex justify-between">
            {step > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type={step === steps.length - 1 ? 'submit' : 'button'}
              onClick={() => step < steps.length - 1 && setStep(step + 1)}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ml-auto"
            >
              {step === steps.length - 1 ? 'Start Game' : 'Next'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}