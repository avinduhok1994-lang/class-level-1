import React, { useState } from 'react';
import { Student } from '../types';
import { audio } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Volume2, CheckCircle2, RotateCcw, HelpCircle, Award } from 'lucide-react';

interface GrammarProps {
  students: Student[];
  onReward: (studentId: string, points: number) => void;
}

interface GrammarCard {
  id: number;
  itemEmoji: string;
  itemName: string;
  question: string;
  answer: string;
  ownerEmoji: string;
  ownerName: string;
  pronounVersion: string; // "It is his", "They are hers", etc.
  color: string;
  hoverColor: string;
}

const GRAMMAR_CARDS: GrammarCard[] = [
  {
    id: 1,
    itemEmoji: '🎫',
    itemName: 'Seat A27',
    question: "Whose seat is this?",
    answer: "It’s Tom’s.",
    ownerEmoji: '👨‍🦰',
    ownerName: 'Tom',
    pronounVersion: "It’s his.",
    color: 'bg-neo-yellow/10 border-neo-yellow text-black',
    hoverColor: 'hover:bg-neo-yellow/20'
  },
  {
    id: 2,
    itemEmoji: '🧼',
    itemName: 'Towel',
    question: "Whose towel is this?",
    answer: "It’s Anna’s.",
    ownerEmoji: '🏊‍♀️',
    ownerName: 'Anna',
    pronounVersion: "It’s hers.",
    color: 'bg-neo-green/10 border-neo-green text-black',
    hoverColor: 'hover:bg-neo-green/20'
  },
  {
    id: 3,
    itemEmoji: '🎒',
    itemName: 'Bag',
    question: "Whose bag is this?",
    answer: "It’s Sue’s.",
    ownerEmoji: '👧',
    ownerName: 'Sue',
    pronounVersion: "It’s hers.",
    color: 'bg-neo-coral/10 border-neo-coral text-black',
    hoverColor: 'hover:bg-neo-coral/20'
  },
  {
    id: 4,
    itemEmoji: '👟',
    itemName: 'Shoes',
    question: "Whose shoes are these?",
    answer: "They’re Martin’s.",
    ownerEmoji: '👦',
    ownerName: 'Martin',
    pronounVersion: "They’re his.",
    color: 'bg-purple-50 border-purple-500 text-black',
    hoverColor: 'hover:bg-purple-100'
  }
];

export default function GrammarPracticeSlide({ students, onReward }: GrammarProps) {
  const [revealedCardIds, setRevealedCardIds] = useState<number[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [scoreGranted, setScoreGranted] = useState<boolean>(false);

  const toggleReveal = (id: number) => {
    if (revealedCardIds.includes(id)) {
      setRevealedCardIds(prev => prev.filter(cId => cId !== id));
    } else {
      audio.playSuccess();
      setRevealedCardIds(prev => [...prev, id]);
    }
  };

  const speakPhrase = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    audio.playTick();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const handleRewardStudent = () => {
    if (!selectedStudentId) return;
    audio.playSuccess();
    onReward(selectedStudentId, 10);
    const stud = students.find(s => s.id === selectedStudentId);
    alert(`⭐ Correct speaking reward! +10 Points awarded to ${stud?.name}! 🏊‍♂️`);
    setSelectedStudentId('');
  };

  const resetAllCards = () => {
    audio.playTick();
    setRevealedCardIds([]);
  };

  return (
    <div id="grammar-practice-slide" className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
      
      {/* LEFT COLUMN: VISUAL CARDS BOARD */}
      <div className="lg:col-span-9 flex flex-col justify-between bg-stone-50 border-4 border-black p-4 shadow-neo">
        
        <div className="w-full flex items-center justify-between mb-4 pb-2 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👀</span>
            <div>
              <h3 className="font-display font-black text-black text-sm uppercase tracking-tight italic">
                3 – Grammar Practice: Look and Say!
              </h3>
            </div>
          </div>

          <button
            onClick={resetAllCards}
            className="p-1 px-2.5 bg-black text-white hover:bg-neo-coral border-2 border-black text-[9px] font-mono font-black uppercase inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={10} /> Reset Cards
          </button>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          {GRAMMAR_CARDS.map((card) => {
            const isRevealed = revealedCardIds.includes(card.id);
            return (
              <div
                key={card.id}
                onClick={() => toggleReveal(card.id)}
                className={`border-4 border-black p-4 min-h-[190px] cursor-pointer transition-all duration-250 relative select-none flex flex-col justify-between ${card.color} ${card.hoverColor} ${
                  isRevealed ? 'shadow-neo-sm translate-y-0.5' : 'shadow-neo'
                }`}
              >
                {/* Card Top: Emojis & Item info */}
                <div className="flex items-start justify-between border-b border-black/10 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">{card.itemEmoji}</span>
                    <div>
                      <h4 className="font-display font-black text-xs uppercase tracking-tight text-black">{card.itemName}</h4>
                      <span className="text-[8px] font-mono text-stone-500 font-bold uppercase leading-none">GRAMMAR CARD {card.id}</span>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-black text-black/60 bg-white/50 border border-black px-1.5 leading-none py-0.5 uppercase">
                    Whose?
                  </span>
                </div>

                {/* Card Question */}
                <div className="my-2 text-left">
                  <span className="text-[8px] font-mono font-black text-neo-coral block uppercase mb-1 leading-none">QUESTION</span>
                  <div className="flex items-center justify-between">
                    <p className="font-display font-black text-sm md:text-base text-black tracking-tight leading-none">
                      {card.question}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakPhrase(card.question);
                      }}
                      className="p-1 bg-white hover:bg-neo-yellow border border-black rounded-none cursor-pointer text-black"
                      title="Pronounce Question"
                    >
                      <Volume2 size={11} />
                    </button>
                  </div>
                </div>

                {/* Card Answer (Flippable / Revealable) */}
                <div className="mt-2 text-left pt-2 border-t border-dashed border-black/15">
                  <span className="text-[8px] font-mono font-black text-neo-green block uppercase mb-1 leading-none">ANSWER</span>
                  
                  {isRevealed ? (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="font-display font-black text-base md:text-lg text-black tracking-tight leading-none inline-flex items-center gap-1.5">
                          <CheckCircle2 size={16} className="text-[#16a34a] stroke-[3]" />
                          {card.answer}
                        </p>
                        
                        {/* Pronoun explanation version */}
                        <p className="text-[9px] font-bold text-stone-500 mt-1 italic">
                          Pronoun style: <span className="font-mono font-black text-black not-italic bg-white border border-black px-1 text-[10px]">{card.pronounVersion}</span>
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakPhrase(`${card.answer} Or, ${card.pronounVersion}`);
                        }}
                        className="p-1 bg-white hover:bg-neo-yellow border border-black rounded-none cursor-pointer text-black"
                        title="Pronounce Answer"
                      >
                        <Volume2 size={11} />
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex items-center justify-center py-2 bg-white/40 border-2 border-dashed border-black/20 text-stone-500 hover:text-black">
                      <span className="text-[10px] font-mono font-black uppercase tracking-wider">
                        ❓ Tap Card to Reveal Answer
                      </span>
                    </div>
                  )}
                </div>

                {/* Micro Owner Banner inside Card when revealed */}
                {isRevealed && (
                  <span className="absolute top-1.5 right-1.5 bg-black text-white text-[8px] font-mono font-black px-1.5 py-0.5 border border-black flex items-center gap-1">
                    <span>{card.ownerEmoji}</span>
                    <span>{card.ownerName.toUpperCase()}'S</span>
                  </span>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* RIGHT COLUMN: REWARD SYSTEM */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        
        {/* REWARD CARD */}
        <div className="bg-white border-4 border-black p-4 shadow-neo text-left">
          <span className="text-[9px] font-mono font-black uppercase text-stone-500 border border-black px-2 py-0.5 bg-neo-yellow/20 inline-block mb-2">
            REWARDS
          </span>
          <h3 className="font-display font-black text-base uppercase italic leading-none mb-3 text-black">
            🏆 Award Stars
          </h3>

          <div className="space-y-3">
            <div>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-white border-2 border-black p-1.5 font-mono text-xs font-black uppercase text-black cursor-pointer"
              >
                <option value="">-- Choose Student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.emoji} {s.name} ({s.points} pts)</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRewardStudent}
              disabled={!selectedStudentId}
              className={`w-full py-3 border-2 border-black font-black text-xs uppercase tracking-wider transition ${
                selectedStudentId 
                  ? 'bg-neo-yellow text-black hover:-translate-y-0.5 hover:shadow-neo-sm cursor-pointer' 
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
            >
              Reward +10 Stars! ⭐
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
