import React, { useState, useEffect, useRef } from 'react';
import { Student } from '../types';
import { audio } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Play, Pause, RotateCcw, Eye, EyeOff, Users, Award, FileText, Tv } from 'lucide-react';

interface VerbSuffixSlideProps {
  students: Student[];
  onReward: (studentId: string, points: number) => void;
}

interface GroupTable {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  students: Student[];
}

export default function VerbSuffixSlide({ students, onReward }: VerbSuffixSlideProps) {
  // State for Timer (2 minutes = 120 seconds)
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // State for Teams/Groups
  const [teams, setTeams] = useState<GroupTable[]>([]);
  const [rewardMessage, setRewardMessage] = useState<string | null>(null);

  // State for Question Answers Reveal
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false
  });

  // Projector mode state
  const [isProjecting, setIsProjecting] = useState(false);

  // Timer interval ref
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 4 Core Grammar Quiz Questions for Kids
  const quizQuestions = [
    {
      id: 1,
      concept: 'PRONOUNS',
      question: 'Swap the underlined words with a correct PRONOUN:',
      sentence: 'The wild leopard hunts at night. ➔ ____ hunts at night.',
      highlightWords: ['The wild leopard', 'PRONOUN'],
      options: 'Choose from: He / She / It / They',
      answer: 'It 🐆',
      hint: 'A leopard is ONE animal, so we use "It"!',
      color: 'bg-neo-coral/10 border-neo-coral',
      highlightColor: 'bg-neo-coral/35'
    },
    {
      id: 2,
      concept: 'BE-VERBS',
      question: 'Choose the correct BE-VERB for singular vs plural:',
      sentence: 'Three tall giraffes ____ standing near the tree.',
      highlightWords: ['Three tall giraffes', 'BE-VERB'],
      options: 'Choose from: is / are',
      answer: 'are 🦒',
      hint: 'There are THREE giraffes (plural), so we use "are"!',
      color: 'bg-neo-blue/10 border-neo-blue',
      highlightColor: 'bg-neo-blue/35'
    },
    {
      id: 3,
      concept: 'HAS OR HAVE HELPERS',
      question: 'Complete the sentence with HAS or HAVE:',
      sentence: 'A smart monkey ____ a banana in its hand.',
      highlightWords: ['A smart monkey', 'HAS or HAVE'],
      options: 'Choose from: has / have',
      answer: 'has 🐒',
      hint: 'ONE monkey (singular) "has" a banana!',
      color: 'bg-yellow-100 border-amber-400',
      highlightColor: 'bg-amber-300/50'
    },
    {
      id: 4,
      concept: 'DO / DOES QUESTION STARTERS',
      question: 'Complete the Safari question correctly:',
      sentence: '____ the heavy elephants swim in the big lake?',
      highlightWords: ['the heavy elephants', 'DO / DOES'],
      options: 'Choose from: Do / Does',
      answer: 'Do 🐘',
      hint: 'Elephants is plural, so we start with "Do"!',
      color: 'bg-neo-green/10 border-neo-green',
      highlightColor: 'bg-neo-green/35'
    }
  ];

  // Divide class into 5 teams randomly
  const rollTeams = () => {
    audio.playDrumroll(1.2);
    
    // Shuffle students
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    
    const teamConfigs = [
      { name: 'Red Dragons 🔴', color: 'from-rose-500 to-red-600', bgColor: 'bg-rose-50', borderColor: 'border-red-600' },
      { name: 'Blue Eagles 🔵', color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-600' },
      { name: 'Green Frogs 🟢', color: 'from-emerald-500 to-green-600', bgColor: 'bg-emerald-50', borderColor: 'border-green-600' },
      { name: 'Yellow Stars 🟡', color: 'from-amber-400 to-yellow-500', bgColor: 'bg-amber-50', borderColor: 'border-amber-400' },
      { name: 'Purple Lions 🟣', color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-600' }
    ];

    const generatedTeams: GroupTable[] = [];
    const teamSizes = [3, 3, 3, 3, 4]; // Total 16 students
    let currentIdx = 0;

    teamConfigs.forEach((config, i) => {
      const teamStudents: Student[] = [];
      const size = teamSizes[i];
      for (let s = 0; s < size; s++) {
        if (shuffled[currentIdx]) {
          teamStudents.push(shuffled[currentIdx]);
          currentIdx++;
        }
      }
      generatedTeams.push({
        id: `team_${i + 1}`,
        name: config.name,
        color: config.color,
        bgColor: config.bgColor,
        borderColor: config.borderColor,
        students: teamStudents
      });
    });

    setTeams(generatedTeams);
    setTimeout(() => {
      audio.playSuccess();
    }, 900);
  };

  // Run countdown logic
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            audio.playSuccess(); // Fanfare or sound at the end
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            return 0;
          }
          // Optional tick sound every second
          audio.playTick();
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning]);

  const handleStartPause = () => {
    audio.playTick();
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    audio.playTick();
    setIsTimerRunning(false);
    setTimeLeft(120);
  };

  const toggleAnswer = (id: number) => {
    audio.playSuccess();
    setRevealedAnswers((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Reward points to all students in a team
  const rewardTeam = (team: GroupTable) => {
    audio.playSuccess();
    team.students.forEach((s) => {
      onReward(s.id, 20); // 20 stars for everyone in the group
    });
    
    setRewardMessage(`✨ +20 Stars rewarded to all members of ${team.name}! 📝`);
    setTimeout(() => {
      setRewardMessage(null);
    }, 4000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Helper to check if a word is in the highlight list
  const renderHighlightedSentence = (sentence: string, highlightWords: string[], highlightBg: string) => {
    let result: React.ReactNode = sentence;
    
    highlightWords.forEach((hw) => {
      const parts = sentence.split(hw);
      if (parts.length > 1) {
        result = (
          <>
            {parts[0]}
            <span className={`${highlightBg} text-black font-black px-2.5 py-0.5 border-2 border-black rotate-[-1deg] inline-block font-display text-lg tracking-tight shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase mx-1`}>
              {hw}
            </span>
            {parts[1]}
          </>
        );
      }
    });

    return result;
  };

  return (
    <div id="writing-quiz-slide" className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
      
      {/* Toast Reward Message */}
      <AnimatePresence>
        {rewardMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[250] bg-[#00FF00] text-black border-4 border-black px-6 py-3 font-display font-black uppercase text-xs md:text-sm shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2"
          >
            <Sparkles size={18} className="animate-spin" />
            {rewardMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT COLUMN: TIMER & TEAM WORKER */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        
        {/* TIMER PANEL */}
        <div className="bg-white text-black border-4 border-black p-4 shadow-neo flex flex-col items-center justify-between relative overflow-hidden">
          <div className="w-full flex items-center justify-between mb-3 pb-2 border-b-2 border-black">
            <h3 className="font-mono text-xs uppercase tracking-widest text-black font-black flex items-center gap-1.5">
              ⏱️ SAFARI WRITING TIMER
            </h3>
            <span className={`font-mono text-[9px] font-black px-2 py-0.5 border border-black uppercase ${
              timeLeft === 0 ? 'bg-red-500 text-white animate-pulse' : isTimerRunning ? 'bg-neo-green text-black animate-pulse' : 'bg-stone-100 text-stone-500'
            }`}>
              {timeLeft === 0 ? "TIME'S UP! ⏰" : isTimerRunning ? "ACTIVE" : "PAUSED"}
            </span>
          </div>

          {/* GIANT COUNTDOWN */}
          <div className="flex flex-col items-center justify-center my-2 text-center">
            <motion.h1 
              animate={timeLeft < 15 && timeLeft > 0 ? { scale: [1, 1.15, 1], transition: { repeat: Infinity, duration: 1 } } : {}}
              className={`font-display text-6xl md:text-7xl font-black italic tracking-tighter leading-none select-none filter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] ${
                timeLeft < 30 ? 'text-neo-coral' : 'text-black'
              }`}
            >
              {formatTime(timeLeft)}
            </motion.h1>
            <p className="text-[9px] font-mono font-black uppercase tracking-widest text-stone-500 mt-2">
              Write answers on paper sheets!
            </p>
          </div>

          {/* TIMER CONTROLS */}
          <div className="flex items-center gap-2 w-full mt-3">
            <button
              onClick={handleStartPause}
              className={`flex-1 py-2.5 border-2 border-black font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5 cursor-pointer ${
                isTimerRunning ? 'bg-neo-coral text-white' : 'bg-neo-green text-black'
              }`}
            >
              {isTimerRunning ? (
                <>
                  <Pause size={13} className="stroke-[3]" /> Pause
                </>
              ) : (
                <>
                  <Play size={13} className="stroke-[3]" /> Start 2:00
                </>
              )}
            </button>

            <button
              onClick={handleResetTimer}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 border-2 border-black font-black text-xs uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-1.5 cursor-pointer text-black"
            >
              <RotateCcw size={13} className="stroke-[3]" /> Reset
            </button>
          </div>
        </div>

        {/* TEAM WORK GROUP GENERATOR */}
        <div className="bg-white text-black border-4 border-black p-4 shadow-neo flex-1 flex flex-col justify-between">
          <div>
            <div className="w-full flex items-center justify-between mb-3 pb-2 border-b-2 border-black">
              <h3 className="font-mono text-xs uppercase tracking-widest text-black font-black flex items-center gap-1.5">
                <Users size={14} /> SAFARI WRITING TEAMS
              </h3>
              <button
                onClick={rollTeams}
                className="px-2.5 py-1 bg-neo-yellow hover:bg-[#ffe033] border-2 border-black text-[9px] font-mono font-black uppercase tracking-wider transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                🎲 Roll Teams!
              </button>
            </div>

            {teams.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center opacity-85">
                <span className="text-4xl mb-2">📝</span>
                <p className="text-xs font-black uppercase text-black">No Teams Formed Yet</p>
                <p className="text-[10px] text-stone-600 mt-1 max-w-[200px] font-bold">
                  Tap "Roll Teams" to split the classroom into 5 writing groups!
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    className={`p-2.5 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${team.bgColor} flex flex-col justify-between`}
                  >
                    <div className="flex items-center justify-between border-b border-black/10 pb-1 mb-1.5">
                      <span className="text-xs font-black text-black uppercase tracking-tight">
                        {team.name}
                      </span>
                      <button
                        onClick={() => rewardTeam(team)}
                        className="px-2 py-0.5 bg-black text-white hover:bg-neo-green hover:text-black border border-black font-mono font-black text-[8px] uppercase tracking-wider transition cursor-pointer"
                      >
                        🏆 +20 Stars
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {team.students.map((student) => (
                        <span
                          key={student.id}
                          className="inline-flex items-center gap-1 bg-white border border-black text-[9px] font-bold px-1.5 py-0.5 shadow-[1px_1px_0px_rgba(0,0,0,1)]"
                        >
                          <span>{student.emoji}</span>
                          <span>{student.name}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-stone-50 border-2 border-dashed border-black/20 p-2.5 mt-3 text-left">
            <span className="text-[8px] font-mono font-black uppercase block text-stone-500">Teacher's Guide:</span>
            <p className="text-[10px] font-bold text-stone-700 leading-relaxed italic">
              Kids work together in groups! Let them write down answers 1 to 4 on their paper templates. Reward 20 Stars to all team members when done!
            </p>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: THE 4 QUIZ QUESTIONS */}
      <div className="lg:col-span-7 flex flex-col gap-4">
        
        <div className="bg-white border-4 border-black p-4 shadow-neo flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📝</span>
                <div>
                  <h4 className="font-display font-black text-black text-base uppercase tracking-tight italic">
                    WRITING REVIEW QUIZ ON PAPERS
                  </h4>
                  <span className="text-[9px] font-mono font-black text-black/55 tracking-wider uppercase border border-black px-1.5 bg-neo-yellow/30">
                    4 QUESTIONS • HIGH-CONTRAST SAFARI RECAP
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  audio.playTick();
                  setIsProjecting(true);
                }}
                className="px-3 py-1 bg-black text-neo-yellow hover:bg-neo-yellow hover:text-black border-2 border-black font-mono font-black text-[10px] uppercase tracking-wide transition cursor-pointer flex items-center gap-1 shadow-neo-sm"
              >
                Projector Mode 📺
              </button>
            </div>

            {/* THE QUESTIONS CONTAINER */}
            <div className="space-y-3">
              {quizQuestions.map((q) => {
                const answered = revealedAnswers[q.id];
                return (
                  <div
                    key={q.id}
                    className={`border-2 border-black p-3 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden ${q.color}`}
                  >
                    <div className="flex items-center justify-between border-b border-black/10 pb-1 mb-2">
                      <span className="text-[9px] font-mono font-black bg-black text-white px-2 py-0.5 tracking-wider uppercase">
                        Q{q.id} • {q.concept}
                      </span>
                      <span className="text-[9px] font-black uppercase text-stone-600 font-mono italic">
                        {q.options}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-stone-700 leading-normal mb-2.5">
                      {q.question}
                    </p>

                    {/* GIANT SENTENCE DISPLAY WITH HIGHLIGHTS */}
                    <div className="bg-white border-2 border-black p-3 my-1.5 shadow-neo-sm text-center">
                      <p className="font-display font-black text-black text-base md:text-lg tracking-tight leading-relaxed">
                        {renderHighlightedSentence(q.sentence, q.highlightWords, q.highlightColor)}
                      </p>
                    </div>

                    {/* REVEAL CONTROLS */}
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-black/5">
                      <button
                        onClick={() => toggleAnswer(q.id)}
                        className={`px-3 py-1 border-2 border-black text-[9px] font-mono font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 cursor-pointer transition ${
                          answered ? 'bg-neo-coral text-white' : 'bg-white text-black'
                        }`}
                      >
                        {answered ? (
                          <>
                            <EyeOff size={11} /> Hide Answer
                          </>
                        ) : (
                          <>
                            <Eye size={11} /> Reveal Answer
                          </>
                        )}
                      </button>

                      <AnimatePresence>
                        {answered && (
                          <motion.div
                            initial={{ scale: 0, rotate: -5 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            className="bg-neo-green text-black border-2 border-black px-2.5 py-0.5 font-display font-black text-xs uppercase tracking-wider shadow-neo-sm flex items-center gap-1"
                          >
                            <span>Correct:</span>
                            <span className="underline decoration-black decoration-2">{q.answer}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* HINT BANNER */}
                    <AnimatePresence>
                      {answered && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-[9px] text-stone-600 font-bold mt-2 pt-1 border-t border-black/5 italic"
                        >
                          💡 Rule Secret: {q.hint}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

      {/* FULLSCREEN PROJECTOR OVERLAY */}
      {isProjecting && (
        <div className="fixed inset-0 z-[200] bg-white border-12 border-black flex flex-col justify-between p-6 text-black animate-scale-up select-none">
          
          {/* PROJECTOR HEADER */}
          <div className="flex items-center justify-between border-b-4 border-black pb-4 w-full">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📺</span>
              <div>
                <span className="text-xs font-mono font-black uppercase text-stone-500 border border-black px-1.5 py-0.5 bg-neo-yellow/20">
                  ACTIVITY 5 • PROJECTOR SCREEN
                </span>
                <h2 className="font-display font-black text-2xl md:text-3xl uppercase italic text-black">
                  📝 WRITING REVIEW QUIZ ON PAPERS
                </h2>
              </div>
            </div>
            
            <button
              onClick={() => setIsProjecting(false)}
              className="px-5 py-2.5 bg-neo-coral text-white border-4 border-black font-black uppercase tracking-wider text-xs shadow-neo hover:translate-y-[1px] transition cursor-pointer"
            >
              Back [X]
            </button>
          </div>

          {/* PROJECTOR MIDDLE GRID */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch my-4 overflow-hidden">
            
            {/* TIMER & HIGHLIGHTS BANNER */}
            <div className="lg:col-span-4 flex flex-col gap-4 justify-between bg-[#FFDE4D] border-4 border-black p-4 shadow-neo relative">
              <div className="text-center my-auto flex flex-col items-center justify-center">
                <span className="text-5xl mb-2 animate-bounce">⏱️</span>
                <h3 className="font-display font-black text-xl text-black uppercase tracking-tight mb-2">
                  WRITING COUNTDOWN
                </h3>
                
                <h1 className="font-display text-7xl md:text-8xl font-black italic tracking-tighter leading-none filter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-black my-2">
                  {formatTime(timeLeft)}
                </h1>

                {/* TIMER ACTION */}
                <button
                  onClick={handleStartPause}
                  className={`mt-4 px-6 py-3 border-4 border-black font-black text-sm uppercase tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 cursor-pointer ${
                    isTimerRunning ? 'bg-neo-coral text-white' : 'bg-[#00FF00] text-black'
                  }`}
                >
                  {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                  {isTimerRunning ? 'Pause Timer' : 'Start Timer'}
                </button>
              </div>

              <div className="bg-white border-4 border-black p-3 text-center">
                <span className="text-xs font-mono font-black uppercase block text-black">SAFARI INSTRUCTION:</span>
                <p className="text-xs font-bold leading-normal text-stone-700 italic">
                  Groups! Look at the screens, read the highlighted key words, and write your answers neatly on papers! 📝🤠
                </p>
              </div>
            </div>

            {/* GIANT QUESTIONS BOARD */}
            <div className="lg:col-span-8 bg-stone-50 border-4 border-black p-4 shadow-neo flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                {quizQuestions.map((q) => {
                  const answered = revealedAnswers[q.id];
                  return (
                    <div
                      key={q.id}
                      className="bg-white border-4 border-black p-4 text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative"
                    >
                      <div className="flex items-center justify-between border-b-2 border-black pb-1.5 mb-2">
                        <span className="text-xs font-mono font-black bg-black text-white px-3 py-1 tracking-widest uppercase">
                          QUESTION {q.id} • {q.concept}
                        </span>
                        <span className="text-[10px] font-mono font-black uppercase bg-neo-yellow/30 border border-black px-2 py-0.5">
                          {q.options}
                        </span>
                      </div>

                      {/* GIANT PHRASE */}
                      <p className="font-display font-black text-black text-xl md:text-2xl tracking-tight leading-relaxed text-center my-3">
                        {renderHighlightedSentence(q.sentence, q.highlightWords, q.highlightColor)}
                      </p>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-black/10">
                        <button
                          onClick={() => toggleAnswer(q.id)}
                          className="px-3 py-1 bg-black text-white hover:bg-neo-coral border-2 border-black text-[9px] font-mono font-black uppercase tracking-wider transition cursor-pointer"
                        >
                          {answered ? 'Hide Correct Answer' : 'Reveal Answer Key'}
                        </button>

                        {answered && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.1 }}
                            className="bg-[#00FF00] text-black border-2 border-black px-4 py-1 font-display font-black text-sm uppercase tracking-wider shadow-neo-sm"
                          >
                            Answer: {q.answer}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* PROJECTOR FOOTER */}
          <div className="border-t-4 border-black pt-3 w-full flex items-center justify-between bg-white text-xs font-mono font-black uppercase">
            <span>🎒 CLASSROOM WRITING QUIZ ON PAPERS • COOPERATE WITH YOUR SAFARI TEAMERS!</span>
            <span>TIME DURATION: 2 MINUTES</span>
          </div>

        </div>
      )}

    </div>
  );
}
