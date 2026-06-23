import React, { useState } from 'react';
import { Student } from '../types';
import { Users, Shuffle, CheckCircle, GraduationCap, Edit3 } from 'lucide-react';
import { audio } from '../utils/audio';

const DEFAULT_EMOJIS = [
  '🦁', '🦄', '🐼', '🐨', '🐯', '🦊', '🐰', '🐱', '🐶', '🦉',
  '🐻', '🦥', '🐞', '🦖', '🐝', '🐙', '🐬', '🦘', '🦚', '🐒'
];

interface IntroScreenProps {
  students: Student[];
  onSave: (updatedStudents: Student[]) => void;
  onStart: () => void;
}

export default function IntroScreen({ students, onSave, onStart }: IntroScreenProps) {
  const [localStudents, setLocalStudents] = useState<Student[]>(students);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const handleNameChange = (id: string, newName: string) => {
    const updated = localStudents.map(s => s.id === id ? { ...s, name: newName } : s);
    setLocalStudents(updated);
    onSave(updated);
  };

  const handleEmojiClick = (id: string) => {
    audio.playTick();
    const student = localStudents.find(s => s.id === id);
    if (!student) return;
    const currentIdx = DEFAULT_EMOJIS.indexOf(student.emoji);
    const nextIdx = (currentIdx + 1) % DEFAULT_EMOJIS.length;
    const updated = localStudents.map(s => s.id === id ? { ...s, emoji: DEFAULT_EMOJIS[nextIdx] } : s);
    setLocalStudents(updated);
    onSave(updated);
  };

  const randomizeAll = () => {
    audio.playDrumroll(0.5);
    // Shuffle list of emojis and assign to students
    const shuffledEmojis = [...DEFAULT_EMOJIS].sort(() => Math.random() - 0.5);
    const updated = localStudents.map((s, idx) => ({
      ...s,
      emoji: shuffledEmojis[idx % shuffledEmojis.length]
    }));
    setLocalStudents(updated);
    onSave(updated);
  };

  const setPresetNames = (type: 'english' | 'stars' | 'numbered') => {
    audio.playSuccess();
    const presets = {
      english: [
        'Adam', 'Bella', 'Charlie', 'Daisy', 'Ethan', 'Fiona', 'George', 'Hannah',
        'Ian', 'Julia', 'Kevin', 'Lily', 'Mason', 'Nora', 'Oscar', 'Penny'
      ],
      stars: [
        'Star 1', 'Star 2', 'Star 3', 'Star 4', 'Star 5', 'Star 6', 'Star 7', 'Star 8',
        'Star 9', 'Star 10', 'Star 11', 'Star 12', 'Star 13', 'Star 14', 'Star 15', 'Star 16'
      ],
      numbered: Array.from({ length: 16 }, (_, i) => `Student ${i + 1}`)
    };

    const updated = localStudents.map((s, idx) => ({
      ...s,
      name: presets[type][idx],
      emoji: DEFAULT_EMOJIS[idx % DEFAULT_EMOJIS.length]
    }));
    setLocalStudents(updated);
    onSave(updated);
  };

  return (
    <div id="intro-screen" className="flex flex-col items-center justify-center w-full p-2.5 text-black bg-neo-yellow/10">
      <div className="w-full max-w-5xl bg-white shadow-neo border-4 border-black p-4 transition-all duration-300">
        
        {/* Header section with brand info */}
        <div className="text-center mb-4 border-b-4 border-black pb-3">
          <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 rounded-none text-[10px] font-black uppercase tracking-widest mb-2 font-mono">
            <GraduationCap size={14} /> ENGLISH GRAMMAR • GRADE 2 & 3
          </div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-black italic leading-none">
            SPEAKUP! STUDENTS ✨
          </h1>
          <p className="text-stone-700 mt-1.5 text-xs font-bold italic max-w-lg mx-auto">
            Input student names or choose a quick roster preset below to instantly load the interactive slideshow activities.
          </p>
        </div>

        {/* Preset quick buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          <button
            onClick={() => setPresetNames('english')}
            className="px-3 py-1.5 text-[10px] bg-white text-black font-black uppercase border-2 border-black shadow-neo-sm hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition duration-75 inline-flex items-center gap-1.5 font-mono cursor-pointer"
          >
            📋 English Names
          </button>
          <button
            onClick={() => setPresetNames('stars')}
            className="px-3 py-1.5 text-[10px] bg-neo-blue text-white font-black uppercase border-2 border-black shadow-neo-sm hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition duration-75 inline-flex items-center gap-1.5 font-mono cursor-pointer"
          >
            🌟 Star Pupils
          </button>
          <button
            onClick={() => randomizeAll()}
            className="px-3 py-1.5 text-[10px] bg-neo-green text-black font-black uppercase border-2 border-black shadow-neo-sm hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition duration-75 inline-flex items-center gap-1.5 font-mono cursor-pointer"
          >
            <Shuffle size={12} className="stroke-[3]" /> Mix Emojis
          </button>
        </div>

        {/* The 16 Student Inputs Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-4">
          {localStudents.map((student, index) => {
            // Give each position a cool flat solid color background pattern when editing
            const isSelected = isEditing === student.id;
            const bgClass = isSelected 
              ? 'bg-neo-yellow' 
              : index % 4 === 0 
              ? 'bg-[#FF6B6B]/15' 
              : index % 4 === 1 
              ? 'bg-[#4D96FF]/15' 
              : index % 4 === 2 
              ? 'bg-[#00FF00]/15' 
              : 'bg-white';
              
            return (
              <div
                key={student.id}
                className={`p-2 rounded-none border-2 border-black transition-all duration-150 flex flex-col items-center justify-between text-center relative ${bgClass} ${
                  isSelected ? 'shadow-neo-sm translate-y-[-1px]' : ''
                }`}
              >
                {/* index sticker top-left */}
                <span className="absolute top-0.5 left-1 text-[8px] font-mono font-bold text-black opacity-80 border-b border-black">
                  #{String(index + 1).padStart(2, '0')}
                </span>

                {/* Emoji avatar click triggers next random choice with micro bouncy hover */}
                <button
                  onClick={() => handleEmojiClick(student.id)}
                  className="w-10 h-10 mt-3 flex items-center justify-center bg-white rounded-none shadow-neo-sm text-xl hover:scale-105 active:scale-95 transition-transform duration-100 border-2 border-black relative group cursor-pointer"
                  title="Change Avatar Emoji"
                >
                  <span className="relative z-10">{student.emoji}</span>
                  <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity flex items-center justify-center"></span>
                </button>

                <div className="mt-2 w-full">
                  <input
                    type="text"
                    value={student.name}
                    onChange={(e) => handleNameChange(student.id, e.target.value)}
                    onFocus={() => setIsEditing(student.id)}
                    onBlur={() => setIsEditing(null)}
                    placeholder={`Pupil ${index + 1}`}
                    className="w-full text-center font-black uppercase text-black text-[10px] bg-transparent border-b-2 border-transparent focus:border-black outline-none pb-0.5 tracking-wider"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Save and Start Presentation Action */}
        <div className="flex justify-center mt-4 pt-3 border-t-4 border-black">
          <button
            onClick={() => {
              audio.playSuccess();
              onStart();
            }}
            className="px-6 py-3 bg-neo-yellow text-black font-black text-lg border-4 border-black hover:bg-[#ffe033] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-75 inline-flex items-center gap-2 cursor-pointer shadow-neo-sm"
          >
            <CheckCircle size={18} className="stroke-[3]" />
            Start Speaking Slides! 🚀
          </button>
        </div>

      </div>
    </div>
  );
}
