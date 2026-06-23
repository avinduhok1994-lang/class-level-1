import React, { useState } from 'react';
import { Student, SpeakingPrompt } from '../types';
import { GROUPS_PROMPTS } from '../data/prompts';
import { audio } from '../utils/audio';
import { Sparkles, Users, Tv } from 'lucide-react';

interface Groups3SlideProps {
  students: Student[];
  onReward: (studentId: string, points: number) => void;
}

interface GroupTable {
  id: string;
  name: string;
  color: string;
  students: Student[];
}

export default function Groups3Slide({ students, onReward }: Groups3SlideProps) {
  const [tables, setTables] = useState<GroupTable[]>([]);
  const [selectedPrompt] = useState<SpeakingPrompt>(GROUPS_PROMPTS[0]);
  const [activeTable, setActiveTable] = useState<GroupTable | null>(null);
  const [isProjecting, setIsProjecting] = useState(false);

  // Divide students into five groups (four groups of 3 + one group of 4)
  const generateGroupTables = () => {
    audio.playDrumroll(0.8);
    
    // Randomize student order
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    
    const tableConfigs = [
      { name: 'Red Dragons 🔴', color: 'from-rose-500 to-red-600' },
      { name: 'Blue Eagles 🔵', color: 'from-blue-500 to-indigo-600' },
      { name: 'Green Frogs 🟢', color: 'from-emerald-500 to-green-600' },
      { name: 'Yellow Stars 🟡', color: 'from-amber-400 to-yellow-500' },
      { name: 'Purple Lions 🟣', color: 'from-purple-500 to-violet-600' }
    ];

    const generatedTables: GroupTable[] = [];
    let currentIdx = 0;

    // We have 16 students: Table 1 (3), Table 2 (3), Table 3 (3), Table 4 (3), Table 5 (4)
    const sizes = [3, 3, 3, 3, 4];

    sizes.forEach((size, i) => {
      const tableStudents: Student[] = [];
      for (let s = 0; s < size; s++) {
        if (shuffled[currentIdx]) {
          tableStudents.push(shuffled[currentIdx]);
          currentIdx++;
        }
      }
      generatedTables.push({
        id: `table_${i + 1}`,
        name: tableConfigs[i].name,
        color: tableConfigs[i].color,
        students: tableStudents
      });
    });

    setTables(generatedTables);
    setActiveTable(generatedTables[0] || null);
    audio.playSuccess();
  };

  const rewardTable = (table: GroupTable) => {
    audio.playSuccess();
    table.students.forEach((s) => {
      onReward(s.id, 15);
    });
  };

  const formatGroupLine = (line: string) => {
    if (!activeTable) return line;
    let formatted = line;

    // Plural Students B, C reference
    if (formatted.includes('Students B, C')) {
      const nameB = activeTable.students[1]?.name || 'Student B';
      const nameC = activeTable.students[2]?.name || 'Student C';
      formatted = formatted.replace('Students B, C', `[${nameB} & ${nameC}]`);
    }

    // Plural Students A, C reference
    if (formatted.includes('Students A, C')) {
      const nameA = activeTable.students[0]?.name || 'Student A';
      const nameC = activeTable.students[2]?.name || 'Student C';
      formatted = formatted.replace('Students A, C', `[${nameA} & ${nameC}]`);
    }

    // Individual standard substitutions
    if (activeTable.students[0]) {
      formatted = formatted.replace(/Student A/g, `[${activeTable.students[0].name}]`);
    }
    if (activeTable.students[1]) {
      formatted = formatted.replace(/Student B/g, `[${activeTable.students[1].name}]`);
    }
    if (activeTable.students[2]) {
      formatted = formatted.replace(/Student C/g, `[${activeTable.students[2].name}]`);
    }
    if (activeTable.students[3]) {
      formatted = formatted.replace(/Student D/g, `[${activeTable.students[3].name}]`);
    }

    return formatted;
  };

  return (
    <div id="groups3-slide" className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
      
      {/* Left Column: Team Tables */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        
        <div className="bg-white border-4 border-black p-3.5 shadow-neo">
          <div className="flex items-center justify-between mb-2.5 border-b-2 border-black pb-1.5">
            <h3 className="font-mono text-xs uppercase tracking-widest text-black font-black flex items-center gap-1.5">
              <Users size={14} className="stroke-[2.5]" /> CIRCLE TEAM TABLES
            </h3>
            <span className="bg-neo-green text-black font-mono text-[9px] font-black px-2 py-0.5 border border-black uppercase">
              {tables.length > 0 ? 'FORMED' : 'READY'}
            </span>
          </div>

          {tables.length === 0 ? (
            <div className="text-center py-6">
              <span className="text-4xl">🎒</span>
              <p className="text-xs font-black text-black mt-1.5 uppercase tracking-wide">Form Cooperative Teams</p>
              <p className="text-[10px] text-stone-600 max-w-[210px] mx-auto mt-0.5 font-bold leading-normal">
                Tap below to divide students into 5 circle teams.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {tables.map((table) => (
                <button
                  key={table.id}
                  onClick={() => {
                    audio.playTick();
                    setActiveTable(table);
                  }}
                  className={`w-full p-2.5 border text-left transition flex items-center justify-between cursor-pointer ${
                    activeTable?.id === table.id 
                      ? 'border-4 border-black bg-neo-green/20 shadow-none font-black' 
                      : 'border-2 border-black bg-white hover:bg-slate-50 shadow-neo-sm font-bold'
                  }`}
                >
                  <div>
                    <h5 className="text-xs font-black text-black uppercase">{table.name}</h5>
                    <div className="flex gap-1 mt-1">
                      {table.students.map((s) => (
                        <div key={s.id} className="text-base" title={s.name}>
                          {s.emoji}
                        </div>
                      ))}
                    </div>
                  </div>

                  <span className="text-[9px] bg-black text-white font-mono font-black border border-black px-1.5 py-0.5 uppercase">
                    {table.students.length} STARS
                  </span>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={generateGroupTables}
            className="w-full py-2.5 bg-neo-yellow hover:bg-[#ffe033] text-black border-4 border-black font-black text-xs uppercase tracking-wider shadow-neo-sm hover:translate-y-[-1px] hover:shadow-neo active:translate-y-0 active:shadow-neo-sm mt-3 transition cursor-pointer"
          >
            Form Circle Tables! 🤝
          </button>
        </div>

      </div>

      {/* Right Column: Group Challenge Prompts */}
      <div className="lg:col-span-7 flex flex-col gap-3">
        
        <div className="bg-white border-4 border-black p-4 shadow-neo flex-1 flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedPrompt.visualHint || '🏆'}</span>
                <div>
                  <h4 className="font-display font-black text-base text-black uppercase tracking-tight italic">
                    {selectedPrompt.title}
                  </h4>
                  <span className="text-[9px] font-mono font-black text-black/55 tracking-wider uppercase border border-black px-1.5 bg-neo-yellow/30">
                    ACTIVITY 3: GROUPS SPEAKING
                  </span>
                </div>
              </div>
            </div>

            {/* Table visual representation */}
            {activeTable ? (
              <div className="mb-3 bg-neo-yellow border-4 border-black p-3 text-black shadow-neo-sm relative overflow-hidden">
                
                <h4 className="font-display font-black text-sm text-black uppercase tracking-wider mb-2 italic">
                  ⭐ Spotlight: {activeTable.name}
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activeTable.students.map((student, idx) => (
                    <div 
                      key={student.id} 
                      className="bg-white border-2 border-black p-1.5 flex flex-col items-center justify-center text-center shadow-neo-sm rounded-none"
                    >
                      <span className="text-xl">{student.emoji}</span>
                      <h4 className="font-black text-[10px] text-black mt-1 truncate w-full uppercase">{student.name}</h4>
                      <span className="text-[8px] font-mono text-stone-600 font-black mt-0.5">SEAT #{idx + 1}</span>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div className="p-4 border-4 border-dashed border-black bg-stone-50 text-center mb-3">
                <span className="text-2xl">🧩</span>
                <p className="text-[11px] font-black uppercase tracking-wider text-black mt-1">Table Not Formed Yet</p>
                <p className="text-[9px] text-stone-500 font-bold">Tap "Form Circle Tables" on the left side!</p>
              </div>
            )}

            {/* Guidelines */}
            <div className="mt-2.5">
              <div className="flex items-center justify-between mb-1.5 border-b border-black/10 pb-0.5">
                <h5 className="text-[9px] font-mono tracking-widest text-black font-black uppercase">
                  📢 Activity Speaking Template
                </h5>
                <button
                  type="button"
                  onClick={() => {
                    audio.playTick();
                    setIsProjecting(true);
                  }}
                  className="px-2 py-0.5 bg-black text-neo-yellow hover:bg-neo-yellow hover:text-black border border-black font-mono font-black text-[9px] uppercase tracking-wide transition cursor-pointer flex items-center gap-1 shadow-neo-sm"
                >
                  Projector Mode 📺
                </button>
              </div>
              
              <div className="space-y-1.5">
                {selectedPrompt.guidelines?.map((line, idx) => (
                  <div 
                    key={idx}
                    className="p-2 bg-slate-50 border-2 border-black font-display text-xs font-bold text-black flex items-center gap-2 shadow-neo-sm"
                  >
                    <span className="text-[10px] bg-black text-white font-mono w-4.5 h-4.5 rounded-none flex items-center justify-center shrink-0 font-black">
                      {idx + 1}
                    </span>
                    <span className="font-sans font-bold tracking-tight text-black">
                      {formatGroupLine(line)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Reward Table */}
          {activeTable && (
            <div className="mt-3 bg-[#00FF00]/10 border-2 border-black p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-neo-sm animate-scale-up">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <div>
                  <h5 className="font-black uppercase text-xs text-black">Reward the Entire Table!</h5>
                  <p className="text-[9px] font-bold text-stone-600">Give star credits to all team members</p>
                </div>
              </div>
              <button
                onClick={() => rewardTable(activeTable)}
                className="px-4 py-2 bg-neo-green hover:bg-[#33ff33] text-black font-black border-2 border-black text-[10px] uppercase tracking-wider shadow-neo-sm hover:translate-y-[1px] hover:shadow-none transition-all duration-75 cursor-pointer"
              >
                Reward Table +15 Stars Each ⭐
              </button>
            </div>
          )}

        </div>

      </div>

      {/* FULLSCREEN PROJECTOR OVERLAY */}
      {isProjecting && (
        <div className="fixed inset-0 z-[100] bg-white border-8 border-black flex flex-col justify-between p-8 text-black animate-scale-up overflow-y-auto">
          <div className="flex items-center justify-between border-b-4 border-black pb-4 w-full">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedPrompt.visualHint || '👥'}</span>
              <div>
                <span className="text-xs font-mono font-black uppercase text-stone-500 border border-black px-1.5 py-0.5 bg-neo-yellow/20">
                  COOPERATIVE GROUPS • PROJECTOR MODE
                </span>
                <h2 className="font-display font-black text-2xl uppercase italic text-black">{selectedPrompt.title}</h2>
              </div>
            </div>
            
            <button
              onClick={() => setIsProjecting(false)}
              className="px-4 py-2 bg-neo-coral text-white border-4 border-black font-black uppercase tracking-wider text-xs shadow-neo hover:translate-y-[1px] transition cursor-pointer"
            >
              Close [X]
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center max-w-5xl mx-auto w-full py-8 text-center">
            
            {activeTable && (
              <div className="mb-6 bg-neo-yellow border-4 border-black p-4 inline-flex flex-col items-center gap-2 shadow-neo">
                <span className="text-xs font-mono font-black border border-black px-1.5 bg-black text-white py-0.5 uppercase tracking-wide">
                  ACTIVE TABLE TEAM
                </span>
                <h3 className="font-display font-black text-xl text-black uppercase">{activeTable.name}</h3>
                <div className="flex gap-3 mt-1">
                  {activeTable.students.map((student) => (
                    <div key={student.id} className="flex items-center gap-1 bg-white border border-black px-2 py-1">
                      <span>{student.emoji}</span>
                      <span className="text-xs font-black uppercase">{student.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="w-full space-y-4 my-auto">
              {selectedPrompt.guidelines?.map((line, idx) => (
                <div 
                  key={idx}
                  className="p-6 bg-slate-50 border-4 border-black font-display text-2xl md:text-3xl font-black text-black flex items-center gap-4 shadow-neo text-left"
                >
                  <span className="text-lg bg-black text-white font-mono w-10 h-10 rounded-none flex items-center justify-center shrink-0 border-2 border-black">
                    {idx + 1}
                  </span>
                  <span className="font-sans font-black tracking-tight flex-1">
                    {formatGroupLine(line)}
                  </span>
                </div>
              ))}
            </div>

          </div>

          <div className="border-t-4 border-black pt-4 w-full flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              {activeTable && (
                <button
                  onClick={() => rewardTable(activeTable)}
                  className="px-6 py-3 bg-neo-green text-black border-4 border-black font-black uppercase text-sm shadow-neo hover:translate-y-0.5 transition cursor-pointer"
                >
                  ⭐ Reward Entire Table (+15 Stars Each)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
