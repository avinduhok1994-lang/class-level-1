import React, { useState } from 'react';
import { Student } from '../types';
import { audio } from '../utils/audio';
import { Sparkles, Check, X, ShieldAlert, Award, HelpCircle } from 'lucide-react';

interface QuizSlideProps {
  students: Student[];
}

const LESSON_QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: '"Excuse me, whose seat is this?" -> "It is ______."',
    options: ["mine", "my", "me", "I"],
    correctIndex: 0,
    explanation: "We use 'mine' as a possessive pronoun to mean 'my seat'. It replaces the noun seat so we don't repeat it!",
    emojiHint: "🎟️"
  },
  {
    id: 'q2',
    question: '"I am sorry. It isn\'t yours. It is ______."',
    options: ["yours", "mine", "my", "me"],
    correctIndex: 1,
    explanation: "Tom says: 'It isn't yours (Martin's). It is mine (Tom's).' Both are possessive pronouns showing ownership.",
    emojiHint: "🏊‍♂️"
  },
  {
    id: 'q3',
    question: '"Martin! Are these ______ seats?"',
    options: ["ours", "our", "us", "we"],
    correctIndex: 1,
    explanation: "We use the possessive adjective 'our' followed by the noun 'seats' to show they are sitting together.",
    emojiHint: "👥"
  },
  {
    id: 'q4',
    question: '"Come on, Martin, let’s move. It is ______ seat."',
    options: ["Toms", "Tom", "Tom's", "Toms'"],
    correctIndex: 2,
    explanation: "To show that a seat belongs to Tom, we add an apostrophe and s (’s) to his name: Tom’s.",
    emojiHint: "👨‍🦰"
  },
  {
    id: 'q5',
    question: '"Whose shoes ______ these?" -> "They’re Martin’s."',
    options: ["is", "are", "do", "does"],
    correctIndex: 1,
    explanation: "Shoes are plural, so we must ask: 'Whose shoes ARE these?' and answer with 'They’re Martin’s.'",
    emojiHint: "👟"
  }
];

export default function QuizSlide({ students }: QuizSlideProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  // Teams point state (local to quiz activity slide)
  const [redPoints, setRedPoints] = useState(0);
  const [bluePoints, setBluePoints] = useState(0);

  // Automatically split students into Red & Blue teams
  const redTeam = students.slice(0, Math.ceil(students.length / 2));
  const blueTeam = students.slice(Math.ceil(students.length / 2));

  const question = LESSON_QUIZ_QUESTIONS[currentIdx];

  const handleOptionClick = (idx: number) => {
    setSelectedOption(idx);
    setShowAnswer(true);
    if (idx === question.correctIndex) {
      audio.playSuccess();
    } else {
      audio.playIncorrect();
    }
  };

  const nextQuestion = () => {
    audio.playTick();
    setSelectedOption(null);
    setShowAnswer(false);
    setCurrentIdx((prev) => (prev + 1) % LESSON_QUIZ_QUESTIONS.length);
  };

  return (
    <div id="quiz-slide-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
      
      {/* Left Columns: Classroom Team division scoreboards */}
      <div className="lg:col-span-4 flex flex-col gap-3">
        
        {/* Teams Dashboard */}
        <div className="bg-white border-4 border-black p-3.5 shadow-neo flex-1 flex flex-col justify-between">
          <div>
            <div className="border-b-2 border-black pb-1.5 mb-2.5">
              <h3 className="font-mono text-xs uppercase tracking-widest text-black font-black flex items-center gap-1.5">
                📊 TEAM QUIZ SCORE BOARD
              </h3>
            </div>

            {/* Red Team Area */}
            <div className="bg-white border-2 border-black p-2.5 shadow-neo-sm mb-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-neo-coral font-mono">🔴 RED DRAGONS</span>
                <span className="text-base font-mono font-black text-black bg-neo-coral/10 border border-black px-1.5">{redPoints} PTS</span>
              </div>
              
              {/* quick avatars limit display */}
              <div className="grid grid-cols-4 gap-1 max-h-[85px] overflow-y-auto pr-0.5">
                {redTeam.slice(0, 8).map((student) => (
                  <div key={student.id} className="bg-white border border-black p-0.5 text-center text-[10px] font-black truncate">
                    <span className="text-sm">{student.emoji}</span>
                    <p className="text-[7px] text-black/80 truncate mt-0.5 uppercase tracking-tight">{student.name}</p>
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="flex gap-1 mt-2">
                <button
                  onClick={() => {
                    audio.playSuccess();
                    setRedPoints(prev => prev + 5);
                  }}
                  className="flex-1 py-1 bg-neo-yellow text-black border-2 border-black font-black text-[9px] uppercase shadow-neo-sm hover:translate-y-[0.5px] hover:shadow-none transition-all duration-75 cursor-pointer"
                >
                  +5 PTS
                </button>
                <button
                  onClick={() => {
                    audio.playSuccess();
                    setRedPoints(prev => prev + 10);
                  }}
                  className="flex-1 py-1 bg-neo-coral text-white border-2 border-black font-black text-[9px] uppercase shadow-neo-sm hover:translate-y-[0.5px] hover:shadow-none transition-all duration-75 cursor-pointer"
                >
                  +10 PTS
                </button>
              </div>
            </div>

            {/* Blue Team Area */}
            <div className="bg-white border-2 border-black p-2.5 shadow-neo-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-black text-neo-blue font-mono">🔵 BLUE FALCONS</span>
                <span className="text-base font-mono font-black text-black bg-neo-blue/10 border border-black px-1.5">{bluePoints} PTS</span>
              </div>
              
              {/* quick avatars limit display */}
              <div className="grid grid-cols-4 gap-1 max-h-[85px] overflow-y-auto pr-0.5">
                {blueTeam.slice(0, 8).map((student) => (
                  <div key={student.id} className="bg-white border border-black p-0.5 text-center text-[10px] font-black truncate">
                    <span className="text-sm">{student.emoji}</span>
                    <p className="text-[7px] text-black/80 truncate mt-0.5 uppercase tracking-tight">{student.name}</p>
                  </div>
                ))}
              </div>

              {/* Action */}
              <div className="flex gap-1 mt-2">
                <button
                  onClick={() => {
                    audio.playSuccess();
                    setBluePoints(prev => prev + 5);
                  }}
                  className="flex-1 py-1 bg-neo-yellow text-black border-2 border-black font-black text-[9px] uppercase shadow-neo-sm hover:translate-y-[0.5px] hover:shadow-none transition-all duration-75 cursor-pointer"
                >
                  +5 PTS
                </button>
                <button
                  onClick={() => {
                    audio.playSuccess();
                    setBluePoints(prev => prev + 10);
                  }}
                  className="flex-1 py-1 bg-neo-blue text-white border-2 border-black font-black text-[9px] uppercase shadow-neo-sm hover:translate-y-[0.5px] hover:shadow-none transition-all duration-75 cursor-pointer"
                >
                  +10 PTS
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Right Column: Quiz questions card */}
      <div className="lg:col-span-8 flex flex-col gap-3">
        
        {/* Challenge Box */}
        <div className="bg-white border-4 border-black p-4 shadow-neo flex-1 flex flex-col justify-between">
          <div>
            
            {/* Index label */}
            <div className="flex items-center justify-between mb-2.5 border-b-2 border-black pb-2">
              <span className="bg-neo-blue text-white font-mono text-[10px] font-black px-2.5 py-1 border-2 border-black shadow-neo-sm uppercase">
                QUESTION {currentIdx + 1} OF {LESSON_QUIZ_QUESTIONS.length}
              </span>
              <span className="text-2xl animate-bounce">{question.emojiHint}</span>
            </div>

            {/* Question title */}
            <h3 className="font-display text-lg font-black text-black leading-snug my-2 uppercase tracking-normal italic text-left">
              {question.question}
            </h3>

            {/* Options layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              {question.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === question.correctIndex;
                
                let btnStyle = 'border-2 border-black bg-white hover:bg-slate-50 text-black font-black shadow-neo-sm';
                
                if (showAnswer) {
                  if (isCorrect) {
                     btnStyle = 'border-4 border-black bg-[#00FF00] text-black font-black scale-[1.01] shadow-neo-sm';
                  } else if (isSelected) {
                     btnStyle = 'border-4 border-black bg-neo-coral text-white font-black line-through';
                  } else {
                     btnStyle = 'border-2 border-black bg-slate-100 text-stone-400 opacity-60 shadow-none';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !showAnswer && handleOptionClick(idx)}
                    disabled={showAnswer}
                    className={`p-2.5 text-left font-display font-black text-sm transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span className="uppercase">{option}</span>
                    {showAnswer && isCorrect && <Check size={16} className="text-black stroke-[3.5] shrink-0" />}
                    {showAnswer && isSelected && !isCorrect && <X size={16} className="text-white stroke-[3.5] shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation */}
            {showAnswer && (
              <p className="mt-3 text-xs font-bold text-[#16a34a] text-left">
                ✔ {question.explanation}
              </p>
            )}

          </div>

          {/* Action Footer */}
          <div className="flex justify-end mt-3">
            <button
              onClick={nextQuestion}
              className="px-4 py-2 bg-neo-green hover:bg-[#00dd00] text-black font-black border-4 border-black shadow-neo hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-none uppercase text-xs tracking-wider inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              Next Question ➔
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
