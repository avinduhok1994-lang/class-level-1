import React from 'react';
import { motion } from 'motion/react';
import { audio } from '../utils/audio';
import { Sparkles } from 'lucide-react';

interface SplashIntroProps {
  onEnter: () => void;
}

export default function SplashIntro({ onEnter }: SplashIntroProps) {
  const handleStart = () => {
    audio.playFanfare();
    onEnter();
  };

  // Emojis for floating animation
  const animalEmojis = [
    { emoji: '🦁', delay: 0.1, x: -120, y: -80 },
    { emoji: '🦒', delay: 0.3, x: 130, y: -90 },
    { emoji: '🐘', delay: 0.5, x: -140, y: 80 },
    { emoji: '🐒', delay: 0.7, x: 120, y: 70 },
    { emoji: '🐆', delay: 0.9, x: 0, y: -160 }
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-[#FFDE4D] flex flex-col items-center justify-center overflow-hidden p-6 select-none border-8 md:border-12 border-black">
      {/* Decorative cartoon clouds/shapes in background */}
      <div className="absolute top-10 left-10 w-24 h-12 bg-white rounded-full opacity-60 blur-xs animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-16 bg-white rounded-full opacity-60 blur-xs animate-pulse" />

      {/* Floating Emojis container */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {animalEmojis.map((item, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
              x: item.x,
              y: item.y,
              rotate: [0, -10, 10, 0]
            }}
            transition={{
              type: 'spring',
              stiffness: 70,
              delay: item.delay,
              rotate: {
                repeat: Infinity,
                duration: 4,
                repeatType: 'mirror',
                ease: 'easeInOut'
              }
            }}
            className="absolute text-5xl md:text-6xl select-none filter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"
          >
            {item.emoji}
          </motion.div>
        ))}
      </div>

      {/* Main card */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, delay: 0.2 }}
        className="relative z-10 max-w-lg bg-white border-6 border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-black text-white px-4 py-1.5 font-mono text-xs font-black uppercase tracking-widest mb-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,107,107,1)] inline-flex items-center gap-1.5"
        >
          <Sparkles size={14} className="text-neo-yellow animate-spin" />
          ENGLISH GRAMMAR SAFARI
        </motion.div>

        <h3 className="text-stone-600 font-mono text-xs font-black uppercase tracking-widest">
          WELCOME TO
        </h3>

        <h1 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight text-black italic my-2 relative">
          <motion.span 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.6 }}
            className="block text-neo-coral drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
          >
            Mr. Odisho's
          </motion.span>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="block text-black text-2xl md:text-3xl mt-1 tracking-wide"
          >
            Grammar Adventure!
          </motion.span>
        </h1>

        <p className="text-stone-700 text-xs font-bold leading-normal max-w-xs mt-3 mb-6 italic">
          Ready to explore pronouns, action verbs, and quiz games together? Let's go! 🤠
        </p>

        <motion.button
          onClick={handleStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 bg-[#00FF00] hover:bg-[#33ff33] text-black border-4 border-black font-black text-base uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-75 inline-flex items-center gap-2 cursor-pointer"
        >
          Let's Play! 🎒
        </motion.button>
      </motion.div>
    </div>
  );
}
