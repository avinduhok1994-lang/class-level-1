import React, { useState } from 'react';
import { Student } from '../types';
import { audio } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, RotateCcw, Volume2, HelpCircle, User, Users } from 'lucide-react';

interface SpeakProps {
  students: Student[];
  onReward: (studentId: string, points: number) => void;
}

interface PoolItem {
  id: string;
  name: string;
  emoji: string;
  ownerName: 'Martin' | 'Tom' | 'Anna' | 'Sue';
  ownerEmoji: string;
  possessiveText: string; // "Martin's"
  possessivePronoun: string; // "his", "hers", "mine", "yours"
  singular: boolean; // true for is, false for are
  color: string;
  shadowColor: string;
}

const POOL_ITEMS: PoolItem[] = [
  { id: 'cap', name: 'Cap', emoji: '🧢', ownerName: 'Martin', ownerEmoji: '👦', possessiveText: "Martin's", possessivePronoun: 'his', singular: true, color: 'bg-neo-blue/15 border-neo-blue', shadowColor: 'rgba(77,150,255,1)' },
  { id: 'seat', name: 'Ticket / Seat', emoji: '🎫', ownerName: 'Tom', ownerEmoji: '👨‍🦰', possessiveText: "Tom's", possessivePronoun: 'his', singular: true, color: 'bg-neo-yellow/15 border-neo-yellow', shadowColor: 'rgba(255,213,0,1)' },
  { id: 'towel', name: 'Towel', emoji: '🧼', ownerName: 'Anna', ownerEmoji: '🏊‍♀️', possessiveText: "Anna's", possessivePronoun: 'hers', singular: true, color: 'bg-neo-green/15 border-neo-green', shadowColor: 'rgba(0,255,0,1)' },
  { id: 'bag', name: 'Bag', emoji: '🎒', ownerName: 'Sue', ownerEmoji: '👧', possessiveText: "Sue's", possessivePronoun: 'hers', singular: true, color: 'bg-neo-coral/15 border-neo-coral', shadowColor: 'rgba(255,107,107,1)' },
  { id: 'shoes', name: 'Shoes', emoji: '👟', ownerName: 'Martin', ownerEmoji: '👦', possessiveText: "Martin's", possessivePronoun: 'his', singular: false, color: 'bg-purple-100 border-purple-500', shadowColor: 'rgba(147,51,234,1)' },
];

export default function SpeakSlide({ students, onReward }: SpeakProps) {
  const [selectedItem, setSelectedItem] = useState<PoolItem | null>(null);
  const [pair, setPair] = useState<{ speakerA: Student; speakerB: Student } | null>(null);
  const [revealedPart, setRevealedPart] = useState<'NONE' | 'QUESTION' | 'ANSWER'>('NONE');

  // Trigger TTS to say the phrase
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    audio.playTick();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  // Roll standard pair of speakers
  const handleRollPair = () => {
    if (students.length < 2) return;
    audio.playDrumroll(1);

    // Pick 2 random unique students
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    const speakerA = shuffled[0];
    const speakerB = shuffled[1];

    setPair({ speakerA, speakerB });
    setTimeout(() => {
      audio.playSuccess();
    }, 800);
  };

  const handleSelectItem = (item: PoolItem) => {
    audio.playTick();
    setSelectedItem(item);
    setRevealedPart('NONE');
  };

  const handleRewardPair = (points: number) => {
    if (!pair) return;
    audio.playSuccess();
    onReward(pair.speakerA.id, points);
    onReward(pair.speakerB.id, points);
    alert(`🎉 Awesome! +${points} Stars rewarded to both ${pair.speakerA.name} and ${pair.speakerB.name}! 🌟`);
    setPair(null);
  };

  return (
    <div id="speak-slide" className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
      
      {/* LEFT COLUMN: POOL ITEMS SELECTOR */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        
        {/* POINT & SELECT CONTAINER */}
        <div className="bg-white border-4 border-black p-4 shadow-neo text-left">
          <span className="text-[9px] font-mono font-black uppercase text-stone-500 border border-black px-2 py-0.5 bg-neo-yellow/20 inline-block mb-1.5">
            2 – POINT & ASK
          </span>
          <h2 className="font-display font-black text-xl text-black leading-tight uppercase italic mb-4">
            🏊‍♂️ Pool Items Board
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {POOL_ITEMS.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  style={{ boxShadow: isSelected ? 'none' : `4px 4px 0px 0px ${item.shadowColor}` }}
                  className={`p-3.5 border-4 border-black transition flex flex-col items-center justify-center text-center cursor-pointer relative select-none ${item.color} ${
                    isSelected ? 'translate-x-[2px] translate-y-[2px] bg-black text-white border-black' : 'text-black'
                  }`}
                >
                  <span className="text-4xl filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)] leading-none mb-2">
                    {item.emoji}
                  </span>
                  <span className="font-display text-sm font-black uppercase tracking-wide leading-none">
                    {item.name}
                  </span>
                  
                  {isSelected && (
                    <span className="absolute top-1.5 right-1.5 bg-neo-green text-black border border-black text-[7px] font-mono font-black px-1">
                      SELECTED
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* SPEAKING PAIR PICKER */}
        <div className="bg-white border-4 border-black p-4 shadow-neo text-left">
          <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
            <h3 className="font-display font-black text-sm uppercase italic flex items-center gap-1.5 text-black">
              <Users size={15} /> Speaking Partners
            </h3>
            <button
              onClick={handleRollPair}
              className="px-2.5 py-1 bg-neo-yellow hover:bg-[#ffe033] border-2 border-black text-[9px] font-mono font-black uppercase tracking-wider transition shadow-neo-sm cursor-pointer"
            >
              🎲 Roll Partners!
            </button>
          </div>

          {!pair ? (
            <div className="flex flex-col items-center justify-center py-6 text-center opacity-75">
              <span className="text-3xl mb-1.5">🗣️</span>
              <p className="text-xs font-black uppercase text-black">Pair Picker Ready</p>
            </div>
          ) : (
            <div className="bg-neo-blue/5 border-2 border-black p-3 shadow-neo-sm flex flex-col justify-between">
              <div className="grid grid-cols-2 gap-3 mb-3">
                
                {/* Speaker A */}
                <div className="bg-white border-2 border-black p-2 text-center shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)]">
                  <span className="text-[7px] font-mono font-black bg-neo-coral text-white border border-black px-1.5 uppercase block mx-auto mb-1 w-max">
                    SPEAKER A (ASK)
                  </span>
                  <span className="text-2xl block">{pair.speakerA.emoji}</span>
                  <span className="font-display text-xs font-black uppercase text-black block tracking-tight">
                    {pair.speakerA.name}
                  </span>
                </div>

                {/* Speaker B */}
                <div className="bg-white border-2 border-black p-2 text-center shadow-[2.5px_2.5px_0px_rgba(0,0,0,1)]">
                  <span className="text-[7px] font-mono font-black bg-neo-green text-black border border-black px-1.5 uppercase block mx-auto mb-1 w-max">
                    SPEAKER B (ANSWER)
                  </span>
                  <span className="text-2xl block">{pair.speakerB.emoji}</span>
                  <span className="font-display text-xs font-black uppercase text-black block tracking-tight">
                    {pair.speakerB.name}
                  </span>
                </div>

              </div>

              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => handleRewardPair(15)}
                  className="flex-1 py-1.5 bg-neo-green hover:bg-[#33ff33] text-black border-2 border-black font-mono font-black text-[9px] uppercase tracking-wider transition shadow-neo-sm cursor-pointer"
                >
                  ⭐ Great (+15 Stars)
                </button>
                <button
                  onClick={() => setPair(null)}
                  className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-500 border-2 border-black font-mono font-black text-[9px] uppercase transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: SCAFFOLDING & QUESTIONS REVEAL */}
      <div className="lg:col-span-6 bg-stone-50 border-4 border-black p-4 shadow-neo flex flex-col justify-between overflow-hidden">
        
        {selectedItem ? (
          <div className="flex flex-col h-full justify-between text-left">
            <div>
              {/* Active Selection Info */}
              <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedItem.emoji}</span>
                  <div>
                    <h3 className="font-display font-black text-black text-base uppercase tracking-tight leading-none">
                      Whose {selectedItem.name}?
                    </h3>
                    <span className="text-[8px] font-mono font-black text-stone-500 uppercase tracking-widest mt-1 block">
                      OWNER: {selectedItem.ownerName} {selectedItem.ownerEmoji}
                    </span>
                  </div>
                </div>

                <span className="text-[9px] font-mono font-black bg-black text-white px-2 py-0.5 uppercase tracking-wide">
                  {selectedItem.singular ? 'SINGULAR SUBJECT' : 'PLURAL SUBJECT'}
                </span>
              </div>

              {/* INTERACTIVE SPEECH SCAFFOLDING */}
              <div className="space-y-4">
                
                {/* QUESTION SCAFFOLD */}
                <div className="bg-white border-2 border-black p-3 shadow-neo-sm relative">
                  <span className="text-[8px] font-mono font-black bg-neo-coral text-white border border-black px-1.5 py-0.5 uppercase tracking-wide absolute -top-2.5 left-3">
                    SPEAKER A ASKS
                  </span>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="font-display font-black text-base md:text-lg text-black tracking-tight leading-normal">
                      Whose <span className="text-neo-coral">{selectedItem.name.toLowerCase()}</span> {selectedItem.singular ? 'is this' : 'are these'}?
                    </p>
                    <button
                      onClick={() => speakText(`Whose ${selectedItem.name.toLowerCase()} ${selectedItem.singular ? 'is this' : 'are these'}?`)}
                      className="p-1 text-black bg-stone-50 hover:bg-neo-yellow border border-black cursor-pointer"
                      title="Pronounce Question"
                    >
                      <Volume2 size={13} />
                    </button>
                  </div>
                </div>

                {/* ANSWER SCAFFOLD */}
                <div className="bg-white border-2 border-black p-3 shadow-neo-sm relative">
                  <span className="text-[8px] font-mono font-black bg-neo-green text-black border border-black px-1.5 py-0.5 uppercase tracking-wide absolute -top-2.5 left-3">
                    SPEAKER B ANSWERS
                  </span>

                  <div className="flex flex-col gap-2 mt-1">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-display text-base md:text-lg text-black font-black">
                          {selectedItem.singular ? "It’s" : "They’re"}
                        </span>
                        
                        {revealedPart === 'ANSWER' ? (
                          <motion.span 
                            initial={{ scale: 0.8, rotate: -5 }}
                            animate={{ scale: 1, rotate: 0 }}
                            className="inline-block bg-neo-yellow border-2 border-black px-2.5 py-0.5 text-black font-display text-base md:text-lg font-black italic shadow-neo-sm"
                          >
                            {selectedItem.possessiveText}.
                          </motion.span>
                        ) : (
                          <button
                            onClick={() => { audio.playSuccess(); setRevealedPart('ANSWER'); }}
                            className="bg-stone-100 hover:bg-neo-yellow text-stone-500 hover:text-black border-2 border-dashed border-black px-3 py-0.5 text-xs font-mono font-black uppercase tracking-wider cursor-pointer"
                          >
                            ❓ Reveal Owner
                          </button>
                        )}
                      </div>

                      {revealedPart === 'ANSWER' && (
                        <button
                          onClick={() => speakText(`${selectedItem.singular ? "It’s" : "They’re"} ${selectedItem.possessiveText}.`)}
                          className="p-1 text-black bg-stone-50 hover:bg-neo-yellow border border-black cursor-pointer"
                          title="Pronounce Answer"
                        >
                          <Volume2 size={13} />
                        </button>
                      )}
                    </div>

                    {/* PRONOUN OPTION HINT */}
                    {revealedPart === 'ANSWER' && (
                      <div className="mt-2.5 pt-2 border-t border-dashed border-black/10 flex items-center justify-between text-stone-600">
                        <p className="text-[10px] font-bold">
                          💡 Pronoun style: <span className="font-mono font-black text-black text-[10px] bg-purple-50 px-1 py-0.5 border border-black ml-1 inline-block">
                            {selectedItem.singular ? "It’s" : "They’re"} {selectedItem.possessivePronoun === 'his' ? "his" : "hers"}.
                          </span>
                        </p>
                        <button
                          onClick={() => speakText(`Or, ${selectedItem.singular ? "it is" : "they are"} ${selectedItem.possessivePronoun === 'his' ? "his" : "hers"}`)}
                          className="p-1 text-black bg-stone-50 hover:bg-purple-100 border border-black cursor-pointer"
                        >
                          <Volume2 size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center h-full">
            <span className="text-5xl mb-3 animate-float">🏊‍♂️</span>
            <h3 className="font-display font-black text-black text-lg uppercase">Select Pool Item</h3>
            <p className="text-xs text-stone-600 font-bold max-w-xs mt-1.5 leading-relaxed">
              Click an item on the left to start!
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
