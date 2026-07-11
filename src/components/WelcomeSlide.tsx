import React, { useState } from 'react';
import { Student } from '../types';
import { Sparkles, MessageSquare, Check, HelpCircle } from 'lucide-react';
import { audio } from '../utils/audio';
import { motion } from 'motion/react';

interface WelcomeSlideProps {
  students: Student[];
  onNext: () => void;
}

const LESSON_GOALS = [
  { 
    id: 1, 
    emoji: '🧢', 
    title: "POSSESSIVE 'S", 
    targetWords: ["Tom's", "Anna's", "Sue's", "Martin's"], 
    description: "Show ownership. Example: Tom’s seat.",
    color: 'text-neo-coral',
    bgColor: 'bg-neo-coral/5',
    borderColor: 'border-neo-coral'
  },
  { 
    id: 2, 
    emoji: '👉', 
    title: 'POSSESSIVE PRONOUNS', 
    targetWords: ['mine', 'yours', 'his', 'hers'], 
    description: "Replace nouns. Example: It is mine.",
    color: 'text-neo-blue',
    bgColor: 'bg-neo-blue/5',
    borderColor: 'border-neo-blue'
  },
  { 
    id: 3, 
    emoji: '❓', 
    title: 'QUESTION: WHOSE?', 
    targetWords: ['Whose seat', 'Whose cap', 'Whose bag'], 
    description: "Ask who owns it. Example: Whose?",
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-600'
  },
  { 
    id: 4, 
    emoji: '🏊‍♂️', 
    title: "LET'S ...", 
    targetWords: ["Let's go", "Let's watch", "Let's move"], 
    description: "Suggest doing things together. Example: Let’s.",
    color: 'text-neo-green',
    bgColor: 'bg-neo-green/5',
    borderColor: 'border-neo-green'
  }
];

export default function WelcomeSlide({ students, onNext }: WelcomeSlideProps) {
  const [revealedGoals, setRevealedGoals] = useState<number[]>([]);

  const toggleGoal = (id: number) => {
    if (revealedGoals.includes(id)) return;
    audio.playTick();
    setRevealedGoals(prev => [...prev, id]);
    if (revealedGoals.length === LESSON_GOALS.length - 1) {
      setTimeout(() => {
        audio.playSuccess();
      }, 300);
    }
  };

  const revealAll = () => {
    audio.playSuccess();
    setRevealedGoals([1, 2, 3, 4]);
  };

  const speakWelcome = () => {
    audio.playFanfare();
    // Speak a fun welcoming phrase using speechSynthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance("Welcome, class! Today we are learning Lesson 3: Whose seat is this? Let's explore possessives together!");
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div id="welcome-slide" className="flex flex-col items-center justify-between w-full p-2 text-center">
      
      {/* Upper Brand Badge and Heading */}
      <div className="w-full flex flex-col items-center mt-1">
        <div className="relative mb-2">
          <div 
            onClick={speakWelcome}
            title="Listen to Welcome"
            className="w-12 h-12 bg-neo-yellow border-4 border-black shadow-neo-sm flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-100"
          >
            <MessageSquare size={24} className="text-black fill-black/10" />
          </div>
          <span className="absolute -top-3.5 -right-3.5 bg-neo-coral text-white font-mono font-black text-[9px] px-2 py-0.5 uppercase border-2 border-black shadow-neo-sm">
            LESSON 3
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-black leading-none italic">
          Whose Seat Is This? <br />
          <span className="text-neo-blue underline decoration-double decoration-black decoration-2">Possessive 's & Pronouns</span>
        </h1>
        
        <p className="text-stone-700 text-xs font-bold mt-1 max-w-xl">
          Tap the goals below to start! 🏊‍♂️
        </p>
      </div>

      {/* TODAY'S MISSION - CLEAR, FUN, INTERACTIVE BOARD */}
      <div className="w-full max-w-4xl bg-stone-50 border-4 border-black p-4 mt-4 shadow-neo text-left">
        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
          <h3 className="font-display font-black text-sm text-black flex items-center gap-2 uppercase tracking-tight">
            🎯 Lesson Goals ({revealedGoals.length}/{LESSON_GOALS.length})
          </h3>
          <button
            onClick={revealAll}
            className="px-2.5 py-1 bg-black text-white hover:bg-neo-yellow hover:text-black border-2 border-black font-mono font-black text-[9px] uppercase tracking-wider transition cursor-pointer shadow-neo-sm"
          >
            Reveal All Goals 🔑
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {LESSON_GOALS.map((g) => {
            const isUnlocked = revealedGoals.includes(g.id);
            return (
              <div
                key={g.id}
                onClick={() => toggleGoal(g.id)}
                className={`border-4 border-black p-3.5 min-h-[140px] cursor-pointer transition-all duration-300 relative select-none flex flex-col justify-between ${
                  isUnlocked 
                    ? 'bg-white shadow-neo-sm translate-y-0' 
                    : 'bg-stone-200 hover:bg-stone-300 shadow-neo hover:-translate-y-0.5'
                }`}
              >
                {isUnlocked ? (
                  <>
                    <div className="flex flex-col h-full justify-between py-1 text-left">
                      <div>
                        <div className="flex items-center gap-1.5 mb-2">
                          <span className="text-2xl leading-none">{g.emoji}</span>
                          <span className="text-[10px] font-mono font-black text-black tracking-wider uppercase leading-none">{g.title}</span>
                        </div>
                        <p className="text-[10px] font-bold text-stone-600 leading-normal mb-2.5">
                          {g.description}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 items-center mt-auto">
                        {g.targetWords.map((word, wIdx) => (
                          <motion.span
                            key={wIdx}
                            initial={{ scale: 0, rotate: -15 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 220, 
                              damping: 10,
                              delay: wIdx * 0.08 
                            }}
                            className={`inline-block font-display text-[10px] sm:text-xs font-black px-1.5 py-0.5 border-2 border-black shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] select-none uppercase leading-tight ${g.color} ${g.bgColor}`}
                          >
                            {word}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    <span className="absolute bottom-1 right-1 bg-neo-green text-black border border-black p-0.5 rounded-none">
                      <Check size={8} className="stroke-[4]" />
                    </span>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center h-full py-4">
                    <HelpCircle size={28} className="text-stone-400 stroke-[2.5] mb-2" />
                    <span className="text-[10px] font-mono font-black text-stone-500 uppercase tracking-widest leading-none">Goal {g.id}</span>
                    <span className="text-[9px] font-bold text-stone-400 uppercase mt-1">Tap to Unlock</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Roster & Quick Action overview footer */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 bg-white border-4 border-black p-3 mt-4 text-left">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏊‍♂️</span>
          <div>
            <h4 className="text-xs font-black uppercase text-black">SWIMMING ROSTER ({students.length} Swimmers)</h4>
          </div>
        </div>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-neo-green hover:bg-[#33ff33] text-black border-4 border-black font-mono font-black text-xs uppercase tracking-wide transition shadow-neo-sm active:translate-y-0.5 active:shadow-none cursor-pointer"
        >
          Let's Go! ➔
        </button>
      </div>

    </div>
  );
}
