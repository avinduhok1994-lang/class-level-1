import React, { useState } from 'react';
import { Student, SpeakingPrompt } from '../types';
import { PAIRS_PROMPTS } from '../data/prompts';
import { audio } from '../utils/audio';
import { Sparkles, MessageSquare, Timer, ArrowRight, Award, Bot, HelpCircle, Tv } from 'lucide-react';

interface PairsSlideProps {
  students: Student[];
  onReward: (studentId: string, points: number) => void;
}

interface Pair {
  id: string;
  studentA: Student;
  studentB: Student;
}

export default function PairsSlide({ students, onReward }: PairsSlideProps) {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<SpeakingPrompt>(PAIRS_PROMPTS[0]);
  const [activePair, setActivePair] = useState<Pair | null>(null);
  const [isProjecting, setIsProjecting] = useState(false);

  // States for timing and generating AI dialogues
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('feelings');

  // Logic to pair up all 16 students randomly
  const generatePairs = () => {
    audio.playDrumroll(0.8);
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    const generated: Pair[] = [];
    
    for (let i = 0; i < shuffled.length; i += 2) {
      if (shuffled[i] && shuffled[i + 1]) {
        generated.push({
          id: `pair_${i / 2 + 1}`,
          studentA: shuffled[i],
          studentB: shuffled[i + 1]
        });
      }
    }
    setPairs(generated);
    setActivePair(generated[0] || null);
    audio.playSuccess();
  };

  // Call server-side Gemini prompt generator with "pairs" format
  const generateAIPairPrompt = async () => {
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
          activityType: 'pairs',
          topic: selectedTopic
        })
      });

      const res = await resp.json();
      if (res.success && res.data) {
        setSelectedPrompt(res.data);
        audio.playSuccess();
      } else {
        alert("Using rich local templates as GEMINI_API_KEY is not defined.");
        const fallbackList = PAIRS_PROMPTS.filter(p => p.topic.toLowerCase() === selectedTopic.toLowerCase() || p.id === 'pairs_1');
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
    <div id="pairs-slide" className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
      
      {/* Left Columns: Visual Booths/Grid of Pairs */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        
        {/* Pairing controller */}
        <div className="bg-white border-4 border-black p-3.5 shadow-neo">
          <div className="flex items-center justify-between mb-2.5 border-b-2 border-black pb-1.5">
            <h3 className="font-mono text-xs uppercase tracking-widest text-black font-black flex items-center gap-1.5">
              👥 8 ROLEPLAY BOOTHS
            </h3>
            <span className="bg-neo-green text-black font-mono text-[9px] font-black px-2 py-0.5 border border-black uppercase">
              {pairs.length > 0 ? 'READY' : 'SETUP'}
            </span>
          </div>

          {pairs.length === 0 ? (
            <div className="text-center py-5">
              <span className="text-3xl">🎲</span>
              <p className="text-xs font-black text-black mt-1.5 uppercase tracking-wide">Get Ready to Pair!</p>
              <p className="text-[10px] text-stone-600 max-w-[200px] mx-auto mt-0.5 font-bold">
                Click below to instantly shuffle and combine the 16 students into 8 roleplay booths.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
              {pairs.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    audio.playTick();
                    setActivePair(p);
                  }}
                  className={`p-2 border text-left transition flex flex-col justify-between ${
                    activePair?.id === p.id 
                      ? 'border-4 border-black bg-neo-yellow/30 shadow-none font-black' 
                      : 'border-2 border-black bg-white hover:bg-slate-50 shadow-neo-sm font-bold'
                  }`}
                >
                  <span className="text-[9px] font-mono font-black text-black/60 uppercase">
                    PAIR #{idx + 1}
                  </span>
                  
                  <div className="mt-1 flex flex-col gap-0.5">
                    <div className="flex items-center gap-1 truncate">
                      <span className="text-xs shrink-0">{p.studentA.emoji}</span>
                      <span className="text-xs font-black text-black truncate">{p.studentA.name}</span>
                    </div>
                    <div className="flex items-center gap-1 truncate">
                      <span className="text-xs shrink-0">{p.studentB.emoji}</span>
                      <span className="text-xs font-black text-black truncate">{p.studentB.name}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={generatePairs}
            className="w-full py-2.5 bg-neo-yellow hover:bg-[#ffe033] text-black border-4 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm hover:translate-y-[-1px] hover:shadow-neo active:translate-y-0 active:shadow-neo-sm mt-3 transition cursor-pointer"
          >
            Create 8 Match Pairs! 🤝
          </button>
        </div>

      </div>

      {/* Right Columns: Main Roleplay Arena Spotlight */}
      <div className="lg:col-span-7 flex flex-col gap-3">
        
        {/* Spotlight Arena */}
        <div className="bg-white border-4 border-black p-4 shadow-neo flex-1 flex flex-col justify-between">
          
          <div>
            {/* Header section with topic dropdown */}
            <div className="flex items-center justify-between mb-2.5 flex-wrap gap-2 pb-2 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedPrompt.visualHint || '💬'}</span>
                <div>
                  <h4 className="font-display font-black text-black text-base uppercase tracking-tight italic">
                    {selectedPrompt.title}
                  </h4>
                  <span className="text-[9px] font-mono font-black text-black/55 tracking-wider uppercase border border-black px-1.5 bg-neo-yellow/30">
                    DIALOGUE TASK • {selectedPrompt.topic}
                  </span>
                </div>
              </div>

              <select
                onChange={(e) => {
                  const id = e.target.value;
                  const found = PAIRS_PROMPTS.find(p => p.id === id);
                  if (found) setSelectedPrompt(found);
                }}
                value={selectedPrompt.id}
                className="bg-white border-2 border-black px-2.5 py-1 text-xs text-black font-black uppercase outline-none"
              >
                {PAIRS_PROMPTS.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            {/* Active Pair Spotlight visualization */}
            {activePair ? (
              <div className="mb-3 bg-neo-yellow border-4 border-black p-3 text-black flex items-center justify-between shadow-neo-sm relative overflow-hidden">
                
                {/* Person A */}
                <div className="flex flex-col items-center flex-1">
                  <span className="bg-neo-blue text-white px-2 py-0.5 border border-black font-mono font-black uppercase text-[8px] mb-1.5 shadow-neo-sm">
                    SPEAKER A
                  </span>
                  <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-2xl shadow-neo-sm">
                    {activePair.studentA.emoji}
                  </div>
                  <h5 className="font-black text-xs mt-1 text-center text-black uppercase">{activePair.studentA.name}</h5>
                </div>

                {/* Arrow */}
                <div className="px-3 text-center shrink-0 flex flex-col items-center">
                  <span className="text-lg">💬</span>
                  <div className="h-0.5 bg-black w-8 my-0.5"></div>
                  <span className="text-[8px] text-black font-black font-mono uppercase">TALK!</span>
                </div>

                {/* Person B */}
                <div className="flex flex-col items-center flex-1">
                  <span className="bg-neo-coral text-white px-2 py-0.5 border border-black font-mono font-black uppercase text-[8px] mb-1.5 shadow-neo-sm">
                    SPEAKER B
                  </span>
                  <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center text-2xl shadow-neo-sm">
                    {activePair.studentB.emoji}
                  </div>
                  <h5 className="font-black text-xs mt-1 text-center text-black uppercase">{activePair.studentB.name}</h5>
                </div>

              </div>
            ) : (
              <div className="p-4 border-4 border-dashed border-black bg-stone-50 rounded-none text-center mb-3">
                <span className="text-2xl">🧩</span>
                <p className="text-[11px] font-black uppercase tracking-wider text-black mt-1">No Active Speaker Group Assigned</p>
                <p className="text-[9px] text-stone-500 font-bold">Generate a pair match on the left sidebar first!</p>
              </div>
            )}

            {/* Speaking Dialogue Flow Guidelines */}
            <div className="mt-2.5">
              <div className="flex items-center justify-between mb-1.5 border-b border-black/10 pb-0.5">
                <h5 className="text-[9px] font-mono tracking-widest text-black font-black uppercase">
                  💬 Partner Dialogue Practice cards
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
                {selectedPrompt.guidelines?.map((line, idx) => {
                  const isA = line.startsWith('A:');
                  const isB = line.startsWith('B:');
                  
                  return (
                    <div 
                      key={idx}
                      className={`p-2 border-2 border-black font-display text-xs font-bold flex items-center gap-2 shadow-neo-sm ${
                        isA 
                          ? 'bg-neo-blue/15 text-black' 
                          : isB 
                          ? 'bg-neo-coral/15 text-black' 
                          : 'bg-white text-black italic'
                      }`}
                    >
                      <span className={`text-[10px] font-mono font-black w-4.5 h-4.5 rounded-none flex items-center justify-center shrink-0 border border-black ${
                        isA 
                          ? 'bg-neo-blue text-white' 
                          : isB 
                          ? 'bg-neo-coral text-white' 
                          : 'bg-black text-white'
                      }`}>
                        {isA ? 'A' : isB ? 'B' : '?'}
                      </span>
                      <span className="font-sans font-bold text-black tracking-tight">
                        {/* Custom print names dynamically into prompt lines if applicable */}
                        {activePair && isA 
                          ? line.replace('A:', `[${activePair.studentA.name}]:`).replace('A ', ` [${activePair.studentA.name}] `).replace('B', ` [${activePair.studentB.name}] `)
                          : activePair && isB 
                          ? line.replace('B:', `[${activePair.studentB.name}]:`).replace('B ', ` [${activePair.studentB.name}] `).replace('A', ` [${activePair.studentA.name}] `)
                          : line
                        }
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Reward mechanism for pairs */}
          {activePair && (
            <div className="mt-3 bg-[#00FF00]/10 border-2 border-black p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-neo-sm animate-scale-up">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <div>
                  <h5 className="font-black uppercase text-xs text-black">Reward Both Speakers!</h5>
                  <p className="text-[9px] font-bold text-stone-600">Give star credits on the scoreboard</p>
                </div>
              </div>
              <button
                onClick={() => {
                  audio.playSuccess();
                  onReward(activePair.studentA.id, 15);
                  onReward(activePair.studentB.id, 15);
                }}
                className="px-4 py-2 bg-neo-green hover:bg-emerald-300 text-black font-black border-2 border-black text-[10px] uppercase tracking-wider shadow-neo-sm hover:translate-y-[1px] hover:shadow-none transition-all duration-75 cursor-pointer"
              >
                <Award size={12} className="inline mr-1" /> Reward +15 Stars Each ⭐
              </button>
            </div>
          )}

        </div>

        {/* AI Generator prompt panel for Pairs */}
        <div className="bg-black text-white border-4 border-black p-3 shadow-neo flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neo-yellow/15 border border-neo-yellow/30 flex items-center justify-center shrink-0">
              <Bot size={16} className="text-neo-yellow" />
            </div>
            <div>
              <h4 className="font-display font-black text-xs uppercase tracking-wide">Generate Custom dialogue</h4>
              <p className="text-[8px] text-slate-300 font-mono font-bold tracking-wider">GEMINI AI GENERATOR L1 PARTNERS</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-black border-2 border-white text-xs px-2 py-1 text-white font-bold outline-none uppercase"
            >
              <option value="feelings">😊 Feelings & Moods</option>
              <option value="pets">🐈 Cats vs Dogs</option>
              <option value="colors">🌈 Colors & Clothes</option>
              <option value="toys">🧸 Toy Sharing</option>
              <option value="hobbies">⚽ Sports & Play</option>
            </select>
            
            <button
              onClick={generateAIPairPrompt}
              disabled={aiLoading}
              className={`px-3 py-1 text-[10px] font-black uppercase font-mono inline-flex items-center gap-1 transition border-2 border-white cursor-pointer shadow-neo-sm hover:translate-y-[1px] hover:shadow-none ${
                aiLoading 
                  ? 'bg-stone-800 text-stone-500 border-none' 
                  : 'bg-neo-green text-black hover:bg-emerald-300'
              }`}
            >
              {aiLoading ? 'Thinking...' : '🤖 Write AI Dialogue'}
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
              <span className="text-4xl">{selectedPrompt.visualHint || '👥'}</span>
              <div>
                <span className="text-xs font-mono font-black uppercase text-stone-500 border border-black px-1.5 py-0.5 bg-neo-yellow/20">
                  PARTNER SPEAKING • PROJECTOR MODE
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

          {/* Epic Main Content Panel */}
          <div className="flex-1 flex flex-col justify-center items-center max-w-5xl mx-auto w-full py-6 text-center">
            
            {/* Active Spotlighted Speaker Team */}
            {activePair ? (
              <div className="mb-6 flex gap-8 items-center justify-center bg-neo-yellow/10 border-4 border-black p-4 shadow-neo">
                
                {/* Speaker A */}
                <div className="flex items-center gap-3 bg-white p-2.5 border-2 border-black shadow-neo-sm">
                  <span className="text-4xl">{activePair.studentA.emoji}</span>
                  <div className="text-left">
                    <span className="text-[9px] font-mono font-black border border-black px-1.2 bg-neo-blue text-white py-0.2 uppercase">SPEAKER A</span>
                    <h5 className="font-sans font-black text-base text-black uppercase">{activePair.studentA.name}</h5>
                  </div>
                </div>

                <div className="text-2xl font-black">⚡ VS ⚡</div>

                {/* Speaker B */}
                <div className="flex items-center gap-3 bg-white p-2.5 border-2 border-black shadow-neo-sm">
                  <span className="text-4xl">{activePair.studentB.emoji}</span>
                  <div className="text-left">
                    <span className="text-[9px] font-mono font-black border border-black px-1.2 bg-neo-coral text-white py-0.2 uppercase">SPEAKER B</span>
                    <h5 className="font-sans font-black text-base text-black uppercase">{activePair.studentB.name}</h5>
                  </div>
                </div>

              </div>
            ) : (
              <div className="mb-6 border-4 border-dashed border-stone-400 p-4 bg-stone-50 text-stone-500">
                <p className="font-black text-xs uppercase font-mono tracking-wider">No pair assigned yet</p>
                <button
                  onClick={generatePairs}
                  className="mt-2 px-4 py-1.5 bg-neo-blue text-white font-black border-2 border-black text-xs uppercase shadow-neo-sm cursor-pointer"
                >
                  🎲 MATCH CLASS PAIRS
                </button>
              </div>
            )}

            {/* Giant dialogue lines for classroom projection */}
            <div className="w-full space-y-4 my-auto">
              {selectedPrompt.guidelines?.map((line, idx) => {
                const isA = line.startsWith('A:');
                const isB = line.startsWith('B:');
                
                // Formatted display
                let cleanLine = line;
                if (activePair) {
                  if (isA) cleanLine = line.replace('A:', `🗣️ ${activePair.studentA.name}:`);
                  if (isB) cleanLine = line.replace('B:', `🗣️ ${activePair.studentB.name}:`);
                }

                return (
                  <div 
                    key={idx}
                    className={`p-5 border-4 border-black font-display text-xl md:text-2xl font-black flex items-center gap-4 shadow-neo text-left ${
                      isA 
                        ? 'bg-neo-blue/10 text-black border-l-[12px] border-l-neo-blue' 
                        : isB 
                        ? 'bg-neo-coral/10 text-black border-l-[12px] border-l-neo-coral' 
                        : 'bg-white text-black italic'
                    }`}
                  >
                    <span className="font-sans font-black tracking-tight flex-1">
                      {cleanLine}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Practice interactive reward footer */}
          <div className="border-t-4 border-black pt-4 w-full flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              {activePair && (
                <>
                  <button
                    onClick={() => {
                      audio.playSuccess();
                      onReward(activePair.studentA.id, 10);
                    }}
                    className="px-4 py-2 bg-neo-blue text-white border-4 border-black font-black uppercase text-xs shadow-neo hover:translate-y-0.5 hover:shadow-neo-sm active:translate-y-0 active:shadow-none transition cursor-pointer"
                  >
                    ⭐ Reward {activePair.studentA.name} (+10)
                  </button>
                  <button
                    onClick={() => {
                      audio.playSuccess();
                      onReward(activePair.studentB.id, 10);
                    }}
                    className="px-4 py-2 bg-neo-coral text-white border-4 border-black font-black uppercase text-xs shadow-neo hover:translate-y-0.5 hover:shadow-neo-sm active:translate-y-0 active:shadow-none transition cursor-pointer"
                  >
                    ⭐ Reward {activePair.studentB.name} (+10)
                  </button>
                </>
              )}
            </div>
            
            <p className="text-xs font-mono font-black uppercase text-stone-600 hidden md:block">
              👉 PRESS CLOSE [X] WHEN READY TO PROCEED TO THE NEXT PAIR
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
