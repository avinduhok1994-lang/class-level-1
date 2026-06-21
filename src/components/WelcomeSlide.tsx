import React from 'react';
import { Student } from '../types';
import { Sparkles, MessageSquare, Volume2, Trophy } from 'lucide-react';
import { audio } from '../utils/audio';

interface WelcomeSlideProps {
  students: Student[];
  onNext: () => void;
}

export default function WelcomeSlide({ students, onNext }: WelcomeSlideProps) {
  const speakGreeting = () => {
    audio.playFanfare();
  };

  return (
    <div id="welcome-slide" className="flex flex-col items-center justify-between w-full p-2 text-center">
      
      {/* Decorative center icon widget */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mt-2">
        <div className="relative mb-3">
          <div 
            onClick={speakGreeting}
            className="w-16 h-16 bg-neo-yellow border-4 border-black shadow-neo flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-100 animate-float"
          >
            <MessageSquare size={32} className="text-black fill-black/10" />
          </div>
          <span className="absolute -top-3 -right-3 bg-neo-coral text-white font-mono font-black text-xs px-2.5 py-1 uppercase border-2 border-black shadow-neo-sm">
            LEVEL 1
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-black leading-none italic">
          LET'S SPEAK ENGLISH! <br />
          <span className="text-neo-coral underline decoration-double decoration-black decoration-2">SPEAKUP PRESENTATIONS</span>
        </h1>
        
        <p className="text-black/80 text-sm font-bold italic mt-3 max-w-xl leading-normal">
          Hello superstars! Today, we will speak English together. Get ready for fun Solo tasks, Pair talks, Group chains, and an interactive Quiz!
        </p>

        {/* Start quick click action */}
        <button
          onClick={onNext}
          className="mt-4 px-8 py-2.5 bg-[#00FF00] text-black font-black uppercase text-sm border-4 border-black shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-75 cursor-pointer"
        >
          Let's Go! 👉
        </button>
      </div>

      {/* Roster classroom grid looking extremely neat */}
      <div className="w-full max-w-5xl bg-white border-4 border-black p-3.5 mt-4 shadow-neo text-left">
        <h3 className="text-black uppercase tracking-widest text-[11px] font-black mb-2 inline-flex items-center gap-1.5 justify-center border-b-2 border-black pb-0.5">
          <Trophy size={12} className="text-neo-yellow stroke-black stroke-[3]" /> THE SWEET 16 STAR SPEAKERS
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {students.map((student, index) => {
            const cardBg = index % 3 === 0 
              ? 'bg-neo-blue/15' 
              : index % 3 === 1 
              ? 'bg-neo-coral/15'
              : 'bg-white';
            return (
              <div 
                key={student.id}
                className={`p-2 border-2 border-black flex items-center gap-2 shadow-neo-sm relative ${cardBg}`}
              >
                <span className="text-xl shrink-0">{student.emoji}</span>
                <span className="text-xs font-black uppercase tracking-wide text-black truncate w-full">
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
