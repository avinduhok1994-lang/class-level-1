import React, { useState } from 'react';
import { Student, SpeakingPrompt } from '../types';
import { SOLO_PROMPTS } from '../data/prompts';
import { audio } from '../utils/audio';
import { Sparkles, Award, Bot, HelpCircle, ArrowRight, User, Tv } from 'lucide-react';

interface SoloSlideProps {
  students: Student[];
  onReward: (studentId: string, points: number) => void;
}

export default function SoloSlide({ students, onReward }: SoloSlideProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<SpeakingPrompt>(SOLO_PROMPTS[0]);
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [isProjecting, setIsProjecting] = useState(false);
  
  // Selection animation state
  const [isRolling, setIsRolling] = useState(false);
  const [rollIndex, setRollIndex] = useState(0);

  // AI Prompt loading state
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('animals');

  // Run student selector slot animation
  const rollSpeaker = () => {
    if (isRolling) return;
    setIsRolling(true);
    setActiveStudent(null);
    audio.playDrumroll(1.2);

    let counter = 0;
    const totalTicks = 15;
    const intervalTime = 80;

    const tick = () => {
      setRollIndex(Math.floor(Math.random() * students.length));
      counter++;

      if (counter < totalTicks) {
        setTimeout(tick, intervalTime + counter * 10); // Gradually slow down roller
      } else {
        const finalIdx = Math.floor(Math.random() * students.length);
        setRollIndex(finalIdx);
        setActiveStudent(students[finalIdx]);
        setIsRolling(false);
        audio.playSuccess();
      }
    };

    tick();
  };

  // Trigger Gemini AI endpoint custom prompt generator
  const generateAIPrompt = async () => {
    if (aiLoading) return;
    setAiLoading(true);
    audio.playTick();

    try {
      const resp = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          activityType: 'solo',
          topic: selectedTopic
        })
      });

      const res = await resp.json();
      if (res.success && res.data) {
        setSelectedPrompt(res.data);
        audio.playSuccess();
      } else {
        // Fallback or warning if missing key
        alert("Falling back! Using custom static prompts as GEMINI_API_KEY is not configured.");
        const fallbackList = SOLO_PROMPTS.filter(p => p.topic.toLowerCase() === selectedTopic.toLowerCase() || p.id === 'solo_2');
        if (fallbackList.length > 0) {
          setSelectedPrompt(fallbackList[Math.floor(Math.random() * fallbackList.length)]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div id="solo-slide-container" className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
      
      {/* Left Columns: Randomizer Widget + Timer Control Panel */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        
        {/* Speaker Slot animation module */}
        <div className="bg-white text-black border-4 border-black p-4 shadow-neo flex-1 flex flex-col items-center justify-between min-h-[220px] relative overflow-hidden">
          
          <div className="w-full flex items-center justify-between mb-2 z-10 pb-1.5 border-b-2 border-black">
            <h3 className="font-mono text-xs uppercase tracking-widest text-black font-black flex items-center gap-1.5">
              <User size={13} className="stroke-[2.5]" /> SPEAKER RANDOMIZER
            </h3>
            {activeStudent && (
              <span className="bg-[#00FF00] text-black font-mono text-[9px] font-black px-2 py-0.5 border border-black uppercase">
                ACTIVE
              </span>
            )}
          </div>

          {/* Roller layout */}
          <div className="my-auto py-2 flex flex-col items-center justify-center z-10 w-full min-h-[90px]">
            {isRolling ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-neo-blue border-4 border-black flex items-center justify-center text-4xl animate-bounce mb-2 shadow-neo-sm">
                  {students[rollIndex]?.emoji}
                </div>
                <h2 className="text-xl font-black tracking-wider text-black animate-pulse font-display uppercase">
                  {students[rollIndex]?.name}
                </h2>
                <p className="text-[9px] font-mono tracking-widest text-black/60 font-black mt-0.5 uppercase">ROLLING STAR...</p>
              </div>
            ) : activeStudent ? (
              <div className="flex flex-col items-center animate-scale-up text-center">
                <div className="w-18 h-18 bg-neo-yellow border-4 border-black flex items-center justify-center text-4xl shadow-neo-sm mb-2">
                  {activeStudent.emoji}
                </div>
                <h2 className="text-2xl font-black text-black font-display uppercase tracking-wide italic">
                  {activeStudent.name}
                </h2>
                <div className="mt-1 text-[10px] text-black font-mono bg-[#00FF00]/15 border border-black px-2 py-0.5 font-black">
                  ⭐ SCORE: {activeStudent.points} STARS
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center opacity-85">
                <div className="w-16 h-16 bg-slate-50 border-2 border-black flex items-center justify-center text-3xl mb-2 shadow-neo-sm">
                  ❓
                </div>
                <h2 className="text-xs font-black text-black font-mono uppercase tracking-wider">
                  Who speaks next?
                </h2>
                <p className="text-xs text-stone-600 mt-1 max-w-[200px] text-center font-bold">SPIN TO SELECT A LEVEL-1 SPEAKER.</p>
              </div>
            )}
          </div>

          {/* Action trigger */}
          <button
            onClick={rollSpeaker}
            disabled={isRolling}
            className={`w-full py-4 mt-2 justify-center border-4 border-black flex items-center gap-2 font-black text-xs uppercase tracking-wider transition duration-75 shadow-neo-sm cursor-pointer ${
              isRolling 
                ? 'bg-stone-100 text-stone-400 border-2 shadow-none' 
                : 'bg-neo-yellow hover:bg-[#ffe033] hover:translate-y-[-1px] hover:shadow-neo active:translate-y-0 active:shadow-neo-sm text-black'
            }`}
          >
            <Sparkles size={16} className="stroke-[2.5]" />
            {isRolling ? 'Selecting...' : 'SPIN THE SPEAKER! 🎲'}
          </button>
        </div>

      </div>

      {/* Right Columns: Speaking Prompt Selector + AI Prompt Panel */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        
        {/* Speaking Task board */}
        <div className="bg-white border-4 border-black p-4 shadow-neo flex-1 flex flex-col justify-between">
          <div>
            {/* Topic Badge & Quick selector dropdown */}
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2 pb-2  border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedPrompt.visualHint || '💬'}</span>
                <div>
                  <h4 className="font-display font-black text-black text-base uppercase tracking-tight italic">
                    {selectedPrompt.title}
                  </h4>
                  <span className="text-[9px] font-mono font-black text-black/55 tracking-wider uppercase border border-black px-1 bg-neo-yellow/30">
                    TOPIC: {selectedPrompt.topic}
                  </span>
                </div>
              </div>

              {/* Native selection dropdown for classroom activities */}
              <select
                onChange={(e) => {
                  const id = e.target.value;
                  const found = SOLO_PROMPTS.find(p => p.id === id);
                  if (found) setSelectedPrompt(found);
                }}
                value={selectedPrompt.id}
                className="bg-white border-2 border-black px-2.5 py-1 text-xs text-black font-black uppercase outline-none"
              >
                {SOLO_PROMPTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            {/* Prompt description */}
            <div className="my-1.5">
              <p className="text-xs font-bold text-black italic bg-neo-coral/15 py-1.5 px-3 border-l-4 border-black">
                Teacher's Challenge: "{selectedPrompt.description}"
              </p>
            </div>

            {/* Level 1 Scaffolding instructions */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5 border-b border-black/10 pb-0.5">
                <h5 className="text-[9px] font-mono tracking-widest text-black font-black uppercase">
                  ⚡ SPEAKING STRUCTURES (STUDENT REPEATS & FILLS)
                </h5>
                <button
                  type="button"
                  onClick={() => {
                    audio.playTick();
                    setIsProjecting(true);
                  }}
                  className="px-2 py-0.5 bg-black text-neo-yellow hover:bg-neo-yellow hover:text-black border border-black font-mono font-black text-[9px] uppercase tracking-wide transition cursor-pointer flex items-center gap-1 shadow-neo-sm active:translate-y-[1px]"
                >
                  <Tv size={10} /> Projector Mode 📺
                </button>
              </div>
              
              <div className="space-y-1.5">
                {selectedPrompt.guidelines?.map((line, idx) => (
                  <div 
                    key={idx}
                    className="p-2 bg-slate-50 border-2 border-black font-display text-sm font-bold text-black flex items-center gap-2 shadow-neo-sm"
                  >
                    <span className="text-[10px] bg-black text-white font-mono w-4.5 h-4.5 rounded-none flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-sans font-bold tracking-tight">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Point reward mechanism */}
          {activeStudent && (
            <div className="mt-3 bg-neo-green/10 border-2 border-black p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-neo-sm animate-scale-up">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <div>
                  <h5 className="font-black uppercase text-xs text-black">Reward {activeStudent.name}!</h5>
                  <p className="text-[9px] font-bold text-stone-600">Give star credits on the scoreboard</p>
                </div>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    audio.playSuccess();
                    onReward(activeStudent!.id, 10);
                  }}
                  className="px-3 py-1 bg-neo-yellow text-black font-black border-2 border-black text-[10px] uppercase tracking-wider shadow-neo-sm hover:translate-y-[1px] hover:shadow-none transition-all duration-75 cursor-pointer"
                >
                  <Award size={12} className="inline mr-1" /> +10 Stars ⭐
                </button>
                <button
                  onClick={() => {
                    audio.playSuccess();
                    onReward(activeStudent!.id, 20);
                  }}
                  className="px-3 py-1 bg-neo-coral text-white font-black border-2 border-black text-[10px] uppercase tracking-wider shadow-neo-sm hover:translate-y-[1px] hover:shadow-none transition-all duration-75 cursor-pointer"
                >
                  <Award size={12} className="inline mr-1" /> +20 Stars ⭐⭐
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Gemini AI Custom prompts control bar */}
        <div className="bg-black text-white border-4 border-black p-3 shadow-neo flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neo-yellow/15 border border-neo-yellow/30 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-neo-yellow" />
            </div>
            <div>
              <h4 className="font-display font-black text-xs uppercase tracking-wide">Generate Free Speaking Prompt</h4>
              <p className="text-[8px] text-slate-300 font-mono font-bold tracking-wider">GEMINI AI GENERATOR L1 MODE</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-black border-2 border-white text-xs px-2 py-1 text-white font-bold outline-none uppercase"
            >
              <option value="animals">🦁 Animals & Pets</option>
              <option value="food">🍎 Food & Fruits</option>
              <option value="colors">🎨 Colors & Shapes</option>
              <option value="my family">🏡 My Family</option>
              <option value="weather">☀️ Weather & Seasons</option>
              <option value="school">🎒 School & Bag</option>
            </select>
            
            <button
              onClick={generateAIPrompt}
              disabled={aiLoading}
              className={`px-3 py-1 text-[10px] font-black uppercase font-mono inline-flex items-center gap-1 transition border-2 border-white cursor-pointer shadow-neo-sm hover:translate-y-[1px] hover:shadow-none ${
                aiLoading 
                  ? 'bg-stone-800 text-stone-500 border-none' 
                  : 'bg-neo-green text-black hover:bg-emerald-300'
              }`}
            >
              {aiLoading ? 'Thinking...' : '🤖 Write AI Card'}
            </button>
          </div>
        </div>

      </div>

      {/* FULLSCREEN PROJECTOR OVERLAY */}
      {isProjecting && (
        <div className="fixed inset-0 z-[100] bg-white border-8 border-black flex flex-col justify-between p-8 text-black animate-scale-up">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between border-b-4 border-black pb-4 w-full">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedPrompt.visualHint || '💬'}</span>
              <div>
                <span className="text-xs font-mono font-black uppercase text-stone-500 border border-black px-1.5 py-0.5 bg-neo-yellow/20">
                  SOLO SPEAKING • PROJECTOR MODE
                </span>
                <h2 className="font-display font-black text-2xl uppercase italic text-black">{selectedPrompt.title}</h2>
              </div>
            </div>
            
            <button
              onClick={() => setIsProjecting(false)}
              className="px-4 py-2 bg-neo-coral text-white border-4 border-black font-black uppercase tracking-wider text-xs shadow-neo hover:translate-y-[1px] hover:shadow-neo-sm active:translate-y-0 active:shadow-none transition cursor-pointer"
            >
              Close Projector [X]
            </button>
          </div>

          {/* Epic Main Content Panel - Massive Speaking prompts */}
          <div className="flex-1 flex flex-col justify-center items-center max-w-5xl mx-auto w-full py-8 text-center">
            
            {/* Active Spotlighted Speaker Big Avatar */}
            {activeStudent ? (
              <div className="mb-6 bg-neo-yellow border-4 border-black p-4 inline-flex items-center gap-4 shadow-neo">
                <span className="text-4xl">{activeStudent.emoji}</span>
                <div className="text-left">
                  <span className="text-[10px] font-mono font-black border border-black px-1.5 bg-black text-white py-0.5 uppercase tracking-wide">
                    ACTIVE SPEAKER
                  </span>
                  <h3 className="font-display font-black text-xl text-black uppercase">{activeStudent.name}</h3>
                </div>
              </div>
            ) : (
              <div className="mb-6 border-4 border-dashed border-stone-400 p-4 bg-stone-50 text-stone-500">
                <p className="font-black text-xs uppercase font-mono tracking-wider">No student spotlighted yet</p>
                <button
                  onClick={rollSpeaker}
                  className="mt-2 px-4 py-1.5 bg-neo-blue text-white font-black border-2 border-black text-xs uppercase shadow-neo-sm cursor-pointer"
                >
                  🎲 Spin a Speaker
                </button>
              </div>
            )}

            {/* Huge, beautifully scaled guidelines */}
            <div className="w-full space-y-4 my-auto">
              {selectedPrompt.guidelines?.map((line, idx) => (
                <div 
                  key={idx}
                  className="p-6 bg-slate-50 border-4 border-black font-display text-2xl md:text-3xl font-black text-black flex items-center gap-4 shadow-neo text-left"
                >
                  <span className="text-lg bg-black text-white font-mono w-10 h-10 rounded-none flex items-center justify-center shrink-0 border-2 border-black">
                    {idx + 1}
                  </span>
                  <span className="font-sans font-black tracking-tight flex-1">
                    {activeStudent ? line.replace(/Student/g, activeStudent.name) : line}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Quick interactive action footer */}
          <div className="border-t-4 border-black pt-4 w-full flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              {activeStudent && (
                <button
                  onClick={() => {
                    audio.playSuccess();
                    onReward(activeStudent!.id, 10);
                  }}
                  className="px-6 py-3 bg-neo-green text-black border-4 border-black font-black uppercase text-sm shadow-neo hover:translate-y-0.5 hover:shadow-neo-sm active:translate-y-0 active:shadow-none transition cursor-pointer"
                >
                  ⭐ Give points to {activeStudent.name} (+10 Stars)
                </button>
              )}
            </div>
            
            <p className="text-xs font-mono font-black uppercase text-stone-600 hidden md:block">
              💡 TIP: USE THE CLASSROOM SMARTBOARD TO TAP AND REWARD STUDENTS INSTANTLY
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
