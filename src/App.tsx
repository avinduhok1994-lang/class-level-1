import React, { useState, useEffect } from 'react';
import { Student } from './types';
import IntroScreen from './components/IntroScreen';
import WelcomeSlide from './components/WelcomeSlide';
import SoloSlide from './components/SoloSlide';
import PairsSlide from './components/PairsSlide';
import Groups3Slide from './components/Groups3Slide';
import QuizSlide from './components/QuizSlide';
import OutroCelebration from './components/OutroCelebration';
import { audio } from './utils/audio';
import { 
  ChevronLeft, 
  ChevronRight, 
  Expand, 
  Maximize2, 
  Sparkles, 
  Users, 
  BookOpen, 
  Settings, 
  Trophy, 
  X,
  GraduationCap
} from 'lucide-react';

const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: 'Liam', emoji: '🦁', points: 0 },
  { id: '2', name: 'Emma', emoji: '🦄', points: 0 },
  { id: '3', name: 'Noah', emoji: '🐼', points: 0 },
  { id: '4', name: 'Olivia', emoji: '🐨', points: 0 },
  { id: '5', name: 'Ethan', emoji: '🐯', points: 0 },
  { id: '6', name: 'Ava', emoji: '🦊', points: 0 },
  { id: '7', name: 'Lucas', emoji: '🐙', points: 0 },
  { id: '8', name: 'Mia', emoji: '🐰', points: 0 },
  { id: '9', name: 'Mason', emoji: '🦖', points: 0 },
  { id: '10', name: 'Sophia', emoji: '🐱', points: 0 },
  { id: '11', name: 'Oliver', emoji: '🐶', points: 0 },
  { id: '12', name: 'Isabella', emoji: '🦉', points: 0 },
  { id: '13', name: 'Henry', emoji: '🐻', points: 0 },
  { id: '14', name: 'Charlotte', emoji: '🦥', points: 0 },
  { id: '15', name: 'James', emoji: '🐝', points: 0 },
  { id: '16', name: 'Amelia', emoji: '🐞', points: 0 },
];

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('class_16_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [showScoreDrawer, setShowScoreDrawer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync to localstorage
  const saveStudents = (updatedList: Student[]) => {
    setStudents(updatedList);
    localStorage.setItem('class_16_students', JSON.stringify(updatedList));
  };

  // Star Reward point system
  const handleReward = (studentId: string, pointsToAdd: number) => {
    const updated = students.map((s) => 
      s.id === studentId ? { ...s, points: s.points + pointsToAdd } : s
    );
    saveStudents(updated);
  };

  // Keyboard Slide control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't change slide if a search/input is active
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') {
        return;
      }
      if (e.key === 'ArrowLeft') {
        handlePrevSlide();
      } else if (e.key === 'ArrowRight') {
        handleNextSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isStarted, currentSlideIndex]);

  // Request true full-screen in browser
  const toggleFullScreen = () => {
    const element = document.documentElement;
    if (!document.fullscreenElement) {
      element.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.warn("Fullscreen permission denied:", err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Clean scoreboards reset
  const resetScoreboard = () => {
    if (confirm("Reset everyone's star point tallies to 0?")) {
      const resetList = students.map(s => ({ ...s, points: 0 }));
      saveStudents(resetList);
      audio.playSuccess();
    }
  };

  // Define classroom slide sequence
  const slides = [
    { type: 'welcome', title: 'Welcome', component: <WelcomeSlide students={students} onNext={handleNextSlide} /> },
    { type: 'solo', title: 'Solo Activity', component: <SoloSlide students={students} onReward={handleReward} /> },
    { type: 'pairs', title: 'Pairs Scenario', component: <PairsSlide students={students} onReward={handleReward} /> },
    { type: 'group', title: 'Groups Mode', component: <Groups3Slide students={students} onReward={handleReward} /> },
    { type: 'quiz', title: 'Interactive Quiz', component: <QuizSlide students={students} /> },
    { type: 'outro', title: 'Celebration Outro', component: <OutroCelebration students={students} onRestart={handleRestartAll} /> },
  ];

  function handleNextSlide() {
    if (currentSlideIndex < slides.length - 1) {
      audio.playTick();
      setCurrentSlideIndex(prev => prev + 1);
    }
  }

  function handlePrevSlide() {
    if (currentSlideIndex > 0) {
      audio.playTick();
      setCurrentSlideIndex(prev => prev - 1);
    }
  }

  function handleRestartAll() {
    setCurrentSlideIndex(0);
    setIsStarted(false);
    // Erase temporary states, reset points optionally
    const resetPoints = students.map(s => ({ ...s, points: 0 }));
    saveStudents(resetPoints);
  }

  if (!isStarted) {
    return (
      <div className="bg-neo-yellow/5 min-h-screen p-2 sm:p-6 flex items-center justify-center">
        <div className="w-full max-w-5xl border-4 sm:border-8 border-black bg-white shadow-neo">
          <IntroScreen 
            students={students} 
            onSave={saveStudents} 
            onStart={() => setIsStarted(true)} 
          />
        </div>
      </div>
    );
  }

  const activeSlide = slides[currentSlideIndex];

  return (
    <div id="slideshow-root" className="bg-neo-yellow/5 min-h-screen flex flex-col justify-between font-sans select-none relative border-4 md:border-8 border-black">
      
      {/* Dynamic top control banner/track navigation bar with Neo Brutalist lines */}
      <header className="bg-white border-b-4 border-black px-6 py-4 flex items-center justify-between z-30">
        
        <div className="flex items-center gap-3">
          <div className="bg-black text-neo-yellow border-2 border-black p-1.5 flex items-center justify-center">
            <GraduationCap size={18} />
          </div>
          <div>
            <h1 className="font-display font-black text-lg text-black uppercase tracking-tight leading-none italic">
              SpeakUp! <span className="text-neo-coral text-sm">L1</span>
            </h1>
            <p className="text-[9px] font-mono text-black font-extrabold tracking-wider mt-0.5 uppercase">SLIDESHOW PRESENTER</p>
          </div>
        </div>

        {/* Steps track pipeline in bold badge form */}
        <div className="hidden lg:flex items-center gap-2">
          {slides.map((s, idx) => (
            <React.Fragment key={s.type}>
              <button
                onClick={() => {
                  audio.playTick();
                  setCurrentSlideIndex(idx);
                }}
                className={`px-3 py-1.5 border-2 border-black text-xs font-black uppercase transition duration-100 cursor-pointer ${
                  currentSlideIndex === idx 
                    ? 'bg-neo-yellow text-black shadow-neo-sm translate-y-[-1px]' 
                    : 'bg-white hover:bg-slate-100 text-black'
                }`}
              >
                {s.title}
              </button>
              {idx < slides.length - 1 && <span className="text-black font-black text-xs mx-0.5">•</span>}
            </React.Fragment>
          ))}
        </div>

        {/* Action Widgets right header */}
        <div className="flex items-center gap-2">
          
          {/* Scorboards Trigger */}
          <button
            onClick={() => {
              audio.playTick();
              setShowScoreDrawer(prev => !prev);
            }}
            className="px-3.5 py-2 bg-[#FF6B6B] text-white border-2 border-black font-black text-xs uppercase tracking-wide inline-flex items-center gap-1.5 shadow-neo-sm hover:translate-y-0.5 hover:shadow-none transition-all duration-75 cursor-pointer"
          >
            <Trophy size={14} className="stroke-[2.5]" /> Stars ({students.reduce((sum, s) => sum + s.points, 0)})
          </button>

          {/* Fullscreen control */}
          <button
            onClick={toggleFullScreen}
            title="FullScreen projector mode"
            className="p-2 text-black bg-white hover:bg-[#00FF00]/15 border-2 border-black rounded-none shadow-neo-sm hover:translate-y-0.5 hover:shadow-none transition-all duration-75 cursor-pointer"
          >
            <Maximize2 size={16} className="stroke-[2.5]" />
          </button>

          {/* Back to roster edit */}
          <button
            onClick={() => {
              audio.playTick();
              setIsStarted(false);
            }}
            title="Edit Students List"
            className="p-2 text-black bg-white hover:bg-[#FF6B6B]/20 border-2 border-black rounded-none shadow-neo-sm hover:translate-y-0.5 hover:shadow-none transition-all duration-75 cursor-pointer"
          >
            <Settings size={16} className="stroke-[2.5]" />
          </button>

        </div>

      </header>

      {/* Main slides projector frame area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex items-center justify-center">
        <div className="w-full">
          {activeSlide.component}
        </div>
      </main>

      {/* Footer Navigation bars with click triggers */}
      <footer className="bg-white border-t-4 border-black px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-30">
        
        {/* Helper keys text info */}
        <div className="text-[10px] font-mono font-bold text-black uppercase tracking-wider">
          ⌨️ keyboard control: <kbd className="bg-white border border-black px-1.5 py-0.5 rounded shadow-sm text-black">← Left Arrow</kbd> & <kbd className="bg-white border border-black px-1.5 py-0.5 rounded shadow-sm text-black">Right Arrow →</kbd>
        </div>

        {/* Margins slideshow controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={handlePrevSlide}
            disabled={currentSlideIndex === 0}
            className={`px-5 py-3 border-2 border-black font-black uppercase italic text-xs flex items-center gap-1.5 transition duration-75 select-none ${
              currentSlideIndex === 0 
                ? 'opacity-35 text-slate-400 cursor-not-allowed bg-slate-100 shadow-none' 
                : 'bg-black hover:bg-zinc-800 text-white shadow-neo-sm hover:translate-y-0.5 hover:shadow-none cursor-pointer'
            }`}
          >
            <ChevronLeft size={16} className="stroke-[3]" /> Previous
          </button>

          <span className="text-black text-xs font-mono font-black border-2 border-black px-3 py-1.5 bg-neo-yellow shadow-neo-sm">
            Slide {currentSlideIndex + 1} of {slides.length}
          </span>

          <button
            onClick={handleNextSlide}
            disabled={currentSlideIndex === slides.length - 1}
            className={`px-5 py-3 border-2 border-black font-black uppercase italic text-xs flex items-center gap-1.5 transition duration-75 select-none ${
              currentSlideIndex === slides.length - 1 
                ? 'opacity-35 text-slate-400 cursor-not-allowed bg-slate-100 shadow-none' 
                : 'bg-[#00FF00] hover:bg-[#00dd00] text-black shadow-neo-sm hover:translate-y-0.5 hover:shadow-none cursor-pointer'
            }`}
          >
            Next Slide <ChevronRight size={16} className="stroke-[3]" />
          </button>
        </div>

      </footer>

      {/* Slide Retractable Star Leaderboard Scorecard Drawer */}
      {showScoreDrawer && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-50 flex justify-end animate-fade-in">
          <div className="w-full max-w-sm bg-white h-screen shadow-neo p-6 flex flex-col justify-between animate-slide-left border-l-4 border-black">
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between border-b-4 border-black pb-3 mb-4">
                <h3 className="font-display font-black text-black text-lg uppercase tracking-tight italic flex items-center gap-1.5">
                  ⭐ STAR SCOREBOARD
                </h3>
                <button
                  onClick={() => setShowScoreDrawer(false)}
                  className="p-1 px-2 text-black bg-white hover:bg-[#FF6B6B]/20 border-2 border-black font-black text-xs cursor-pointer"
                >
                  <X size={15} className="stroke-[3]" />
                </button>
              </div>

              {/* Roster list items */}
              <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                {[...students]
                  .sort((a, b) => b.points - a.points)
                  .map((student, rankIdx) => {
                    const pillColor = rankIdx === 0 
                      ? 'bg-neo-yellow' 
                      : rankIdx === 1 
                      ? 'bg-slate-200' 
                      : rankIdx === 2 
                      ? 'bg-[#FF6B6B]/20' 
                      : 'bg-white';
                      
                    return (
                      <div 
                        key={student.id} 
                        className={`p-2 border-2 border-black flex items-center justify-between shadow-neo-sm ${pillColor}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 text-center text-xs font-mono font-black text-black opacity-60">
                            #{String(rankIdx + 1).padStart(2, '0')}
                          </span>
                          <span className="text-xl">{student.emoji}</span>
                          <span className="text-xs font-black uppercase tracking-wider text-black truncate max-w-[110px] sm:max-w-none">
                            {student.name}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-extrabold text-black bg-white border border-black px-2 py-0.5 rounded-none">
                            ⭐ {student.points} pts
                          </span>
                          
                          {/* Instant manual reward controls inside drawer */}
                          <button
                            onClick={() => {
                              audio.playSuccess();
                              handleReward(student.id, 5);
                            }}
                            className="px-1.5 py-0.5 text-[9px] font-black bg-black text-white hover:bg-zinc-800 transition rounded-none cursor-pointer"
                            title="Add 5 points"
                          >
                            +5
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Reset Star Points button */}
            <div className="pt-4 border-t-4 border-black">
              <button
                onClick={resetScoreboard}
                className="w-full py-3 bg-[#FF6B6B] hover:bg-[#ff5555] text-white border-2 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm hover:translate-y-0.5 hover:shadow-none transition-all duration-75 cursor-pointer"
              >
                Clear Scoreboard to 0
              </button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
