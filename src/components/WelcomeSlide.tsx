import React, { useState } from 'react';
import { Student } from '../types';
import { Sparkles, MessageSquare, Trophy, HelpCircle, Check } from 'lucide-react';
import { audio } from '../utils/audio';
import { motion } from 'motion/react';

interface WelcomeSlideProps {
  students: Student[];
  onNext: () => void;
}

const MISSIONS = [
  { 
    id: 1, 
    emoji: '🦁', 
    title: 'PRONOUNS', 
    targetWords: ['He', 'She', 'It', 'They'], 
    color: 'text-neo-coral',
    bgColor: 'bg-neo-coral/5',
    borderColor: 'border-neo-coral'
  },
  { 
    id: 2, 
    emoji: '🦒', 
    title: 'BE-VERBS', 
    targetWords: ['Is', 'Are'], 
    color: 'text-neo-blue',
    bgColor: 'bg-neo-blue/5',
    borderColor: 'border-neo-blue'
  },
  { 
    id: 3, 
    emoji: '🦓', 
    title: 'HELPERS', 
    targetWords: ['Has', 'Have'], 
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-600'
  },
  { 
    id: 4, 
    emoji: '🦜', 
    title: 'DO / DOES', 
    targetWords: ['Do', 'Does'], 
    color: 'text-neo-green',
    bgColor: 'bg-neo-green/5',
    borderColor: 'border-neo-green'
  }
];

export default function WelcomeSlide({ students, onNext }: WelcomeSlideProps) {
  const [revealedMissions, setRevealedMissions] = useState<number[]>([]);

  const toggleMission = (id: number) => {
    if (revealedMissions.includes(id)) return;
    audio.playTick();
    setRevealedMissions(prev => [...prev, id]);
    if (revealedMissions.length === 3) {
      setTimeout(() => {
        audio.playSuccess();
      }, 300);
    }
  };

  const revealAll = () => {
    audio.playSuccess();
    setRevealedMissions([1, 2, 3, 4]);
  };

  const speakGreeting = () => {
    audio.playFanfare();
  };

  const allRevealed = revealedMissions.length === MISSIONS.length;

  return (
    <div id="welcome-slide" className="flex flex-col items-center justify-between w-full p-2 text-center">
      
      {/* Upper Brand Badge and Heading */}
      <div className="w-full flex flex-col items-center mt-1">
        <div className="relative mb-2">
          <div 
            onClick={speakGreeting}
            className="w-12 h-12 bg-neo-yellow border-4 border-black shadow-neo-sm flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-100"
          >
            <MessageSquare size={24} className="text-black fill-black/10" />
          </div>
          <span className="absolute -top-3.5 -right-3.5 bg-neo-coral text-white font-mono font-black text-[9px] px-2 py-0.5 uppercase border-2 border-black shadow-neo-sm">
            GRADES 2-3
          </span>
        </div>

        <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-black leading-none italic">
          Safari Grammar Adventure! <br />
          <span className="text-neo-coral underline decoration-double decoration-black decoration-2">Speak & Learn Together</span>
        </h1>
        
        <p className="text-stone-700 text-xs font-bold mt-1 max-w-xl">
          Welcome, explorers! Tap the cards below to see our fun safari goals! 🧭
        </p>
      </div>

      {/* TODAY'S MISSION - CLEAR, FUN, INTERACTIVE BOARD */}
      <div className="w-full max-w-4xl bg-stone-50 border-4 border-black p-3.5 mt-4 shadow-neo text-left">
        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
          <h3 className="font-display font-black text-sm text-black flex items-center gap-2 uppercase tracking-tight">
            🎯 Safari Missions ({revealedMissions.length}/{MISSIONS.length})
          </h3>
          <button
            onClick={revealAll}
            className="px-2 py-0.5 bg-black text-white hover:bg-neo-yellow hover:text-black border border-black font-mono font-black text-[9px] uppercase tracking-wider transition cursor-pointer"
          >
            Show All Goals 🔑
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {MISSIONS.map((m) => {
            const isUnlocked = revealedMissions.includes(m.id);
            return (
              <div
                key={m.id}
                onClick={() => toggleMission(m.id)}
                className={`border-4 border-black p-3 min-h-[115px] cursor-pointer transition-all duration-300 relative select-none flex flex-col justify-between ${
                  isUnlocked 
                    ? 'bg-white shadow-neo-sm translate-y-0' 
                    : 'bg-stone-200 hover:bg-stone-300 shadow-neo hover:-translate-y-0.5'
                }`}
              >
                {isUnlocked ? (
                  <>
                    <div className="flex flex-col items-center justify-center text-center h-full w-full py-1">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-xl leading-none">{m.emoji}</span>
                        <span className="text-[10px] font-mono font-black text-black tracking-wider uppercase">{m.title}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 items-center justify-center">
                        {m.targetWords.map((word, wIdx) => (
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
                            className={`inline-block font-display text-sm md:text-base font-black px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] select-none uppercase leading-tight ${m.color} ${m.bgColor}`}
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
                  <div className="flex flex-col items-center justify-center h-full text-center py-2">
                    <HelpCircle size={28} className="text-stone-500 stroke-[2.5] mb-1 animate-pulse" />
                    <span className="text-[10px] font-mono font-black text-stone-600 uppercase tracking-widest">
                      TAP TO UNLOCK
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {allRevealed && (
          <div className="mt-3 bg-neo-green/10 border-2 border-neo-green p-2 text-center text-xs font-black text-black uppercase tracking-wide animate-scale-up">
            🌟 ALL MISSIONS UNLOCKED! LET'S GO!
          </div>
        )}
      </div>

      {/* Start Button */}
      <div className="mt-3.5">
        <button
          onClick={onNext}
          className={`px-8 py-2.5 font-black uppercase text-sm border-4 border-black shadow-neo transition-all duration-75 cursor-pointer ${
            allRevealed 
              ? 'bg-[#00FF00] text-black hover:bg-[#33ff33] hover:translate-x-[-2px] hover:translate-y-[-2px]' 
              : 'bg-[#00FF00] text-black hover:bg-[#33ff33] hover:translate-x-[-2px] hover:translate-y-[-2px]'
          }`}
          disabled={false}
        >
          Let's Start! 🚀
        </button>
      </div>

      {/* Roster classroom grid looking extremely neat */}
      <div className="w-full max-w-4xl bg-white border-4 border-black p-3 mt-4 shadow-neo text-left">
        <h3 className="text-black uppercase tracking-widest text-[9px] font-mono font-black mb-2 inline-flex items-center gap-1.5 justify-center border-b border-black/15 pb-1 w-full">
          <Trophy size={11} className="text-neo-yellow stroke-black stroke-[3]" /> THE SWEET 16 STAR GRAMMAR SPEAKER TEAM
        </h3>
        
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {students.map((student, index) => {
            const cardBg = index % 3 === 0 
              ? 'bg-neo-blue/10' 
              : index % 3 === 1 
              ? 'bg-neo-coral/10'
              : 'bg-white';
            return (
              <div 
                key={student.id}
                className={`p-1.5 border-2 border-black flex items-center gap-1.5 shadow-neo-sm relative ${cardBg}`}
              >
                <span className="text-lg shrink-0">{student.emoji}</span>
                <span className="text-[9px] font-black uppercase tracking-wide text-black truncate w-full">
                  {student.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

