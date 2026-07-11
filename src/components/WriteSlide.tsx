import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { audio } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Play, Pause, RotateCcw, Volume2, CheckCircle2, FileText, Award } from 'lucide-react';

interface WriteProps {
  students: Student[];
  onReward: (studentId: string, points: number) => void;
}

interface WriteQuestion {
  id: number;
  prompt: string; // "Tom + Seat"
  correctParts: string[]; // ["Whose", "seat", "is", "this?", "It’s", "Tom’s."]
  scrambledBlocks: string[]; // ["is", "Tom’s.", "this?", "Whose", "It’s", "seat"]
  correctSentence: string; // "Whose seat is this? It’s Tom’s."
}

const WRITE_QUESTIONS: WriteQuestion[] = [
  {
    id: 1,
    prompt: "Seat A27 🎫 belongs to Tom 👨‍🦰",
    correctParts: ["Whose", "seat", "is", "this?", "It’s", "Tom’s."],
    scrambledBlocks: ["is", "Tom’s.", "this?", "Whose", "It’s", "seat"],
    correctSentence: "Whose seat is this? It’s Tom’s."
  },
  {
    id: 2,
    prompt: "Swimming Towel 🧼 belongs to Anna 🏊‍♀️",
    correctParts: ["Whose", "towel", "is", "this?", "It’s", "Anna’s."],
    scrambledBlocks: ["this?", "towel", "Anna’s.", "is", "Whose", "It’s"],
    correctSentence: "Whose towel is this? It’s Anna’s."
  },
  {
    id: 3,
    prompt: "Pool Bag 🎒 belongs to Sue 👧",
    correctParts: ["Whose", "bag", "is", "this?", "It’s", "Sue’s."],
    scrambledBlocks: ["Sue’s.", "bag", "Whose", "this?", "It’s", "is"],
    correctSentence: "Whose bag is this? It’s Sue’s."
  },
  {
    id: 4,
    prompt: "Pool Shoes 👟 belong to Martin 👦",
    correctParts: ["Whose", "shoes", "are", "these?", "They’re", "Martin’s."],
    scrambledBlocks: ["these?", "shoes", "They’re", "Whose", "Martin’s.", "are"],
    correctSentence: "Whose shoes are these? They’re Martin’s."
  }
];

export default function WriteSlide({ students, onReward }: WriteProps) {
  // Mode selection: 'BUILDER' or 'TIMER'
  const [activeTab, setActiveTab] = useState<'BUILDER' | 'TIMER'>('BUILDER');
  
  // Scrambled Sentence Builder States
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [assembledWords, setAsassembledWords] = useState<string[]>([]);
  const [successState, setSuccessState] = useState<boolean>(false);
  const [wrongShake, setWrongShake] = useState<boolean>(false);
  const [rewardStudentId, setRewardStudentId] = useState<string>('');

  // Physical Notebook Writing Timer States
  const [timeLeft, setTimeLeft] = useState(120); // 2-minute writing time
  const [timerRunning, setTimerRunning] = useState(false);

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setTimerRunning(false);
            audio.playFanfare();
            alert("⏰ Time is up! Swimmers, hold your pencils up! 🏊‍♂️✏️");
            return 0;
          }
          // Soft ticking sound every 30 seconds
          if (t % 30 === 0) {
            audio.playTick();
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft]);

  // Sentence Builder logic
  const activeQuestion = WRITE_QUESTIONS[currentQuestionIdx];

  const handleWordBlockClick = (word: string) => {
    if (successState) return;
    audio.playTick();
    setAsassembledWords(prev => [...prev, word]);
  };

  const handleRemoveWord = (index: number) => {
    if (successState) return;
    audio.playTick();
    setAsassembledWords(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleCheckSentence = () => {
    const assembledStr = assembledWords.join(' ');
    const targetStr = activeQuestion.correctParts.join(' ');

    if (assembledStr === targetStr) {
      // SUCCESS!
      audio.playSuccess();
      setSuccessState(true);
      if (rewardStudentId) {
        onReward(rewardStudentId, 15);
        const studName = students.find(s => s.id === rewardStudentId)?.name;
        alert(`⭐ Master Writer! +15 Points awarded to ${studName}! 📝`);
      }
    } else {
      // WRONG ORDER
      audio.playIncorrect();
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 500);
      alert("❌ Almost there! Check your word order or punctuation. Try again!");
    }
  };

  const handleResetBuilder = () => {
    audio.playTick();
    setAsassembledWords([]);
    setSuccessState(false);
  };

  const handleNextBuilderQuestion = () => {
    audio.playTick();
    if (currentQuestionIdx < WRITE_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setAsassembledWords([]);
      setSuccessState(false);
      setRewardStudentId('');
    } else {
      alert("🎉 All 4 sentences constructed! You are a master pool writer! 🏅");
    }
  };

  const handlePrevBuilderQuestion = () => {
    audio.playTick();
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
      setAsassembledWords([]);
      setSuccessState(false);
      setRewardStudentId('');
    }
  };

  const speakSentence = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    audio.playTick();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  // Timer format helper
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${String(remainingSecs).padStart(2, '0')}`;
  };

  return (
    <div id="write-slide" className="flex flex-col items-center w-full">
      
      {/* SECTOR HEADER */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between border-b-4 border-black pb-3 mb-4 text-left">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl">📝</span>
          <div>
            <h2 className="font-display font-black text-black text-xl uppercase tracking-tight italic leading-none">
              4 – Write the Sentences
            </h2>
          </div>
        </div>

        {/* CONTROLS TOGGLE TABS */}
        <div className="flex border-2 border-black p-0.5 bg-stone-100 mt-2 sm:mt-0">
          <button
            onClick={() => { audio.playTick(); setActiveTab('BUILDER'); }}
            className={`px-3 py-1 font-mono font-black text-[10px] uppercase cursor-pointer transition ${
              activeTab === 'BUILDER' ? 'bg-black text-white' : 'hover:bg-slate-200 text-black'
            }`}
          >
            Digital Scrambler 🧩
          </button>
          <button
            onClick={() => { audio.playTick(); setActiveTab('TIMER'); }}
            className={`px-3 py-1 font-mono font-black text-[10px] uppercase cursor-pointer transition ${
              activeTab === 'TIMER' ? 'bg-black text-white' : 'hover:bg-slate-200 text-black'
            }`}
          >
            Pencil & Notebook Timer ⏰
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: DIGITAL WORD SCRAMBLER */}
        {activeTab === 'BUILDER' && (
          <motion.div
            key="builder"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 text-left"
          >
            {/* Scrambler Left Area */}
            <div className="lg:col-span-8 bg-stone-50 border-4 border-black p-4 shadow-neo flex flex-col justify-between min-h-[360px]">
              
              {/* Question Progress Bar */}
              <div className="flex items-center justify-between mb-4 border-b border-black/10 pb-2">
                <span className="text-[9px] font-mono font-black bg-neo-coral text-white border border-black px-2 py-0.5 uppercase tracking-wider">
                  SENTENCE {currentQuestionIdx + 1} OF {WRITE_QUESTIONS.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentQuestionIdx === 0}
                    onClick={handlePrevBuilderQuestion}
                    className={`px-2 py-1 text-[9px] border border-black font-mono font-black uppercase tracking-wide cursor-pointer select-none transition ${
                      currentQuestionIdx === 0 ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-white hover:bg-stone-100 text-black'
                    }`}
                  >
                    ◀ Prev
                  </button>
                  <button
                    disabled={currentQuestionIdx === WRITE_QUESTIONS.length - 1}
                    onClick={handleNextBuilderQuestion}
                    className={`px-2 py-1 text-[9px] border border-black font-mono font-black uppercase tracking-wide cursor-pointer select-none transition ${
                      currentQuestionIdx === WRITE_QUESTIONS.length - 1 ? 'bg-stone-200 text-stone-400 cursor-not-allowed' : 'bg-white hover:bg-stone-100 text-black'
                    }`}
                  >
                    Next ▶
                  </button>
                </div>
              </div>

              {/* ACTIVE PROMPT CARD */}
              <div className="bg-white border-2 border-black p-3 shadow-neo-sm mb-4">
                <span className="text-[8px] font-mono font-black bg-black text-neo-yellow border border-black px-1.5 py-0.5 uppercase tracking-wide leading-none">
                  SCRAMBLER CHALLENGE
                </span>
                <p className="font-display font-black text-sm md:text-base text-black mt-1.5 tracking-tight">
                  {activeQuestion.prompt}
                </p>
              </div>

              {/* ASSEMBLY BOARD */}
              <div 
                className={`border-4 border-dashed p-4 min-h-[90px] flex flex-wrap gap-2 items-center bg-white border-black/20 ${
                  wrongShake ? 'animate-shake border-red-500 bg-red-50' : ''
                } ${successState ? 'bg-neo-green/10 border-[#16a34a]/30' : ''}`}
              >
                {assembledWords.length === 0 ? (
                  <span className="text-stone-400 text-xs font-bold font-mono">
                    Tap word blocks below to build.
                  </span>
                ) : (
                  assembledWords.map((word, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => handleRemoveWord(idx)}
                      initial={{ scale: 0.8, y: 5 }}
                      animate={{ scale: 1, y: 0 }}
                      className="px-2.5 py-1 bg-black text-white hover:bg-neo-coral hover:text-white border-2 border-black font-display font-bold text-xs uppercase tracking-wide cursor-pointer"
                    >
                      {word} <span className="text-[7px] text-stone-400 font-mono ml-1 font-bold">✕</span>
                    </motion.button>
                  ))
                )}
              </div>

              {/* ACTION ROW BUILDER */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  disabled={assembledWords.length === 0 || successState}
                  onClick={handleCheckSentence}
                  className={`px-4 py-2 border-2 border-black font-mono font-black text-xs uppercase tracking-wider transition ${
                    assembledWords.length === 0 || successState
                      ? 'bg-stone-100 text-stone-400 cursor-not-allowed shadow-none'
                      : 'bg-neo-green hover:bg-[#22dd22] text-black shadow-neo-sm hover:translate-y-0.5 hover:shadow-none cursor-pointer'
                  }`}
                >
                  Check Sentence ✔
                </button>
                <button
                  disabled={assembledWords.length === 0}
                  onClick={handleResetBuilder}
                  className="px-3 py-2 bg-white hover:bg-stone-100 text-black border-2 border-black font-mono font-black text-xs uppercase transition shadow-neo-sm cursor-pointer"
                >
                  Clear Assembly ✕
                </button>
              </div>

              {/* AVAILABLE BLOCKS CARD */}
              <div className="mt-4 pt-4 border-t-2 border-black/10">
                <span className="text-[8px] font-mono font-black text-stone-500 uppercase tracking-widest leading-none block mb-2.5">
                  AVAILABLE WORD BLOCKS:
                </span>

                <div className="flex flex-wrap gap-2.5">
                  {activeQuestion.scrambledBlocks.map((block, bIdx) => {
                    const blockCount = assembledWords.filter(w => w === block).length;
                    const maxCount = activeQuestion.correctParts.filter(w => w === block).length;
                    const isUsedUp = blockCount >= maxCount;

                    return (
                      <motion.button
                        key={bIdx}
                        disabled={isUsedUp}
                        onClick={() => handleWordBlockClick(block)}
                        whileHover={isUsedUp ? {} : { scale: 1.05 }}
                        whileTap={isUsedUp ? {} : { scale: 0.95 }}
                        className={`px-3 py-2 border-2 border-black text-black font-display text-sm font-black uppercase tracking-wide cursor-pointer transition select-none ${
                          isUsedUp 
                            ? 'bg-stone-200 border-stone-300 text-stone-400 cursor-not-allowed shadow-none' 
                            : 'bg-white hover:bg-neo-yellow shadow-neo-sm'
                        }`}
                      >
                        {block}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Scrambler Right Area: Rewards & Feedback */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              
              {/* SUCCESS RESULTS CARD */}
              <div className="bg-white border-4 border-black p-4 shadow-neo flex-1 flex flex-col justify-between">
                
                {successState ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-left h-full flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-neo-coral text-xs">✨</span>
                      <span className="text-[9px] font-mono font-black bg-[#00FF00]/15 border border-[#16a34a] text-[#16a34a] px-2 py-0.5 uppercase tracking-wide ml-1.5 rounded-none">
                        Correct Assemble!
                      </span>
                      
                      <h3 className="font-display font-black text-lg text-black uppercase mt-3 leading-tight italic">
                        Perfect Writing!
                      </h3>
                      
                      <p className="font-display font-black text-base md:text-lg text-[#16a34a] mt-2 bg-stone-50 border-2 border-black p-3 shadow-neo-sm">
                        "{activeQuestion.correctSentence}"
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-dashed border-black/10">
                      <button
                        onClick={() => speakSentence(activeQuestion.correctSentence)}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white border-2 border-black font-mono font-black text-xs uppercase tracking-wider transition shadow-neo-sm cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Volume2 size={13} /> Listen to Sentence Pronounce
                      </button>

                      <button
                        onClick={handleNextBuilderQuestion}
                        className="w-full mt-2 py-2.5 bg-neo-yellow hover:bg-[#ffe233] text-black border-2 border-black font-mono font-black text-xs uppercase tracking-wider transition shadow-neo-sm cursor-pointer"
                      >
                        Try Next Sentence ➔
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-10 opacity-75 my-auto">
                    <FileText size={42} className="text-stone-400 stroke-[2] mx-auto mb-2" />
                    <h4 className="font-display font-black text-xs uppercase text-stone-600">Pending Assembly</h4>
                  </div>
                )}

              </div>

              {/* WRITER REWARDS PANEL */}
              <div className="bg-white border-4 border-black p-4 shadow-neo">
                <span className="text-[9px] font-mono font-black uppercase text-stone-500 border border-black px-2 py-0.5 bg-neo-yellow/20 inline-block mb-1.5">
                  REWARDS
                </span>
                <h4 className="font-display font-black text-xs uppercase italic text-black mb-1 flex items-center gap-1">
                  <Award size={13} /> Notebook Rewarder
                </h4>

                <div className="space-y-2 mt-2">
                  <select
                    value={rewardStudentId}
                    onChange={(e) => setRewardStudentId(e.target.value)}
                    className="w-full bg-white border-2 border-black p-1.5 font-mono text-xs font-black uppercase text-black cursor-pointer"
                  >
                    <option value="">-- Choose student to reward --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>{s.emoji} {s.name} ({s.points} pts)</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: PENCIL & NOTEBOOK WRITING TIMER */}
        {activeTab === 'TIMER' && (
          <motion.div
            key="timer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 text-left"
          >
            {/* Timer Left Panel */}
            <div className="lg:col-span-8 bg-stone-50 border-4 border-black p-6 shadow-neo flex flex-col items-center justify-between min-h-[350px]">
              
              <div className="text-center w-full pb-3 border-b border-black/10">
                <span className="text-[10px] font-mono font-black bg-purple-100 text-purple-600 border border-purple-500 px-3 py-0.5 uppercase tracking-widest">
                  Physical Notebook Lesson Mode
                </span>
                <h3 className="font-display font-black text-xl text-black uppercase mt-2 italic leading-none">
                  ✏️ Notebook Copy Session
                </h3>
              </div>

              {/* GIANT COUNTDOWN TIMER */}
              <div className="my-6 text-center select-none">
                <span className="font-mono text-7xl md:text-8xl font-black text-black tracking-tighter block leading-none tabular-nums filter drop-shadow-[4px_4px_0px_rgba(255,107,107,1)]">
                  {formatTime(timeLeft)}
                </span>
                
                <span className="text-[10px] font-mono font-black uppercase tracking-widest text-stone-500 block mt-3">
                  {timerRunning ? '⚡ SWIMMERS ARE COPYING SENTENCES...' : '⏱️ Timer is Paused'}
                </span>
              </div>

              {/* COUNTDOWN CONTROLS */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    audio.playTick();
                    setTimerRunning(!timerRunning);
                  }}
                  className={`px-5 py-3 border-2 border-black font-mono font-black text-xs uppercase tracking-wider transition shadow-neo-sm hover:translate-y-0.5 hover:shadow-none cursor-pointer flex items-center gap-1.5 ${
                    timerRunning ? 'bg-neo-coral text-white' : 'bg-neo-green text-black'
                  }`}
                >
                  {timerRunning ? <Pause size={14} /> : <Play size={14} />}
                  {timerRunning ? 'Pause Session' : 'Start Timer'}
                </button>

                <button
                  onClick={() => {
                    audio.playTick();
                    setTimerRunning(false);
                    setTimeLeft(120);
                  }}
                  className="px-4 py-3 bg-white hover:bg-stone-100 text-black border-2 border-black font-mono font-black text-xs uppercase transition shadow-neo-sm hover:translate-y-0.5 hover:shadow-none cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw size={14} /> Reset
                </button>
              </div>

              {/* TIMING SELECTOR BADGES */}
              <div className="flex gap-2.5 mt-4 pt-4 border-t border-black/10 w-full justify-center">
                {[
                  { label: '1 Minute', secs: 60 },
                  { label: '2 Minutes', secs: 120 },
                  { label: '5 Minutes', secs: 300 }
                ].map((preset) => (
                  <button
                    key={preset.secs}
                    onClick={() => {
                      audio.playTick();
                      setTimerRunning(false);
                      setTimeLeft(preset.secs);
                    }}
                    className={`px-2.5 py-1 text-[9px] font-mono font-black uppercase border border-black cursor-pointer transition ${
                      timeLeft === preset.secs ? 'bg-black text-white' : 'bg-white hover:bg-stone-50 text-black'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

            </div>

            {/* Timer Right Panel: The actual notebook prompt lists */}
            <div className="lg:col-span-4 bg-white border-4 border-black p-4 shadow-neo flex flex-col justify-between">
              
              <div>
                <span className="text-[8px] font-mono font-black bg-black text-neo-yellow px-2 py-0.5 border border-black uppercase inline-block mb-2">
                  BLACKBOARD MODEL
                </span>
                <h3 className="font-display font-black text-sm uppercase italic text-black mb-3">
                  📋 Target Sentences
                </h3>

                <div className="space-y-3 text-left">
                  {WRITE_QUESTIONS.map((q) => (
                    <div key={q.id} className="border-l-4 border-neo-blue pl-2.5 py-0.5">
                      <span className="text-[9px] font-mono font-black text-stone-400 block uppercase leading-none">SENTENCE {q.id}</span>
                      <p className="font-display font-black text-xs md:text-sm text-stone-800 tracking-tight leading-normal mt-0.5">
                        {q.correctSentence}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
