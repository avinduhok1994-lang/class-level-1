import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { audio } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Gamepad2, RefreshCw, CheckCircle2, Trophy, HelpCircle, Award } from 'lucide-react';

interface GameProps {
  students: Student[];
  onReward: (studentId: string, points: number) => void;
}

// "Whose is it?" Game interfaces
interface GuessQuestion {
  id: number;
  itemEmoji: string;
  itemName: string;
  question: string;
  correctAnswer: string; // "Sue"
  options: string[]; // ["Martin", "Sue", "Tom", "Anna"]
  singular: boolean;
}

const GUESS_QUESTIONS: GuessQuestion[] = [
  { id: 1, itemEmoji: '🎒', itemName: 'bag', question: "Whose bag is this?", correctAnswer: "Sue", options: ["Martin", "Sue", "Tom", "Anna"], singular: true },
  { id: 2, itemEmoji: '🎫', itemName: 'seat ticket', question: "Whose seat ticket is this?", correctAnswer: "Tom", options: ["Martin", "Sue", "Tom", "Anna"], singular: true },
  { id: 3, itemEmoji: '🧼', itemName: 'towel', question: "Whose towel is this?", correctAnswer: "Anna", options: ["Martin", "Sue", "Tom", "Anna"], singular: true },
  { id: 4, itemEmoji: '🧢', itemName: 'cap', question: "Whose cap is this?", correctAnswer: "Martin", options: ["Martin", "Sue", "Tom", "Anna"], singular: true },
  { id: 5, itemEmoji: '👟', itemName: 'shoes', question: "Whose shoes are these?", correctAnswer: "Martin", options: ["Martin", "Sue", "Tom", "Anna"], singular: false }
];

// Memory Match cards interfaces
interface MemoryCard {
  id: string;
  type: 'OWNER' | 'ITEM';
  value: string; // Character name or Item name
  matchValue: string; // The corresponding pair identifier (e.g. "Martin" for "Martin" or "Cap")
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const INITIAL_MEMORY_CARDS: MemoryCard[] = [
  { id: 'o-martin', type: 'OWNER', value: 'Martin', matchValue: 'martin-pair', emoji: '👦 Martin', isFlipped: false, isMatched: false },
  { id: 'i-cap', type: 'ITEM', value: 'Cap', matchValue: 'martin-pair', emoji: '🧢 Cap', isFlipped: false, isMatched: false },
  
  { id: 'o-sue', type: 'OWNER', value: 'Sue', matchValue: 'sue-pair', emoji: '👧 Sue', isFlipped: false, isMatched: false },
  { id: 'i-bag', type: 'ITEM', value: 'Bag', matchValue: 'sue-pair', emoji: '🎒 Bag', isFlipped: false, isMatched: false },
  
  { id: 'o-tom', type: 'OWNER', value: 'Tom', matchValue: 'tom-pair', emoji: '👨‍🦰 Tom', isFlipped: false, isMatched: false },
  { id: 'i-ticket', type: 'ITEM', value: 'Ticket', matchValue: 'tom-pair', emoji: '🎫 Ticket', isFlipped: false, isMatched: false },
  
  { id: 'o-anna', type: 'OWNER', value: 'Anna', matchValue: 'anna-pair', emoji: '🏊‍♀️ Anna', isFlipped: false, isMatched: false },
  { id: 'i-towel', type: 'ITEM', value: 'Towel', matchValue: 'anna-pair', emoji: '🧼 Towel', isFlipped: false, isMatched: false }
];

export default function GameSlide({ students, onReward }: GameProps) {
  const [activeGame, setActiveGame] = useState<'GUESS' | 'MEMORY'>('GUESS');
  const [rewardStudentId, setRewardStudentId] = useState<string>('');

  // -----------------------------------------------------------------
  // GAME 1: "WHOSE IS IT?" GUESSING CHALLENGE STATE
  // -----------------------------------------------------------------
  const [guessIdx, setGuessIdx] = useState(0);
  const [selectedGuessOption, setSelectedGuessOption] = useState<string | null>(null);
  const [guessAnswerChecked, setGuessAnswerChecked] = useState<boolean>(false);
  const [guessIsCorrect, setGuessIsCorrect] = useState<boolean | null>(null);

  const currentGuessQuestion = GUESS_QUESTIONS[guessIdx];

  const handleGuessOptionClick = (option: string) => {
    if (guessAnswerChecked) return;
    audio.playTick();
    setSelectedGuessOption(option);
  };

  const checkGuessAnswer = () => {
    if (!selectedGuessOption) return;
    
    const isCorrect = selectedGuessOption === currentGuessQuestion.correctAnswer;
    setGuessAnswerChecked(true);
    setGuessIsCorrect(isCorrect);

    if (isCorrect) {
      audio.playSuccess();
      if (rewardStudentId) {
        onReward(rewardStudentId, 15);
        const stud = students.find(s => s.id === rewardStudentId);
        alert(`⭐ Correct! +15 Stars awarded to ${stud?.name}! 🏊‍♂️`);
      }
    } else {
      audio.playIncorrect();
      alert(`❌ Oops! It is not ${selectedGuessOption}'s. Try again!`);
    }
  };

  const handleNextGuess = () => {
    audio.playTick();
    setSelectedGuessOption(null);
    setGuessAnswerChecked(false);
    setGuessIsCorrect(null);
    setRewardStudentId('');
    if (guessIdx < GUESS_QUESTIONS.length - 1) {
      setGuessIdx(prev => prev + 1);
    } else {
      // Completed all questions
      setGuessIdx(0);
      alert("🏆 Awesome! You completed all the Whose Is It questions!");
    }
  };

  // -----------------------------------------------------------------
  // GAME 2: MEMORY MATCH STATE
  // -----------------------------------------------------------------
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);
  const [matchCount, setMatchCount] = useState(0);

  // Initialize and shuffle Memory Match board
  const resetMemoryGame = () => {
    audio.playTick();
    const shuffled = INITIAL_MEMORY_CARDS.map(c => ({
      ...c,
      isFlipped: false,
      isMatched: false
    })).sort(() => Math.random() - 0.5);
    
    setMemoryCards(shuffled);
    setSelectedCardIds([]);
    setMatchCount(0);
    setRewardStudentId('');
  };

  useEffect(() => {
    resetMemoryGame();
  }, []);

  const handleCardClick = (card: MemoryCard) => {
    // Ignore clicked if already flipped, matched, or if 2 cards are currently selected
    if (card.isFlipped || card.isMatched || selectedCardIds.length >= 2) return;
    
    audio.playTick();
    
    // Flip card
    const updatedCards = memoryCards.map(c => 
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setMemoryCards(updatedCards);

    const newSelectedIds = [...selectedCardIds, card.id];
    setSelectedCardIds(newSelectedIds);

    // If we flipped two cards, check for match
    if (newSelectedIds.length === 2) {
      const card1 = memoryCards.find(c => c.id === newSelectedIds[0])!;
      // Note: we must search within the updatedCards state for card2 so we don't look at stale values
      const card2 = updatedCards.find(c => c.id === newSelectedIds[1])!;

      if (card1.matchValue === card2.matchValue) {
        // MATCH!
        setTimeout(() => {
          audio.playSuccess();
          const matchedCards = updatedCards.map(c => 
            c.matchValue === card1.matchValue ? { ...c, isMatched: true } : c
          );
          setMemoryCards(matchedCards);
          setSelectedCardIds([]);
          setMatchCount(prev => {
            const count = prev + 1;
            if (count === 4) {
              audio.playFanfare();
              if (rewardStudentId) {
                onReward(rewardStudentId, 25);
                const stud = students.find(s => s.id === rewardStudentId);
                alert(`🏆 All pairs matched! +25 Stars awarded to ${stud?.name}! 🌟`);
              } else {
                alert("🎉 Memory Match Complete! Spectacular memory skills! 🏊‍♂️");
              }
            }
            return count;
          });
        }, 500);
      } else {
        // NO MATCH, flip back after delay
        setTimeout(() => {
          audio.playIncorrect();
          const resetCards = updatedCards.map(c => 
            c.id === card1.id || c.id === card2.id ? { ...c, isFlipped: false } : c
          );
          setMemoryCards(resetCards);
          setSelectedCardIds([]);
        }, 1200);
      }
    }
  };

  return (
    <div id="game-slide" className="flex flex-col items-center w-full">
      
      {/* SECTOR HEADER */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between border-b-4 border-black pb-3 mb-4 text-left">
        <div className="flex items-center gap-2.5">
          <span className="text-3xl">🎮</span>
          <div>
            <h2 className="font-display font-black text-black text-xl uppercase tracking-tight italic leading-none">
              5 – Interactive Classroom Games
            </h2>
          </div>
        </div>

        {/* CONTROLS TOGGLE TABS */}
        <div className="flex border-2 border-black p-0.5 bg-stone-100 mt-2 sm:mt-0">
          <button
            onClick={() => { audio.playTick(); setActiveGame('GUESS'); }}
            className={`px-3 py-1 font-mono font-black text-[10px] uppercase cursor-pointer transition ${
              activeGame === 'GUESS' ? 'bg-black text-white' : 'hover:bg-slate-200 text-black'
            }`}
          >
            "Whose Is It?" Guesser 🎯
          </button>
          <button
            onClick={() => { audio.playTick(); setActiveGame('MEMORY'); }}
            className={`px-3 py-1 font-mono font-black text-[10px] uppercase cursor-pointer transition ${
              activeGame === 'MEMORY' ? 'bg-black text-white' : 'hover:bg-slate-200 text-black'
            }`}
          >
            Memory Match 🎴
          </button>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-4 text-left">
        
        {/* GAME SCREEN BODY */}
        <div className="lg:col-span-9 bg-stone-50 border-4 border-black p-4 shadow-neo flex flex-col justify-between min-h-[360px]">
          
          <AnimatePresence mode="wait">
            
            {/* GUESS GAME */}
            {activeGame === 'GUESS' && (
              <motion.div
                key="guess"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-black/10 pb-2 mb-4">
                    <span className="text-[9px] font-mono font-black bg-neo-coral text-white border border-black px-2 py-0.5 uppercase tracking-wider">
                      QUESTION {guessIdx + 1} OF {GUESS_QUESTIONS.length}
                    </span>
                    <span className="text-[8px] font-mono text-stone-500 font-bold uppercase">
                      TAP CORRECT OWNER
                    </span>
                  </div>

                  {/* Guess Visual */}
                  <div className="flex flex-col items-center justify-center py-5 bg-white border-2 border-black mb-4 shadow-neo-sm relative overflow-hidden">
                    <span className="text-6xl filter drop-shadow-[4px_4px_0px_rgba(0,0,0,0.15)] animate-bounce leading-none">
                      {currentGuessQuestion.itemEmoji}
                    </span>
                    <h3 className="font-display font-black text-xl md:text-2xl text-black uppercase mt-3 tracking-tight">
                      {currentGuessQuestion.question}
                    </h3>
                  </div>

                  {/* Guess Options Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {currentGuessQuestion.options.map((option) => {
                      const isSelected = selectedGuessOption === option;
                      let optionStyle = 'bg-white text-black hover:bg-stone-100 shadow-neo-sm';

                      if (guessAnswerChecked) {
                        if (option === currentGuessQuestion.correctAnswer) {
                          optionStyle = 'bg-neo-green text-black border-[#16a34a] shadow-none translate-y-0.5';
                        } else if (isSelected) {
                          optionStyle = 'bg-neo-coral text-white border-red-800 shadow-none translate-y-0.5';
                        } else {
                          optionStyle = 'bg-stone-100 text-stone-400 border-stone-200 shadow-none opacity-50';
                        }
                      } else if (isSelected) {
                        optionStyle = 'bg-black text-white border-black translate-y-0.5 shadow-none';
                      }

                      return (
                        <button
                          key={option}
                          disabled={guessAnswerChecked}
                          onClick={() => handleGuessOptionClick(option)}
                          className={`p-3 border-4 border-black font-display text-sm md:text-base font-black uppercase tracking-wide cursor-pointer select-none transition flex items-center justify-center gap-1.5 ${optionStyle}`}
                        >
                          {option === 'Sue' && '👧'}
                          {option === 'Martin' && '👦'}
                          {option === 'Tom' && '👨‍🦰'}
                          {option === 'Anna' && '🏊‍♀️'}
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Guess Game Actions Footer */}
                <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between gap-2">
                  {!guessAnswerChecked ? (
                    <button
                      disabled={!selectedGuessOption}
                      onClick={checkGuessAnswer}
                      className={`px-5 py-2.5 border-2 border-black font-mono font-black text-xs uppercase tracking-wider transition ${
                        selectedGuessOption 
                          ? 'bg-neo-green hover:bg-[#22ee22] text-black shadow-neo-sm hover:translate-y-0.5 hover:shadow-none cursor-pointer' 
                          : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      Lock Answer ✔
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 w-full">
                      <div className="flex-1 font-display font-black text-xs uppercase">
                        {guessIsCorrect ? (
                          <span className="text-[#16a34a] flex items-center gap-1">✔ Perfect! It is {currentGuessQuestion.correctAnswer}'s!</span>
                        ) : (
                          <span className="text-neo-coral">❌ Try again! Correct owner is {currentGuessQuestion.correctAnswer}.</span>
                        )}
                      </div>
                      <button
                        onClick={handleNextGuess}
                        className="px-5 py-2.5 bg-black text-white hover:bg-neo-yellow hover:text-black border-2 border-black font-mono font-black text-xs uppercase tracking-wider transition shadow-neo-sm hover:translate-y-0.5 hover:shadow-none cursor-pointer"
                      >
                        {guessIdx < GUESS_QUESTIONS.length - 1 ? 'Next Question ➔' : 'Complete Game 🏆'}
                      </button>
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {/* MEMORY MATCH GAME */}
            {activeGame === 'MEMORY' && (
              <motion.div
                key="memory"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-black/10 pb-2 mb-3">
                    <span className="text-[9px] font-mono font-black bg-purple-600 text-white border border-black px-2 py-0.5 uppercase tracking-wider">
                      Matches Found: {matchCount} of 4
                    </span>
                    <button
                      onClick={resetMemoryGame}
                      className="px-2 py-0.5 bg-white hover:bg-stone-50 border border-black font-mono font-black text-[9px] uppercase tracking-wide flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={8} /> Reset Memory Board
                    </button>
                  </div>

                  {/* Cards Grid */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {memoryCards.map((card) => {
                      const isFlippedOrMatched = card.isFlipped || card.isMatched;
                      
                      return (
                        <div
                          key={card.id}
                          onClick={() => handleCardClick(card)}
                          className="aspect-square relative perspective-1000 cursor-pointer"
                        >
                          <motion.div
                            animate={{ rotateY: isFlippedOrMatched ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            style={{ transformStyle: 'preserve-3d' }}
                            className="w-full h-full relative"
                          >
                            {/* Card Front (Back of card, showing question mark) */}
                            <div 
                              style={{ backfaceVisibility: 'hidden' }}
                              className="absolute inset-0 border-3 border-black bg-stone-300 flex flex-col items-center justify-center shadow-neo-sm"
                            >
                              <HelpCircle size={18} className="text-stone-500 stroke-[3]" />
                              <span className="text-[6px] font-mono font-black uppercase text-stone-500 mt-1">SWIMMER</span>
                            </div>

                            {/* Card Back (Active flipped value) */}
                            <div
                              style={{ 
                                backfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)'
                              }}
                              className={`absolute inset-0 border-3 border-black flex flex-col items-center justify-center p-1 text-center shadow-none bg-white ${
                                card.isMatched 
                                  ? 'bg-neo-green/10 border-neo-green' 
                                  : 'border-black'
                              }`}
                            >
                              <span className="text-xl filter drop-shadow-[1.5px_1.5px_0px_rgba(0,0,0,0.1)] leading-none mb-1">
                                {card.emoji.split(' ')[0]}
                              </span>
                              <span className="font-display font-black text-[8px] sm:text-[10px] leading-none uppercase tracking-wide text-black block truncate max-w-full">
                                {card.value}
                              </span>
                              
                              {card.isMatched && (
                                <span className="absolute top-0.5 right-0.5 bg-[#16a34a] text-white border border-black p-0.5 text-[5px] rounded-none">
                                  ✔
                                </span>
                              )}
                            </div>

                          </motion.div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* REWARD CARD COUPLER */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          
          {/* ASSIGNED POINT REWARD */}
          <div className="bg-white border-4 border-black p-4 shadow-neo text-left">
            <span className="text-[9px] font-mono font-black uppercase text-stone-500 border border-black px-2 py-0.5 bg-neo-yellow/20 inline-block mb-2">
              REWARDS
            </span>
            <h3 className="font-display font-black text-sm uppercase italic leading-none mb-3 text-black">
              🏆 Game Stars
            </h3>

            <div className="space-y-3">
              <div>
                <select
                  value={rewardStudentId}
                  onChange={(e) => setRewardStudentId(e.target.value)}
                  className="w-full bg-white border-2 border-black p-1.5 font-mono text-xs font-black uppercase text-black cursor-pointer"
                >
                  <option value="">-- Choose Contestant --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.emoji} {s.name} ({s.points} pts)</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
