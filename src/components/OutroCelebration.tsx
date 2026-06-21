import React, { useEffect, useRef, useState } from 'react';
import { Student } from '../types';
import { audio } from '../utils/audio';
import { Trophy, RefreshCw, Star, Sparkles, Award } from 'lucide-react';

interface OutroCelebrationProps {
  students: Student[];
  onRestart: () => void;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
}

export default function OutroCelebration({ students, onRestart }: OutroCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [podium, setPodium] = useState<Student[]>([]);

  // Sound triggering on mount
  useEffect(() => {
    audio.playFanfare();
    
    // Calculate top 3 students based on points
    const sorted = [...students].sort((a, b) => b.points - a.points);
    setPodium(sorted.slice(0, 3));
  }, [students]);

  // Confetti Particle Engine on HTML5 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#f97316'];
    const particles: Particle[] = [];

    // Initialize particles
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * -height - 20,
        size: Math.random() * 6 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        // Reset particle on bottom hit
        if (p.y > height) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2); // rectangular confetti
        ctx.restore();
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div id="outro-celebration" className="relative w-full flex flex-col items-center justify-between p-3.5 overflow-hidden">
      
      {/* Canvas Confetti layer covering the full slide */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Main podium & congrats heading */}
      <div className="z-20 text-center max-w-3xl mt-2">
        <div className="inline-flex items-center gap-1.5 bg-neo-yellow text-black border-2 border-black px-3 py-1 text-[10px] font-black uppercase tracking-widest font-mono mb-3 shadow-neo-sm animate-bounce">
          <Sparkles size={11} className="text-black stroke-[3]" /> CLASS CELEBRATION PARTY
        </div>
        
        <h1 className="font-display text-2xl sm:text-3xl font-black text-black leading-tight uppercase tracking-tight italic">
          CONGRATULATIONS, CLASS! 🎉 <br />
          <span className="bg-neo-yellow px-1.5 border-2 border-black text-black shadow-neo-sm leading-normal">YOU SPOKE EXCELLENT ENGLISH!</span>
        </h1>
        
        <p className="text-stone-700 font-bold text-xs mt-2 leading-relaxed max-w-lg mx-auto uppercase">
          Every speaker did an outstanding job today. Let's hand out our special graduation awards!
        </p>
      </div>

      {/* Podium Display (Top 3) */}
      <div className="z-20 w-full max-w-2xl grid grid-cols-3 gap-3 items-end mt-4 px-2">
        
        {/* Silver - Rank 2 */}
        {podium[1] && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center text-3xl shadow-neo-sm border-2 border-black relative">
              {podium[1].emoji}
              <span className="absolute -top-1 -right-1 bg-black text-white font-black text-[9px] w-4.5 h-4.5 rounded-none flex items-center justify-center border-2 border-black">
                2
              </span>
            </div>
            <h4 className="font-black text-black text-xs mt-1 truncate w-full text-center uppercase">{podium[1].name}</h4>
            <span className="text-[9px] text-stone-600 font-mono font-black uppercase">{podium[1].points} PTS</span>
            <div className="w-full bg-[#e2e8f0] border-4 border-black shadow-neo-sm h-16 mt-2 flex items-center justify-center text-[10px] font-black text-black font-mono uppercase tracking-wider">
              SILVER 🥈
            </div>
          </div>
        )}

        {/* Gold - Rank 1 */}
        {podium[0] && (
          <div className="flex flex-col items-center scale-105">
            <div className="w-16 h-16 bg-neo-yellow rounded-none flex items-center justify-center text-4xl shadow-neo border-4 border-black relative animate-float">
              {podium[0].emoji}
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white font-black text-[10px] w-5.5 h-5.5 rounded-none flex items-center justify-center border-2 border-black shadow">
                1
              </span>
            </div>
            <h4 className="font-black text-black text-sm mt-1 truncate w-full text-center uppercase italic">{podium[0].name}</h4>
            <span className="text-[10px] text-black bg-neo-yellow/30 border border-black px-1.2 font-mono font-black mb-0.5 uppercase">{podium[0].points} PTS</span>
            <div className="w-full bg-neo-yellow border-4 border-black shadow-neo h-22 flex flex-col items-center justify-center text-[10px] font-black text-black font-mono uppercase tracking-wider">
              <Trophy size={16} className="text-black stroke-[2.5] animate-pulse mb-0.5" />
              WINNER 🏆
            </div>
          </div>
        )}

        {/* Bronze - Rank 3 */}
        {podium[2] && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center text-3xl shadow-neo-sm border-2 border-black relative">
              {podium[2].emoji}
              <span className="absolute -top-1 -right-1 bg-black text-white font-black text-[9px] w-4.5 h-4.5 rounded-none flex items-center justify-center border-2 border-black">
                3
              </span>
            </div>
            <h4 className="font-black text-black text-xs mt-1 truncate w-full text-center uppercase">{podium[2].name}</h4>
            <span className="text-[9px] text-stone-600 font-mono font-black uppercase">{podium[2].points} PTS</span>
            <div className="w-full bg-[#fddbc0] border-4 border-black shadow-neo-sm h-14 mt-2 flex items-center justify-center text-[10px] font-black text-black font-mono uppercase tracking-wider">
              BRONZE 🥉
            </div>
          </div>
        )}

      </div>

      {/* Graduation Roll summary */}
      <div className="z-20 w-full max-w-4xl bg-white border-4 border-black p-3 mt-4 shadow-neo text-left">
        <h4 className="font-mono text-[10px] font-black text-black uppercase tracking-wider mb-2 text-center flex items-center justify-center gap-1 border-b border-black/15 pb-1">
          <Award size={12} className="text-black stroke-[2.5]" /> CLASS SPEAKER LEGENDS INDEX
        </h4>
        
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {students.map((student) => (
            <div 
              key={student.id}
              className="bg-white border-2 border-black p-1 text-center transition flex flex-col items-center shadow-neo-sm"
            >
              <div className="relative">
                <span className="text-xl">{student.emoji}</span>
                <span className="absolute -top-1.5 -right-1 text-[10px]" title="Graduated Cap">🎓</span>
              </div>
              <h5 className="font-black text-[9px] text-black mt-1 truncate w-full uppercase">{student.name}</h5>
              <span className="text-[8px] font-mono font-black text-neo-coral leading-none uppercase mt-0.5">
                ★ {student.points}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Reset presentation button */}
      <div className="z-20 mt-4 pb-1">
        <button
          onClick={() => {
            audio.playSuccess();
            onRestart();
          }}
          className="px-4 py-2 bg-neo-coral hover:bg-rose-400 text-white font-black border-4 border-black shadow-neo hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-none uppercase text-xs tracking-wider inline-flex items-center gap-1.5 transition cursor-pointer"
        >
          <RefreshCw size={12} className="stroke-[3]" /> Restart Slides Class
        </button>
      </div>

    </div>
  );
}
