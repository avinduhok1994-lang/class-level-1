import React, { useState } from 'react';
import { Student } from '../types';
import { audio } from '../utils/audio';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Play, Users, Sparkles, Award, Star } from 'lucide-react';

interface ListenReadProps {
  students: Student[];
  onReward: (studentId: string, points: number) => void;
}

interface DialogueLine {
  id: number;
  character: 'Martin' | 'Sue' | 'Tom';
  text: string;
  avatar: string;
  avatarBg: string;
  gender: 'male' | 'female';
  pitch: number; // For TTS voice styling
}

const DIALOGUE: DialogueLine[] = [
  { id: 1, character: 'Martin', text: "Let’s go to the swimming pool.", avatar: '👦', avatarBg: 'bg-neo-blue/20', gender: 'male', pitch: 1.3 },
  { id: 2, character: 'Sue', text: "Why?", avatar: '👧', avatarBg: 'bg-neo-coral/20', gender: 'female', pitch: 1.1 },
  { id: 3, character: 'Martin', text: "I’m bored. And Anna is swimming today.", avatar: '👦', avatarBg: 'bg-neo-blue/20', gender: 'male', pitch: 1.3 },
  { id: 4, character: 'Sue', text: "Oh! I see. OK.", avatar: '👧', avatarBg: 'bg-neo-coral/20', gender: 'female', pitch: 1.1 },
  { id: 5, character: 'Tom', text: "Excuse me.", avatar: '👦', avatarBg: 'bg-neo-green/20', gender: 'male', pitch: 0.95 },
  { id: 6, character: 'Sue', text: "Hi, Tom! Can I help you?", avatar: '👧', avatarBg: 'bg-neo-coral/20', gender: 'female', pitch: 1.1 },
  { id: 7, character: 'Tom', text: "I’m looking for seat A27.", avatar: '👦', avatarBg: 'bg-neo-green/20', gender: 'male', pitch: 0.95 },
  { id: 8, character: 'Sue', text: "Martin, whose seat is this?", avatar: '👧', avatarBg: 'bg-neo-coral/20', gender: 'female', pitch: 1.1 },
  { id: 9, character: 'Martin', text: "It’s mine. I’m sitting here.", avatar: '👦', avatarBg: 'bg-neo-blue/20', gender: 'male', pitch: 1.3 },
  { id: 10, character: 'Tom', text: "I’m sorry. It isn’t yours. It’s mine.", avatar: '👦', avatarBg: 'bg-neo-green/20', gender: 'male', pitch: 0.95 },
  { id: 11, character: 'Martin', text: "I’m watching the swimming. Go away.", avatar: '👦', avatarBg: 'bg-neo-blue/20', gender: 'male', pitch: 1.3 },
  { id: 12, character: 'Sue', text: "Martin! Are these our seats?", avatar: '👧', avatarBg: 'bg-neo-coral/20', gender: 'female', pitch: 1.1 },
  { id: 13, character: 'Martin', text: "I don’t know. I’m watching Anna.", avatar: '👦', avatarBg: 'bg-neo-blue/20', gender: 'male', pitch: 1.3 },
  { id: 14, character: 'Tom', text: "You’re sitting in my seat. Look, this is my ticket!", avatar: '👦', avatarBg: 'bg-neo-green/20', gender: 'male', pitch: 0.95 },
  { id: 15, character: 'Sue', text: "Come on, Martin, let’s move. It is Tom’s seat.", avatar: '👧', avatarBg: 'bg-neo-coral/20', gender: 'female', pitch: 1.1 },
  { id: 16, character: 'Martin', text: "No, let’s watch the end of this race. Anna is winning!", avatar: '👦', avatarBg: 'bg-neo-blue/20', gender: 'male', pitch: 1.3 },
  { id: 17, character: 'Sue', text: "Martin, she’s a good swimmer.", avatar: '👧', avatarBg: 'bg-neo-coral/20', gender: 'female', pitch: 1.1 },
];

export default function ListenReadSlide({ students, onReward }: ListenReadProps) {
  const [activeLineId, setActiveLineId] = useState<number | null>(null);
  const [roleplayFilter, setRoleplayFilter] = useState<'ALL' | 'Martin' | 'Sue' | 'Tom'>('ALL');
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [rewardAmount, setRewardAmount] = useState<number>(10);
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  // Play a line using Speech Synthesis API
  const speakLine = (line: DialogueLine) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    audio.playTick();
    setActiveLineId(line.id);

    const utterance = new SpeechSynthesisUtterance(line.text);
    
    // Choose voice based on character gender & customize pitch
    const voices = window.speechSynthesis.getVoices();
    const isFemale = line.gender === 'female';
    const characterVoice = voices.find(v => 
      isFemale 
        ? v.name.includes('female') || v.name.includes('Google US English') || v.name.includes('Zira')
        : v.name.includes('male') || v.name.includes('David') || v.name.includes('Mark')
    );
    
    if (characterVoice) {
      utterance.voice = characterVoice;
    }
    
    utterance.pitch = line.pitch;
    utterance.rate = 0.9; // speak a little slower for kids

    utterance.onend = () => {
      setActiveLineId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Autoplay whole script with delays
  const handlePlayWholeDialogue = async () => {
    if (isPlayingAll) {
      window.speechSynthesis.cancel();
      setIsPlayingAll(false);
      setActiveLineId(null);
      return;
    }

    setIsPlayingAll(true);
    for (const line of DIALOGUE) {
      if (!isPlayingAll) break; // handle stop
      speakLine(line);
      // Wait for TTS to finish estimated duration
      const wordCount = line.text.split(' ').length;
      const duration = (wordCount * 450) + 500; // ms per word
      await new Promise(resolve => setTimeout(resolve, duration));
    }
    setIsPlayingAll(false);
    setActiveLineId(null);
  };

  const handleManualReward = () => {
    if (!selectedStudentId) return;
    audio.playSuccess();
    onReward(selectedStudentId, rewardAmount);
    
    // Reset selection and show quick confetti/sound
    const student = students.find(s => s.id === selectedStudentId);
    alert(`⭐ Swelling reward! +${rewardAmount} points awarded to ${student?.name} ${student?.emoji}!`);
    setSelectedStudentId('');
  };

  // Highlight key terms requested by the user: Possessive 's, pronouns, Whose?, Let's...
  const renderHighlightedText = (text: string) => {
    const targets = [
      { word: "Let’s go", class: "bg-neo-yellow text-black border-2 border-black rotate-[-1deg] font-black px-1.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] uppercase text-[10px] leading-none" },
      { word: "let’s watch", class: "bg-neo-yellow text-black border-2 border-black rotate-[1deg] font-black px-1.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] uppercase text-[10px] leading-none" },
      { word: "let’s move", class: "bg-neo-yellow text-black border-2 border-black rotate-[-1deg] font-black px-1.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] uppercase text-[10px] leading-none" },
      { word: "whose seat", class: "bg-purple-300 text-black border-2 border-black rotate-[-1deg] font-black px-1.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] uppercase text-[10px] leading-none" },
      { word: "It’s mine", class: "bg-neo-blue text-white border-2 border-black rotate-[1deg] font-black px-1.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] uppercase text-[10px] leading-none" },
      { word: "yours", class: "bg-neo-blue text-white border-2 border-black rotate-[-1deg] font-black px-1.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] uppercase text-[10px] leading-none" },
      { word: "Tom’s seat", class: "bg-neo-coral text-white border-2 border-black rotate-[1deg] font-black px-1.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] uppercase text-[10px] leading-none" },
      { word: "our seats", class: "bg-neo-blue text-white border-2 border-black rotate-[1deg] font-black px-1.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] uppercase text-[10px] leading-none" },
      { word: "my seat", class: "bg-neo-blue text-white border-2 border-black rotate-[-1deg] font-black px-1.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] uppercase text-[10px] leading-none" },
      { word: "my ticket", class: "bg-neo-blue text-white border-2 border-black rotate-[1deg] font-black px-1.5 shadow-[1.5px_1.5px_0px_rgba(0,0,0,1)] uppercase text-[10px] leading-none" },
    ];

    let result: React.ReactNode = text;

    for (const target of targets) {
      if (text.includes(target.word)) {
        const parts = text.split(target.word);
        result = (
          <>
            {parts[0]}
            <span className={`inline-block mx-1 ${target.class}`}>
              {target.word}
            </span>
            {parts[1]}
          </>
        );
        break; // simple helper, supports single highlight per line
      }
    }

    return result;
  };

  return (
    <div id="listen-read-slide" className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
      
      {/* LEFT COLUMN: HERO AVATARS & CONTROLS */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        {/* CHARACTER BOARD */}
        <div className="bg-white border-4 border-black p-4 shadow-neo text-left">
          <span className="text-[9px] font-mono font-black uppercase text-stone-500 border border-black px-2 py-0.5 bg-neo-yellow/20 inline-block mb-2">
            SWIMMING POOL CHAT
          </span>
          <h2 className="font-display font-black text-xl text-black leading-tight uppercase italic mb-3">
            🏊‍♂️ Dialogue Roleplay
          </h2>
          
          <div className="space-y-2.5">
            {[
              { name: 'Martin', emoji: '👦' },
              { name: 'Sue', emoji: '👧' },
              { name: 'Tom', emoji: '👨‍🦰' }
            ].map((char) => {
              const isSelected = roleplayFilter === char.name;
              return (
                <button
                  key={char.name}
                  onClick={() => {
                    audio.playTick();
                    setRoleplayFilter(isSelected ? 'ALL' : (char.name as any));
                  }}
                  className={`w-full p-2.5 border-2 border-black flex items-center gap-3 text-left transition relative cursor-pointer select-none ${
                    isSelected ? 'bg-black text-white' : 'bg-stone-50 hover:bg-stone-100 text-black'
                  } shadow-neo-sm`}
                >
                  <div className={`w-8 h-8 rounded-none border-2 border-black flex items-center justify-center text-xl bg-white`}>
                    {char.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black uppercase leading-none">{char.name}</h4>
                  </div>
                  {isSelected && (
                    <span className="absolute top-1 right-1 bg-neo-yellow text-black border border-black px-1 text-[7px] font-mono font-black">
                      ACTIVE
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              audio.playTick();
              setRoleplayFilter('ALL');
            }}
            className="w-full mt-3 py-2 bg-stone-100 hover:bg-stone-200 text-black border-2 border-black font-mono font-black text-xs uppercase tracking-wider transition shadow-neo-sm cursor-pointer"
          >
            Show All Characters
          </button>
        </div>

        {/* VOICE PLAYBACK SYSTEM */}
        <div className="bg-[#4D96FF] border-4 border-black p-4 shadow-neo text-left text-white">
          <span className="text-[8px] font-mono font-black bg-black text-neo-yellow px-2 py-0.5 border border-black uppercase inline-block mb-2">
            AUDIO READER
          </span>
          <h3 className="font-display font-black text-base uppercase italic leading-none mb-3">
            🔊 Read Story
          </h3>
          
          <button
            onClick={handlePlayWholeDialogue}
            className={`w-full py-3 border-4 border-black font-black text-xs uppercase tracking-wider transition shadow-neo-sm cursor-pointer flex items-center justify-center gap-2 ${
              isPlayingAll ? 'bg-neo-coral text-white' : 'bg-neo-yellow text-black'
            }`}
          >
            <Volume2 size={14} className="stroke-[3]" />
            {isPlayingAll ? 'Stop Playback' : 'Play Whole Story'}
          </button>
        </div>

        {/* POINT REWARD CARD FOR ROLEPLAYERS */}
        <div className="bg-white border-4 border-black p-4 shadow-neo text-left">
          <span className="text-[9px] font-mono font-black uppercase text-stone-500 border border-black px-2 py-0.5 bg-neo-yellow/20 inline-block mb-2">
            REWARDS
          </span>
          <h3 className="font-display font-black text-sm uppercase italic leading-none mb-1.5 flex items-center gap-1.5 text-black">
            <Award size={15} /> Roleplayer Stars
          </h3>
          
          <div className="space-y-2">
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

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRewardAmount(10)}
                className={`flex-1 py-1 text-[10px] font-mono font-black border-2 border-black cursor-pointer ${
                  rewardAmount === 10 ? 'bg-neo-coral text-white' : 'bg-stone-50 text-black'
                }`}
              >
                +10 Stars
              </button>
              <button
                onClick={() => setRewardAmount(20)}
                className={`flex-1 py-1 text-[10px] font-mono font-black border-2 border-black cursor-pointer ${
                  rewardAmount === 20 ? 'bg-neo-green text-black' : 'bg-stone-50 text-black'
                }`}
              >
                +20 Stars
              </button>
            </div>

            <button
              onClick={handleManualReward}
              disabled={!selectedStudentId}
              className={`w-full py-2.5 border-2 border-black font-black text-xs uppercase tracking-wider transition ${
                selectedStudentId 
                  ? 'bg-neo-yellow text-black hover:-translate-y-0.5 hover:shadow-neo-sm cursor-pointer' 
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
            >
              Award Stars! ⭐
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: INTERACTIVE SPEECH SCRIPTS */}
      <div className="lg:col-span-8 bg-stone-50 border-4 border-black p-4 shadow-neo flex flex-col justify-between overflow-hidden">
        
        <div className="w-full flex items-center justify-between mb-4 pb-2 border-b-2 border-black">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <div>
              <h4 className="font-display font-black text-black text-sm uppercase tracking-tight italic">
                1 – Listen and Read Script
              </h4>
            </div>
          </div>
        </div>

        {/* DIALOGUE BUBBLES LIST */}
        <div className="flex-1 space-y-3 max-h-[500px] overflow-y-auto pr-2 text-left">
          {DIALOGUE.map((line) => {
            const isHighlightedByRole = roleplayFilter === 'ALL' || roleplayFilter === line.character;
            const isSpeakingNow = activeLineId === line.id;
            
            return (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, x: line.character === 'Martin' ? -10 : 10 }}
                animate={{ 
                  opacity: isHighlightedByRole ? 1 : 0.15,
                  scale: isSpeakingNow ? 1.02 : 1,
                  x: 0 
                }}
                onClick={() => speakLine(line)}
                className={`p-3 border-2 border-black flex items-start gap-3 transition-all duration-150 cursor-pointer select-none ${
                  isSpeakingNow 
                    ? 'bg-neo-yellow/20 border-neo-yellow shadow-[4px_4px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white hover:bg-stone-100 hover:translate-y-[-1px] hover:shadow-neo-sm shadow-[2px_2px_0px_rgba(0,0,0,1)]'
                }`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 shrink-0 rounded-none border-2 border-black flex items-center justify-center text-xl ${line.avatarBg}`}>
                  {line.avatar}
                </div>

                {/* Bubble Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between border-b border-black/5 pb-0.5 mb-1">
                    <span className={`text-[10px] font-mono font-black uppercase tracking-wider ${
                      line.character === 'Martin' ? 'text-neo-blue' : line.character === 'Sue' ? 'text-neo-coral' : 'text-[#16a34a]'
                    }`}>
                      {line.character}
                    </span>
                  </div>

                  <p className="font-display font-black text-stone-800 text-sm md:text-base tracking-tight leading-relaxed">
                    {renderHighlightedText(line.text)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
