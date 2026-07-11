import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { audio } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Award, RefreshCw, Star, Sparkles, CheckCircle, Volume2, ShieldCheck, Heart } from 'lucide-react';

interface OutroProps {
  students: Student[];
  onRestart: () => void;
}

interface RuleRecap {
  title: string;
  emoji: string;
  concept: string;
  example: string;
  color: string;
}

const LESSON_3_RECAPS: RuleRecap[] = [
  {
    title: "Possessive 's",
    emoji: "🧢",
    concept: "Add apostrophe + 's' to names to show ownership.",
    example: "It is Tom’s seat. 🎫",
    color: "bg-neo-coral/10 border-neo-coral"
  },
  {
    title: "Possessive Pronouns",
    emoji: "👉",
    concept: "Use 'mine', 'yours', 'his', 'hers' to replace nouns.",
    example: "It isn't yours. It's mine! 🏊‍♂️",
    color: "bg-neo-blue/10 border-neo-blue"
  },
  {
    title: "Question: Whose?",
    emoji: "❓",
    concept: "Use 'Whose' to ask who owns an item.",
    example: "Whose towel is this? 🧼",
    color: "bg-purple-50 border-purple-500"
  },
  {
    title: "Let’s...",
    emoji: "🎒",
    concept: "Use 'Let’s' to invite others to do a pool action.",
    example: "Let’s go to the swimming pool! 🏊‍♂️",
    color: "bg-neo-green/10 border-neo-green"
  }
];

export default function OutroCelebration({ students, onRestart }: OutroProps) {
  const [certStudentId, setCertStudentId] = useState<string>('');
  const [showCertificate, setShowCertificate] = useState(false);
  const [outroActiveTab, setOutroActiveTab] = useState<'SUMMARY' | 'ROSTER' | 'CERTIFICATE'>('SUMMARY');

  // Find top students for the podium
  const sortedStudents = [...students].sort((a, b) => b.points - a.points);
  const podium = sortedStudents.slice(0, 3);

  useEffect(() => {
    // Play celebratory sound at load
    audio.playFanfare();
  }, []);

  const handleGenerateCertificate = () => {
    if (!certStudentId) return;
    audio.playSuccess();
    setShowCertificate(true);
  };

  const speakSentence = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    audio.playTick();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const selectedCertStudent = students.find(s => s.id === certStudentId);

  return (
    <div id="outro-celebration-container" className="w-full flex flex-col items-center">
      
      {/* HEADER HERO */}
      <div className="w-full text-center max-w-2xl mx-auto pb-4 border-b-4 border-black mb-5">
        <div className="inline-flex items-center gap-1.5 bg-black text-neo-yellow border-2 border-black px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest mb-3 shadow-[2.5px_2.5px_0px_rgba(255,107,107,1)]">
          <Trophy size={12} className="animate-bounce" /> LESSON 3 COMPLETED!
        </div>
        <h1 className="font-display font-black text-3xl text-black uppercase tracking-tight italic leading-none">
          Congratulations, Swimmers! 🏊‍♂️🏆
        </h1>
        <p className="text-stone-700 text-xs font-bold leading-normal max-w-md mx-auto mt-2 italic">
          You mastered possessive names, pronouns, and "Whose?" questions today at the pool!
        </p>

        {/* TABS SELECTOR */}
        <div className="flex border-2 border-black p-0.5 bg-stone-100 max-w-md mx-auto mt-4">
          <button
            onClick={() => { audio.playTick(); setOutroActiveTab('SUMMARY'); setShowCertificate(false); }}
            className={`flex-1 py-1 px-3 font-mono font-black text-[10px] uppercase cursor-pointer transition ${
              outroActiveTab === 'SUMMARY' ? 'bg-black text-white' : 'hover:bg-slate-200 text-black'
            }`}
          >
            Lesson Summary 📘
          </button>
          <button
            onClick={() => { audio.playTick(); setOutroActiveTab('ROSTER'); setShowCertificate(false); }}
            className={`flex-1 py-1 px-3 font-mono font-black text-[10px] uppercase cursor-pointer transition ${
              outroActiveTab === 'ROSTER' ? 'bg-black text-white' : 'hover:bg-slate-200 text-black'
            }`}
          >
            Podium & Scores 🏆
          </button>
          <button
            onClick={() => { audio.playTick(); setOutroActiveTab('CERTIFICATE'); }}
            className={`flex-1 py-1 px-3 font-mono font-black text-[10px] uppercase cursor-pointer transition ${
              outroActiveTab === 'CERTIFICATE' ? 'bg-black text-white' : 'hover:bg-slate-200 text-black'
            }`}
          >
            Award Diplomas 📜
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* SUMMARY TAB */}
        {outroActiveTab === 'SUMMARY' && (
          <motion.div
            key="summary-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-4 text-left"
          >
            {/* Rules Recap List */}
            <div className="md:col-span-8 bg-stone-50 border-4 border-black p-4 shadow-neo">
              <h3 className="font-display font-black text-sm uppercase text-black italic mb-3">
                📘 Core Pool Grammar Recaps
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LESSON_3_RECAPS.map((recap, idx) => (
                  <div
                    key={idx}
                    className={`border-2 border-black p-3 flex flex-col justify-between ${recap.color} shadow-neo-sm`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-xl leading-none">{recap.emoji}</span>
                        <h4 className="font-display font-black text-xs uppercase text-black">{recap.title}</h4>
                      </div>
                      <p className="text-[10px] font-bold text-stone-600 leading-normal">
                        {recap.concept}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-dashed border-black/10 flex items-center justify-between">
                      <span className="font-mono font-extrabold text-[9px] text-black">
                        {recap.example}
                      </span>
                      <button
                        onClick={() => speakSentence(`Remember: ${recap.title}. ${recap.concept} For example: ${recap.example}`)}
                        className="p-1 bg-white hover:bg-neo-yellow border border-black cursor-pointer text-black"
                      >
                        <Volume2 size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="md:col-span-4 bg-white border-4 border-black p-4 shadow-neo flex flex-col justify-between">
              <div>
                <span className="text-[8px] font-mono font-black bg-[#00FF00]/15 border border-[#16a34a] text-[#16a34a] px-2 py-0.5 uppercase tracking-wide">
                  CLASS STATS
                </span>
                
                <h3 className="font-display font-black text-base text-black uppercase mt-3 leading-tight italic">
                  🏆 Session Achievements
                </h3>

                <div className="space-y-2 mt-4 text-[10px] font-bold text-stone-600">
                  <div className="flex justify-between border-b border-black/5 pb-1">
                    <span>Lessons Mastered:</span>
                    <span className="font-mono text-black">Lesson 3</span>
                  </div>
                  <div className="flex justify-between border-b border-black/5 pb-1">
                    <span>Total Star Swimmers:</span>
                    <span className="font-mono text-black">{students.length}</span>
                  </div>
                  <div className="flex justify-between border-b border-black/5 pb-1">
                    <span>Pool Activities Played:</span>
                    <span className="font-mono text-black">5 / 5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Class Stars Earned:</span>
                    <span className="font-mono font-black text-neo-coral">⭐ {students.reduce((sum, s) => sum + s.points, 0)} pts</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onRestart}
                className="w-full mt-4 py-3 bg-black text-white hover:bg-neo-coral border-2 border-black font-mono font-black text-xs uppercase tracking-wider transition shadow-neo-sm hover:translate-y-0.5 hover:shadow-none cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={12} /> Restart Presentation
              </button>
            </div>
          </motion.div>
        )}

        {/* ROSTER / PODIUM TAB */}
        {outroActiveTab === 'ROSTER' && (
          <motion.div
            key="roster-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-2xl bg-stone-50 border-4 border-black p-5 shadow-neo text-left"
          >
            {/* Visual Classroom Podium */}
            <div className="border-b-2 border-black pb-3 mb-5">
              <h3 className="font-display font-black text-base uppercase text-black italic flex items-center gap-1.5">
                👑 The Swim Captains Podium
              </h3>
              <p className="text-[10px] text-stone-500 font-bold leading-normal mt-0.5">
                Our top three star achievers in today's grammar lessons! Let's cheer! 👏👏
              </p>
            </div>

            {/* PODIUM STRUCTURE */}
            {podium.length >= 3 && (
              <div className="grid grid-cols-3 items-end gap-3 max-w-md mx-auto my-6">
                
                {/* 2nd Place */}
                <div className="flex flex-col items-center">
                  <span className="text-3xl leading-none">{podium[1].emoji}</span>
                  <span className="font-display text-[11px] font-black uppercase text-black tracking-tight mt-1 truncate max-w-full">
                    {podium[1].name}
                  </span>
                  <span className="text-[8px] font-mono font-extrabold bg-stone-100 px-1 border border-black mb-1">
                    {podium[1].points} pts
                  </span>
                  
                  {/* Podium Column */}
                  <div className="w-full bg-slate-200 border-x-4 border-t-4 border-black h-20 flex flex-col justify-center items-center">
                    <span className="font-mono font-black text-xl text-black/50 leading-none">2nd</span>
                  </div>
                </div>

                {/* 1st Place (Center tallest) */}
                <div className="flex flex-col items-center">
                  <Star className="text-neo-yellow fill-neo-yellow stroke-black stroke-[2] mb-1 animate-spin-slow" size={20} />
                  <span className="text-4xl leading-none">{podium[0].emoji}</span>
                  <span className="font-display text-xs font-black uppercase text-black tracking-tight mt-1 truncate max-w-full">
                    {podium[0].name}
                  </span>
                  <span className="text-[8px] font-mono font-black bg-neo-yellow px-1.5 border border-black mb-1">
                    {podium[0].points} pts
                  </span>
                  
                  {/* Podium Column */}
                  <div className="w-full bg-neo-yellow border-x-4 border-t-4 border-black h-28 flex flex-col justify-center items-center shadow-neo-sm relative">
                    <span className="font-mono font-black text-2xl text-black leading-none">1st</span>
                    <span className="absolute -bottom-1 left-1 right-1 bg-black h-1" />
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center">
                  <span className="text-3xl leading-none">{podium[2].emoji}</span>
                  <span className="font-display text-[11px] font-black uppercase text-black tracking-tight mt-1 truncate max-w-full">
                    {podium[2].name}
                  </span>
                  <span className="text-[8px] font-mono font-extrabold bg-stone-100 px-1 border border-black mb-1">
                    {podium[2].points} pts
                  </span>
                  
                  {/* Podium Column */}
                  <div className="w-full bg-[#FF6B6B]/20 border-x-4 border-t-4 border-black h-14 flex flex-col justify-center items-center">
                    <span className="font-mono font-black text-lg text-black/40 leading-none">3rd</span>
                  </div>
                </div>

              </div>
            )}

            {/* FULL ROSTER LIST SUMMARY */}
            <div className="mt-4 pt-4 border-t-2 border-black/10">
              <span className="text-[8px] font-mono font-black text-stone-500 uppercase tracking-widest block mb-2.5">
                ALL SWIMMERS SUMMARY SCORE:
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sortedStudents.map((s, idx) => (
                  <div key={s.id} className="bg-white border-2 border-black p-1.5 flex items-center justify-between text-xs font-black uppercase text-black">
                    <div className="flex items-center gap-1 truncate">
                      <span className="text-stone-400 font-mono text-[9px]">#{String(idx+1).padStart(2, '0')}</span>
                      <span>{s.emoji}</span>
                      <span className="truncate max-w-[55px]">{s.name}</span>
                    </div>
                    <span className="text-[8px] font-mono font-bold bg-purple-50 border border-black px-1">
                      ⭐ {s.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        )}

        {/* CERTIFICATE MAKER TAB */}
        {outroActiveTab === 'CERTIFICATE' && (
          <motion.div
            key="cert-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-2xl bg-stone-50 border-4 border-black p-5 shadow-neo text-left"
          >
            <div className="border-b-2 border-black pb-2 mb-4">
              <h3 className="font-display font-black text-base uppercase text-black italic flex items-center gap-1.5">
                📜 Swimmer Possessives Diploma Maker
              </h3>
              <p className="text-[10px] text-stone-500 font-bold leading-normal mt-0.5">
                Award a custom pool certificate to a stellar student! Select a name below to view and present:
              </p>
            </div>

            {/* Selection Card Row */}
            <div className="flex flex-wrap items-center gap-3 bg-white border-2 border-black p-3 mb-4 shadow-neo-sm">
              <div className="flex-1 min-w-[200px]">
                <label className="text-[8px] font-mono font-black text-stone-600 block mb-1">CHOOSE DIPLOMA RECIPIENT:</label>
                <select
                  value={certStudentId}
                  onChange={(e) => {
                    audio.playTick();
                    setCertStudentId(e.target.value);
                    setShowCertificate(false);
                  }}
                  className="w-full bg-white border-2 border-black p-2 font-mono text-xs font-black uppercase text-black cursor-pointer"
                >
                  <option value="">-- Choose student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.emoji} {s.name} (Stars: {s.points} pts)</option>
                  ))}
                </select>
              </div>

              <button
                disabled={!certStudentId}
                onClick={handleGenerateCertificate}
                className={`py-3 px-5 border-2 border-black font-mono font-black text-xs uppercase tracking-wider transition ${
                  certStudentId
                    ? 'bg-neo-yellow text-black shadow-neo-sm hover:translate-y-0.5 hover:shadow-none cursor-pointer'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                Generate Swimmer Certificate ➔
              </button>
            </div>

            {/* THE VISUAL CERTIFICATE MODAL/BOARD */}
            <AnimatePresence>
              {showCertificate && selectedCertStudent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#4D96FF] border-6 border-black p-6 shadow-neo text-center text-white relative overflow-hidden"
                >
                  {/* Decorative Swimming graphics */}
                  <div className="absolute top-2 left-2 text-2xl opacity-20 select-none">🏊‍♂️</div>
                  <div className="absolute bottom-2 right-2 text-2xl opacity-20 select-none">💦</div>
                  <div className="absolute top-2 right-2 text-2xl opacity-20 select-none">🩱</div>
                  <div className="absolute bottom-2 left-2 text-2xl opacity-20 select-none">🎫</div>

                  {/* Inner Certificate Frame */}
                  <div className="border-4 border-dashed border-white p-5 bg-white text-black flex flex-col items-center justify-center relative">
                    
                    <Sparkles className="text-neo-yellow fill-neo-yellow stroke-black stroke-[2] mb-1 animate-pulse" size={24} />
                    
                    <span className="text-[9px] font-mono font-black tracking-widest text-neo-coral block uppercase mb-1">
                      SWIMMING POOL ACADEMY DIPLOMA
                    </span>

                    <h2 className="font-display font-black text-2xl text-black uppercase leading-tight italic tracking-tight">
                      MASTER OF POSSESSIVES
                    </h2>

                    <div className="w-24 h-1.5 bg-black my-2.5" />

                    <p className="text-[10px] text-stone-500 font-bold uppercase leading-none">
                      This award is proudly presented to:
                    </p>

                    {/* Recipient Name Display */}
                    <div className="my-3 flex items-center justify-center gap-2">
                      <span className="text-3xl leading-none">{selectedCertStudent.emoji}</span>
                      <h1 className="font-display font-black text-3xl text-neo-blue uppercase tracking-tight italic drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)]">
                        {selectedCertStudent.name}
                      </h1>
                    </div>

                    <p className="text-[10px] font-bold text-stone-700 leading-normal max-w-xs text-center italic">
                      For spelling sentences perfectly, identifying owners, and mastering Lesson 3: "Whose seat is this?" with extreme pool-side skill!
                    </p>

                    {/* Signatures row */}
                    <div className="grid grid-cols-2 gap-4 w-full border-t border-black/10 pt-3.5 mt-3.5">
                      <div className="text-center">
                        <span className="font-display text-xs font-black italic block">Mr. Odisho</span>
                        <span className="text-[7px] font-mono text-stone-400 font-bold uppercase leading-none block">CLASSROOM INSTRUCTOR</span>
                      </div>
                      <div className="text-center">
                        <span className="font-display text-xs font-black italic block">Swim Captain 🐬</span>
                        <span className="text-[7px] font-mono text-stone-400 font-bold uppercase leading-none block">POOL SUPERVISOR</span>
                      </div>
                    </div>

                  </div>

                  {/* Certificate Action Footer */}
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <button
                      onClick={() => speakSentence(`Congratulations to our swimmer, ${selectedCertStudent.name}! You are officially declared the master of possessives for completing Lesson 3! Great job!`)}
                      className="px-4 py-1.5 bg-white text-black hover:bg-neo-yellow border-2 border-black font-mono font-black text-[9px] uppercase tracking-wide transition shadow-neo-sm cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Volume2 size={11} /> Speak Certificate Ceremony
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
