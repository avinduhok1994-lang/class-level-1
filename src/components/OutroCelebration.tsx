import React, { useEffect, useRef, useState } from 'react';
import { Student } from '../types';
import { audio } from '../utils/audio';
import { Trophy, RefreshCw, Star, Sparkles, Award, BookOpen, ListTodo, HelpCircle, Check, ArrowRight, Volume2, HelpCircle as HelpIcon, Activity, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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

const RULES = [
  { 
    concept: 'Third-Person Singular Pronoun', 
    rule: 'Replaces singular animate nouns (He/She) or inanimate nouns (It). Requires singular "-s" verb inflection.', 
    example: 'She drives the safari jeep.', 
    emoji: '🦁' 
  },
  { 
    concept: 'Plural Subject Pronoun', 
    rule: 'Replaces plural or collective nouns (They). Requires base/plural verb agreement forms.', 
    example: 'They are sleeping under the tree.', 
    emoji: '👥' 
  },
  { 
    concept: 'Interrogative Auxiliary', 
    rule: 'Formulates present questions. "Does" aligns with third-person singular subjects (He/She/It); "Do" aligns with plural subjects (They).', 
    example: 'Does the monkey like bananas?', 
    emoji: '❓' 
  },
  { 
    concept: 'Possessive Verb Inflection', 
    rule: '"Has" is the third-person singular present form. "Have" is the base/plural form used for plural/other subjects.', 
    example: 'The giant elephant has big ears.', 
    emoji: '🐘' 
  },
  { 
    concept: 'Present Suffix S-Verb Agreement', 
    rule: 'A singular subject (It) takes a verb with "-s" or "-es". A plural subject (They) takes the base verb.', 
    example: 'The cheetah runs fast vs They run fast.', 
    emoji: '🐆' 
  }
];

const DIAGRAM_SENTENCES = [
  {
    id: 'sentence_1',
    text: 'She drives the safari jeep.',
    desc: 'Pronouns, Possessive Agreement, Adjectives & Direct Objects',
    words: [
      { text: 'She', role: 'Subject Pronoun (Nominative)', pos: 'PRON', details: 'Third-person singular feminine pronoun. Acts as the sentence agent.' },
      { text: 'drives', role: 'Transitive Predicate Verb', pos: 'VERB', details: 'Form of "to drive" inflected with an -s suffix for third-person singular agreement.' },
      { text: 'the', role: 'Definite Article (Determiner)', pos: 'DET', details: 'Modifies the noun phrase "safari jeep" to indicate definiteness.' },
      { text: 'safari', role: 'Noun Adjunct (Noun Modifier)', pos: 'NOUN', details: 'Noun functioning as an adjective to modify the head noun "jeep".' },
      { text: 'jeep', role: 'Direct Object Noun (Accusative)', pos: 'NOUN', details: 'Head noun of the direct object noun phrase, receiving the verb\'s action.' }
    ]
  },
  {
    id: 'sentence_2',
    text: 'They run under the tree.',
    desc: 'Plural Agreement, Motion Verbs, and Prepositional Directions',
    words: [
      { text: 'They', role: 'Subject Pronoun (Nominative)', pos: 'PRON', details: 'Third-person plural pronoun representing a collective agent.' },
      { text: 'run', role: 'Intransitive Predicate Verb', pos: 'VERB', details: 'Base form of the verb "to run", agreeing with plural subject "They".' },
      { text: 'under', role: 'Spatial Preposition', pos: 'ADP', details: 'Head preposition introducing position within a prepositional phrase.' },
      { text: 'the', role: 'Definite Article (Determiner)', pos: 'DET', details: 'Definite determiner identifying a specific singular noun "tree".' },
      { text: 'tree', role: 'Noun (Object of Preposition)', pos: 'NOUN', details: 'Common singular place noun acting as the spatial destination.' }
    ]
  },
  {
    id: 'sentence_3',
    text: 'The quick cheetah runs fast.',
    desc: 'Determiners, Attribute Adjectives, and Active Transitive Verbs',
    words: [
      { text: 'The', role: 'Definite Article (Determiner)', pos: 'DET', details: 'Definite article introducing the subject noun phrase.' },
      { text: 'quick', role: 'Descriptive Adjective', pos: 'ADJ', details: 'Attributive adjective modifying the subject noun "cheetah".' },
      { text: 'cheetah', role: 'Subject Noun (Nominative)', pos: 'NOUN', details: 'Singular common noun serving as the subject agent of the sentence.' },
      { text: 'runs', role: 'Intransitive Predicate Verb', pos: 'VERB', details: 'Inflected third-person singular form of the verb "to run", adding "-s".' },
      { text: 'fast', role: 'Adverb of Manner', pos: 'ADV', details: 'Adverb modifying the verb "runs" to show speed of movement.' }
    ]
  }
];

const LEARNED_WORDS = [
  { word: 'He', group: 'Pronouns (👥)', category: 'Pronoun (Boy 👦)', color: 'bg-neo-coral text-white border-black', description: 'Used to replace a single boy, man, or male animal.', example: '"He is a helpful safari guide!" 🤠' },
  { word: 'She', group: 'Pronouns (👥)', category: 'Pronoun (Girl 👧)', color: 'bg-neo-coral text-white border-black', description: 'Used to replace a single girl, woman, or female animal.', example: '"She tracks the wild leopards." 🐆' },
  { word: 'It', group: 'Pronouns (👥)', category: 'Pronoun (Animal/Thing 🦁)', color: 'bg-neo-coral text-white border-black', description: 'Used to replace a single animal, plant, or object.', example: '"It sleeps under the tall tree." 🌳' },
  { word: 'They', group: 'Pronouns (👥)', category: 'Pronoun (Group 👥)', color: 'bg-neo-coral text-white border-black', description: 'Used for two or more people, animals, or objects.', example: '"They run extremely fast together!" 💨' },
  { word: 'Is', group: 'Be-Verbs (☝️✌️)', category: 'Be-Verb ☝️', color: 'bg-neo-blue text-white border-black', description: 'The present singular form of the verb "to be". Goes with He, She, or It.', example: '"The proud lion is taking a nap." 🦁' },
  { word: 'Are', group: 'Be-Verbs (☝️✌️)', category: 'Be-Verb ✌️', color: 'bg-neo-blue text-white border-black', description: 'The present plural form of the verb "to be". Goes with They, We, or You.', example: '"The zebras are drinking cool water." 🦓' },
  { word: 'Has', group: 'Helpers (✨)', category: 'Helper Verb ✨', color: 'bg-purple-600 text-white border-black', description: 'Singular helper verb. Used when ONE animal owns or holds something.', example: '"The giant elephant has a long trunk." 🐘' },
  { word: 'Have', group: 'Helpers (✨)', category: 'Helper Verb 🌟', color: 'bg-purple-600 text-white border-black', description: 'Plural helper verb. Used when multiple animals own or hold something.', example: '"The active monkeys have long tails." 🐒' },
  { word: 'Does', group: 'Questions (❓)', category: 'Helper Question ❓', color: 'bg-neo-green text-black border-black', description: 'Used to start questions for singular subjects (He, She, It).', example: '"Does the clever bird speak to you?" 🦜' },
  { word: 'Do', group: 'Questions (❓)', category: 'Helper Question ❔', color: 'bg-neo-green text-black border-black', description: 'Used to start questions for plural subjects (They, We, You).', example: '"Do the heavy hippos swim in the river?" 🦛' },
];

const KIDS_RULES = [
  {
    title: 'The Singular "-s" Suffix! 🦁',
    formula: 'He / She / It + Action Verb + "s"',
    rule: 'When only ONE person or animal is doing something in the present, we add "-s" or "-es" to the action verb!',
    example: 'The swift cheetah runs fast! 🐆',
    bgColor: 'bg-neo-coral/10',
    borderColor: 'border-neo-coral',
    textColor: 'text-neo-coral',
    tag: 'One Animal = Add S! ⚡'
  },
  {
    title: 'The Plural "They" Rule! 👥',
    formula: 'They + Plain Action Verb',
    rule: 'When TWO or more animals are doing something, the action verb stays plain and simple without adding "-s"!',
    example: 'The playful monkeys swing on vines! 🐒',
    bgColor: 'bg-neo-blue/10',
    borderColor: 'border-neo-blue',
    textColor: 'text-neo-blue',
    tag: 'Many Animals = Plain Verb! 🍃'
  },
  {
    title: 'The "Is" vs "Are" Safari! 🦒',
    formula: 'Singular ➔ IS  |  Plural ➔ ARE',
    rule: 'Use "Is" for one single creature, and use "Are" when talking about two or more people or animals!',
    example: 'The elephant is big! 🐘 vs. The tall birds are flying! 🦜',
    bgColor: 'bg-neo-yellow/15',
    borderColor: 'border-neo-yellow',
    textColor: 'text-amber-700',
    tag: 'Singular Is / Plural Are ⭐'
  },
  {
    title: 'Has vs. Have Helpers! 🎒',
    formula: 'Singular ➔ HAS  |  Plural ➔ HAVE',
    rule: 'One single creature "has" a special feature. A group of creatures "have" that feature!',
    example: 'The lion has a golden mane! 🦁 vs. Lions have sharp claws! 🐾',
    bgColor: 'bg-purple-50 border-purple-500',
    borderColor: 'border-purple-600',
    textColor: 'text-purple-700',
    tag: 'Possession Match! 🎒'
  },
  {
    title: 'Do & Does Question Starters! ❓',
    formula: 'Does + Singular  |  Do + Plural',
    rule: 'Begin a safari question with "Does" for singular animals, and with "Do" for groups of animals!',
    example: 'Does the giraffe eat fresh leaves? 🦒 vs. Do heavy hippos swim? 🦛',
    bgColor: 'bg-emerald-50 border-emerald-500',
    borderColor: 'border-emerald-600',
    textColor: 'text-emerald-700',
    tag: 'Question Starters ❓'
  }
];

export default function OutroCelebration({ students, onRestart }: OutroCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [podium, setPodium] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState<'recap' | 'rules' | 'diagram' | 'podium'>('recap');
  
  // Custom interactive summary states
  const [selectedLearnedWord, setSelectedLearnedWord] = useState<any>(LEARNED_WORDS[0]);
  const [selectedKidRule, setSelectedKidRule] = useState<any>(KIDS_RULES[0]);
  
  // Interactive Checklist states
  const [completedItems, setCompletedItems] = useState<number[]>([]);
  
  // Rules table interaction
  const [activeRuleIdx, setActiveRuleIdx] = useState<number | null>(null);

  // Diagram & Parser states
  const [activeSentenceId, setActiveSentenceId] = useState<string>('sentence_1');
  const [diagramMode, setDiagramMode] = useState<'reed_kellogg' | 'syntax_tree' | 'parser'>('reed_kellogg');
  const [selectedWordIdx, setSelectedWordIdx] = useState<number>(0);

  // Reset selected word index on sentence shift
  useEffect(() => {
    setSelectedWordIdx(0);
  }, [activeSentenceId]);

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

  const handleToggleCheck = (id: number) => {
    audio.playTick();
    if (completedItems.includes(id)) {
      setCompletedItems(prev => prev.filter(item => item !== id));
    } else {
      setCompletedItems(prev => [...prev, id]);
    }
  };

  const activeSentenceObj = DIAGRAM_SENTENCES.find(s => s.id === activeSentenceId) || DIAGRAM_SENTENCES[0];
  const selectedWordObj = activeSentenceObj.words[selectedWordIdx] || activeSentenceObj.words[0];

  return (
    <div id="outro-celebration" className="relative w-full flex flex-col items-center justify-between p-3.5 overflow-hidden">
      
      {/* Canvas Confetti layer covering the full slide */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Main podium & congrats heading */}
      <div className="z-20 text-center max-w-3xl mt-1 mb-3">
        <div className="inline-flex items-center gap-1.5 bg-neo-yellow text-black border-2 border-black px-3 py-1 text-[10px] font-black uppercase tracking-widest font-mono mb-2 shadow-neo-sm animate-bounce">
          <Sparkles size={11} className="text-black stroke-[3]" /> CLASS SUCCESS SUMMARY
        </div>
        
        <h1 className="font-display text-2xl sm:text-3xl font-black text-black leading-tight uppercase tracking-tight italic">
          CONGRATULATIONS, GRADE 2 & 3 STARS! 🎉 <br />
          <span className="bg-neo-yellow px-1.5 border-2 border-black text-black shadow-neo-sm leading-normal">WE MASTERED ENGLISH GRAMMAR!</span>
        </h1>
      </div>

      {/* TABS SELECTOR - HIGH-DENSITY NEO-BRUTALIST NAV BAR */}
      <div className="z-20 w-full max-w-4xl flex flex-wrap gap-2 mb-4 justify-center">
        <button
          onClick={() => { audio.playTick(); setActiveTab('recap'); }}
          className={`px-3 py-2 text-[11px] font-black uppercase tracking-wide border-2 border-black font-mono transition shadow-neo-sm flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'recap' ? 'bg-neo-yellow text-black translate-y-[2px] shadow-none' : 'bg-white text-black hover:bg-stone-50'
          }`}
        >
          <ListTodo size={14} /> 1. Words We Learned
        </button>

        <button
          onClick={() => { audio.playTick(); setActiveTab('rules'); }}
          className={`px-3 py-2 text-[11px] font-black uppercase tracking-wide border-2 border-black font-mono transition shadow-neo-sm flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'rules' ? 'bg-neo-blue text-white translate-y-[2px] shadow-none' : 'bg-white text-black hover:bg-stone-50'
          }`}
        >
          <BookOpen size={14} /> 2. Kids Grammar Rules
        </button>

        <button
          onClick={() => { audio.playTick(); setActiveTab('diagram'); }}
          className={`px-3 py-2 text-[11px] font-black uppercase tracking-wide border-2 border-black font-mono transition shadow-neo-sm flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'diagram' ? 'bg-neo-coral text-white translate-y-[2px] shadow-none' : 'bg-white text-black hover:bg-stone-50'
          }`}
        >
          <Activity size={14} /> 3. Sentence Diagram Chart
        </button>

        <button
          onClick={() => { audio.playTick(); setActiveTab('podium'); }}
          className={`px-3 py-2 text-[11px] font-black uppercase tracking-wide border-2 border-black font-mono transition shadow-neo-sm flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'podium' ? 'bg-neo-green text-black translate-y-[2px] shadow-none' : 'bg-white text-black hover:bg-stone-50'
          }`}
        >
          <Trophy size={14} /> 4. Champion Awards
        </button>
      </div>

      {/* TAB CONTENT AREAS */}
      <div className="z-20 w-full max-w-4xl min-h-[280px]">
        
        {/* TAB 1: WORDS LEARNED TODAY (BIG ANIMATED FONTS & COLORS) */}
        {activeTab === 'recap' && (
          <div className="bg-white border-4 border-black p-4 shadow-neo animate-scale-up text-left">
            <h3 className="font-display font-black text-sm text-black border-b-2 border-black pb-1.5 mb-3 flex items-center gap-2 uppercase">
              🌈 WORDS WE LEARNED TODAY • TAP TO HEAR & EXPLORE!
            </h3>
            
            <p className="text-stone-700 text-xs font-bold mb-3.5 leading-normal">
              Click any of the giant colorful word cards below to see how they help us build super sentences!
            </p>

            {/* GROUPED WORDS CONTAINER */}
            <div className="space-y-4 mb-4">
              {[
                { name: 'PRONOUNS (👥)', labelColor: 'text-neo-coral', words: LEARNED_WORDS.filter(w => w.group === 'Pronouns (👥)') },
                { name: 'BE-VERBS (☝️✌️)', labelColor: 'text-neo-blue', words: LEARNED_WORDS.filter(w => w.group === 'Be-Verbs (☝️✌️)') },
                { name: 'HELPERS (✨)', labelColor: 'text-purple-600', words: LEARNED_WORDS.filter(w => w.group === 'Helpers (✨)') },
                { name: 'QUESTIONS (❓)', labelColor: 'text-neo-green', words: LEARNED_WORDS.filter(w => w.group === 'Questions (❓)') },
              ].map((grp) => (
                <div key={grp.name} className="border-4 border-black p-3 bg-stone-50/50 shadow-neo-sm">
                  <span className={`text-xs font-mono font-black uppercase tracking-wider block mb-2 ${grp.labelColor}`}>
                    {grp.name}
                  </span>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {grp.words.map((w) => {
                      const isSelected = selectedLearnedWord?.word === w.word;
                      return (
                        <motion.button
                          key={w.word}
                          onClick={() => {
                            audio.playSuccess();
                            setSelectedLearnedWord(w);
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-3 border-4 border-black rounded-none transition flex flex-col items-center justify-center text-center cursor-pointer relative select-none ${
                            isSelected 
                              ? 'translate-y-[2px] shadow-none bg-black text-white border-black' 
                              : `${w.color} shadow-neo-sm`
                          }`}
                        >
                          <span className="text-[9px] font-mono font-black uppercase opacity-85 leading-none mb-1">
                            {w.category.split(' ')[0]}
                          </span>
                          <span className="font-display text-2xl sm:text-3xl font-black uppercase tracking-wide leading-none py-1.5 filter drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)]">
                            {w.word}
                          </span>
                          {isSelected && (
                            <span className="absolute top-1 right-1 bg-neo-green text-black border border-black p-0.5 text-[6px] rounded-none">
                              <Check size={8} className="stroke-[4]" />
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {selectedLearnedWord && (
                <motion.div
                  key={selectedLearnedWord.word}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-amber-50 border-4 border-black shadow-neo-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black/10 pb-1.5 mb-2">
                    <span className="text-xs font-mono font-black text-black uppercase tracking-wider">
                      ⭐ Spotlight Word: <span className="text-neo-coral text-sm bg-white border border-black px-1.5 py-0.5 font-bold">{selectedLearnedWord.word}</span>
                    </span>
                    <span className="text-[10px] font-black uppercase text-stone-600 font-mono">
                      {selectedLearnedWord.category}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-stone-800 leading-normal mb-3">
                    {selectedLearnedWord.description}
                  </p>

                  <div className="bg-white border-2 border-black p-2.5 shadow-neo-sm">
                    <span className="text-[8px] font-mono font-black text-stone-400 block uppercase">Example Sentence</span>
                    <p className="font-display font-black text-sm md:text-base text-black italic">
                      {selectedLearnedWord.example}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 pt-3 border-t-2 border-black/15 flex flex-wrap items-center justify-between gap-3 bg-stone-50 p-2.5">
              <p className="text-[10px] font-bold text-stone-700 italic">
                💡 Every word plays a unique part in making our Safari conversation grammatically perfect!
              </p>
              <button
                onClick={() => { audio.playTick(); setActiveTab('rules'); }}
                className="px-3 py-1 bg-black text-white hover:bg-neo-blue font-mono font-black text-[9px] uppercase tracking-wider transition flex items-center gap-1 cursor-pointer"
              >
                Let's Learn the Rules! ➔
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: KIDS GRAMMAR RULES */}
        {activeTab === 'rules' && (
          <div className="bg-white border-4 border-black p-4 shadow-neo animate-scale-up text-left">
            <h3 className="font-display font-black text-sm text-black border-b-2 border-black pb-1.5 mb-3 uppercase flex items-center justify-between">
              <span>🦁 KIDS SAFARI GRAMMAR RULES!</span>
              <span className="text-[9px] font-mono bg-neo-blue text-white px-2 py-0.5 border border-black shadow-neo-sm">FUN ANIMATIONS & FORMULAS</span>
            </h3>

            <p className="text-stone-700 text-xs font-bold mb-3.5 leading-normal">
              Tap any Rule Card below to learn the secrets of correct speaking! Watch the formulas change!
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              {KIDS_RULES.map((rule, idx) => {
                const isSelected = selectedKidRule?.title === rule.title;
                return (
                  <motion.button
                    key={rule.title}
                    onClick={() => {
                      audio.playSuccess();
                      setSelectedKidRule(rule);
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`p-3 border-4 border-black text-left flex flex-col justify-between cursor-pointer transition select-none ${
                      isSelected 
                        ? 'bg-neo-blue text-white border-black shadow-none' 
                        : 'bg-white text-black shadow-neo-sm hover:bg-stone-50'
                    }`}
                  >
                    <div>
                      <span className={`text-[8px] font-mono font-black border px-1.5 py-0.5 uppercase tracking-wide inline-block mb-2 ${
                        isSelected ? 'bg-black text-neo-yellow border-black' : 'bg-neo-yellow/30 border-black'
                      }`}>
                        RULE #{idx + 1}
                      </span>
                      <h4 className="font-display font-black text-xs leading-tight uppercase">
                        {rule.title}
                      </h4>
                    </div>

                    <span className="text-[9px] font-mono font-black uppercase mt-3 tracking-wide">
                      {rule.tag.split(' ')[0]}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {selectedKidRule && (
                <motion.div
                  key={selectedKidRule.title}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className={`p-4 border-4 border-black shadow-neo-sm ${selectedKidRule.bgColor}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black/10 pb-1.5 mb-2.5">
                    <span className="text-xs font-mono font-black text-black uppercase tracking-wider">
                      🎯 Rule Formula
                    </span>
                    <span className="text-[9px] font-mono font-black bg-black text-white px-2 py-0.5 uppercase tracking-widest border border-black">
                      {selectedKidRule.tag}
                    </span>
                  </div>

                  {/* GIANT FORMULA BOX */}
                  <div className="bg-white border-4 border-black p-4 text-center my-3 shadow-neo-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 bg-black text-white text-[8px] font-mono px-2 py-0.5 font-black uppercase">
                      GOLDEN FORMULA
                    </div>
                    <motion.h2 
                      initial={{ scale: 0.9, y: 5 }}
                      animate={{ scale: 1, y: 0 }}
                      className="font-display font-black text-xl sm:text-2xl md:text-3xl text-black uppercase tracking-tight italic"
                    >
                      {selectedKidRule.formula}
                    </motion.h2>
                  </div>

                  <div className="space-y-2 mt-3 text-black">
                    <p className="text-xs font-black uppercase tracking-wide">
                      💡 The Simple Rule:
                    </p>
                    <p className="text-xs font-bold leading-normal text-stone-800">
                      {selectedKidRule.rule}
                    </p>

                    <div className="mt-3.5 bg-white border-2 border-black p-2.5 shadow-neo-sm">
                      <span className="text-[8px] font-mono font-black text-stone-400 block uppercase">Fun Example Sentence</span>
                      <p className="font-sans font-black text-sm text-black italic">
                        {selectedKidRule.example}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-4 flex justify-between items-center bg-neo-blue/5 p-2.5 border-2 border-black border-dashed">
              <p className="text-[10px] text-stone-700 font-bold flex items-center gap-1">
                <Lightbulb size={12} className="text-neo-yellow shrink-0" />
                <span>Our visual grammar cheat sheet helps stars practice correctly before testing!</span>
              </p>
              
              <button
                onClick={() => { audio.playTick(); setActiveTab('diagram'); }}
                className="px-3 py-1 bg-black text-white hover:bg-neo-coral font-mono font-black text-[9px] uppercase tracking-wider transition flex items-center gap-1 cursor-pointer"
              >
                Go to Sentence Diagram ➔
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SENTENCE MAKER DIAGRAM CHART */}
        {activeTab === 'diagram' && (
          <div className="bg-white border-4 border-black p-4 shadow-neo animate-scale-up text-left">
            <h3 className="font-display font-black text-sm text-black border-b-2 border-black pb-1.5 mb-2 uppercase flex items-center justify-between">
              <span>📐 SENTENCE DIAGRAM CHART</span>
              <span className="text-[10px] font-mono bg-neo-coral text-white px-2 py-0.5 border border-black shadow-neo-sm">Grammar Fun</span>
            </h3>
            
            <p className="text-stone-700 text-xs font-bold mb-4">
              Let's see how our sentence blocks fit together like magic! 🧩 Choose a sentence and a diagram style below.
            </p>

            {/* Top row: Sentence Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 mb-4">
              {DIAGRAM_SENTENCES.map((sen) => (
                <button
                  key={sen.id}
                  onClick={() => {
                    audio.playTick();
                    setActiveSentenceId(sen.id);
                  }}
                  className={`p-2.5 border-2 border-black text-left cursor-pointer transition relative flex flex-col justify-between ${
                    activeSentenceId === sen.id 
                      ? 'bg-neo-coral text-white shadow-none translate-y-[2px]' 
                      : 'bg-stone-50 text-black hover:bg-stone-100 shadow-neo-sm'
                  }`}
                >
                  <span className="text-[9px] font-mono font-black uppercase tracking-wider block opacity-75">
                    {sen.id === 'sentence_1' ? 'Example 1' : sen.id === 'sentence_2' ? 'Example 2' : 'Example 3'}
                  </span>
                  <span className="font-display font-black text-sm leading-tight my-1">
                    "{sen.text}"
                  </span>
                  <span className={`text-[8px] font-bold ${activeSentenceId === sen.id ? 'text-neo-yellow' : 'text-stone-500'}`}>
                    {sen.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Tab Inner Switcher: Diagram Framework */}
            <div className="flex border-b-4 border-black mb-4 bg-stone-100">
              {[
                { mode: 'reed_kellogg', label: 'Sentence Block Connector' },
                { mode: 'syntax_tree', label: 'Grammar Tree' },
                { mode: 'parser', label: 'Word Job Finder' }
              ].map((tab) => (
                <button
                  key={tab.mode}
                  onClick={() => {
                    audio.playTick();
                    setDiagramMode(tab.mode as any);
                  }}
                  className={`flex-1 py-2 font-mono font-black text-[10px] uppercase tracking-wider border-r-2 last:border-r-0 border-black transition cursor-pointer text-center ${
                    diagramMode === tab.mode 
                      ? 'bg-black text-white' 
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* DIAGRAM VISUAL STAGE */}
            <div className="bg-stone-50 border-4 border-black p-4 min-h-[220px] relative overflow-auto">
              
              {/* 1. REED-KELLOGG SCHEMATIC VIEW */}
              {diagramMode === 'reed_kellogg' && (
                <div className="flex flex-col items-center justify-center py-4 select-none min-w-[500px]">
                  <p className="text-[9px] font-mono font-black text-stone-500 uppercase mb-4 text-center">
                    How word blocks connect! 🚀 (Subject | Verb | Direct Object)
                  </p>

                  {/* Schema Renderer */}
                  {activeSentenceId === 'sentence_1' && (
                    <div className="font-mono text-xs">
                      {/* Baseline */}
                      <div className="flex items-center justify-center border-b-4 border-black pb-0.5 px-4 relative">
                        {/* Subject */}
                        <div className="px-6 py-1 font-black text-black">
                          She
                          <div className="text-[8px] font-bold text-stone-400 text-center uppercase tracking-wider mt-0.5">Subject (Pronoun)</div>
                        </div>
                        {/* Vertical line separator for Subject/Verb */}
                        <div className="absolute top-0 bottom-[-4px] w-1 bg-black left-[30%]" />
                        
                        {/* Verb */}
                        <div className="px-6 py-1 font-black text-neo-coral">
                          has
                          <div className="text-[8px] font-bold text-stone-400 text-center uppercase tracking-wider mt-0.5">Verb (Transitive)</div>
                        </div>
                        {/* Half-length vertical line separator for Verb/Direct Object */}
                        <div className="absolute top-0 bottom-0 w-1 bg-black left-[63%]" />

                        {/* Direct Object */}
                        <div className="px-6 py-1 font-black text-black relative">
                          star
                          <div className="text-[8px] font-bold text-stone-400 text-center uppercase tracking-wider mt-0.5">Direct Object (Noun)</div>
                          
                          {/* Modifiers line */}
                          <div className="absolute top-full left-[20%] w-0.5 h-10 bg-black rotate-[25deg] origin-top" />
                          <div className="absolute top-full left-[20%] text-[9px] font-black text-stone-600 rotate-[25deg] translate-x-2 translate-y-3 whitespace-nowrap">
                            a <span className="text-[7px] text-stone-400 font-bold">(article)</span>
                          </div>

                          <div className="absolute top-full left-[60%] w-0.5 h-10 bg-black rotate-[25deg] origin-top" />
                          <div className="absolute top-full left-[60%] text-[9px] font-black text-stone-600 rotate-[25deg] translate-x-2 translate-y-3 whitespace-nowrap">
                            shiny <span className="text-[7px] text-stone-400 font-bold">(adjective)</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-10"></div> {/* Spacing for modifiers */}
                    </div>
                  )}

                  {activeSentenceId === 'sentence_2' && (
                    <div className="font-mono text-xs">
                      {/* Baseline */}
                      <div className="flex items-center justify-center border-b-4 border-black pb-0.5 px-4 relative">
                        {/* Subject */}
                        <div className="px-10 py-1 font-black text-black">
                          They
                          <div className="text-[8px] font-bold text-stone-400 text-center uppercase tracking-wider mt-0.5">Subject (Pronoun)</div>
                        </div>
                        {/* Vertical line separator for Subject/Verb */}
                        <div className="absolute top-0 bottom-[-4px] w-1 bg-black left-[45%]" />
                        
                        {/* Verb */}
                        <div className="px-10 py-1 font-black text-neo-blue relative">
                          run
                          <div className="text-[8px] font-bold text-stone-400 text-center uppercase tracking-wider mt-0.5">Verb (Intransitive)</div>
                          
                          {/* Preposition Phrase hanging under Verb */}
                          <div className="absolute top-full left-[30%] w-0.5 h-10 bg-black rotate-[30deg] origin-top" />
                          <div className="absolute top-full left-[30%] text-[9px] font-black text-stone-600 rotate-[30deg] translate-x-1.5 translate-y-2 whitespace-nowrap">
                            to <span className="text-[7px] text-stone-400 font-bold">(prep)</span>
                          </div>

                          <div className="absolute top-full left-[35%] translate-x-6 translate-y-6 flex items-center border-b-2 border-black pb-0.5">
                            <span className="font-black px-2">park</span>
                            <span className="text-[7px] text-stone-400 font-bold">(obj-prep)</span>

                            {/* Modifier under park */}
                            <div className="absolute top-full left-[20%] w-0.5 h-8 bg-black rotate-[25deg] origin-top" />
                            <div className="absolute top-full left-[20%] text-[8px] font-black text-stone-500 rotate-[25deg] translate-x-1.5 translate-y-1.5 whitespace-nowrap">
                              the <span className="text-[6px] text-stone-400">(article)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="h-12"></div> {/* Spacing for modifiers */}
                    </div>
                  )}

                  {activeSentenceId === 'sentence_3' && (
                    <div className="font-mono text-xs">
                      {/* Baseline */}
                      <div className="flex items-center justify-center border-b-4 border-black pb-0.5 px-4 relative">
                        {/* Subject */}
                        <div className="px-8 py-1 font-black text-black relative">
                          student
                          <div className="text-[8px] font-bold text-stone-400 text-center uppercase tracking-wider mt-0.5">Subject (Noun)</div>

                          {/* Modifiers under Subject */}
                          <div className="absolute top-full left-[10%] w-0.5 h-10 bg-black rotate-[25deg] origin-top" />
                          <div className="absolute top-full left-[10%] text-[9px] font-black text-stone-600 rotate-[25deg] translate-x-2 translate-y-3 whitespace-nowrap">
                            The <span className="text-[7px] text-stone-400 font-bold">(article)</span>
                          </div>

                          <div className="absolute top-full left-[50%] w-0.5 h-10 bg-black rotate-[25deg] origin-top" />
                          <div className="absolute top-full left-[50%] text-[9px] font-black text-stone-600 rotate-[25deg] translate-x-2 translate-y-3 whitespace-nowrap">
                            happy <span className="text-[7px] text-stone-400 font-bold">(adjective)</span>
                          </div>
                        </div>
                        {/* Vertical line separator for Subject/Verb */}
                        <div className="absolute top-0 bottom-[-4px] w-1 bg-black left-[36%]" />
                        
                        {/* Verb */}
                        <div className="px-8 py-1 font-black text-neo-green">
                          does
                          <div className="text-[8px] font-bold text-stone-400 text-center uppercase tracking-wider mt-0.5">Verb (Transitive)</div>
                        </div>
                        {/* Half-length vertical line separator for Verb/Direct Object */}
                        <div className="absolute top-0 bottom-0 w-1 bg-black left-[68%]" />

                        {/* Direct Object */}
                        <div className="px-8 py-1 font-black text-black">
                          homework
                          <div className="text-[8px] font-bold text-stone-400 text-center uppercase tracking-wider mt-0.5">Direct Object (Noun)</div>
                        </div>
                      </div>
                      <div className="h-10"></div> {/* Spacing for modifiers */}
                    </div>
                  )}

                </div>
              )}

              {/* 2. CHOMSKY-STYLE SYNTAX CONSTITUENT TREE */}
              {diagramMode === 'syntax_tree' && (
                <div className="flex flex-col items-center justify-center py-2 select-none font-mono text-xs text-black min-w-[480px]">
                  <p className="text-[9px] font-black text-stone-500 uppercase mb-4">
                    Our Sentence split into Nouns and Verbs! 🌳
                  </p>

                  <div className="border-2 border-black bg-white p-4 shadow-neo-sm w-full max-w-xl">
                    {/* Level 1: Sentence Root */}
                    <div className="flex flex-col items-center">
                      <div className="bg-black text-white px-3 py-0.5 font-bold rounded-none text-[10px]">S (Sentence)</div>
                      <div className="text-stone-400 text-xs">┌────────┴────────┐</div>
                    </div>

                    {/* Level 2: NP and VP */}
                    <div className="grid grid-cols-2 gap-4 mt-1">
                      {/* Left NP branch */}
                      <div className="flex flex-col items-center border-r border-dashed border-stone-200">
                        <div className="bg-neo-blue text-white px-2.5 py-0.5 font-bold rounded-none text-[9px]">NP (Noun Phrase)</div>
                        
                        {activeSentenceId === 'sentence_1' && (
                          <div className="flex flex-col items-center mt-2">
                            <div className="text-stone-400 text-xs">│</div>
                            <div className="bg-stone-100 border border-black px-2 py-0.5 text-[8px] font-black mt-1">PRON</div>
                            <div className="font-bold text-stone-800 text-xs mt-1 italic">She</div>
                          </div>
                        )}

                        {activeSentenceId === 'sentence_2' && (
                          <div className="flex flex-col items-center mt-2">
                            <div className="text-stone-400 text-xs">│</div>
                            <div className="bg-stone-100 border border-black px-2 py-0.5 text-[8px] font-black mt-1">PRON</div>
                            <div className="font-bold text-stone-800 text-xs mt-1 italic">They</div>
                          </div>
                        )}

                        {activeSentenceId === 'sentence_3' && (
                          <div className="flex flex-col items-center mt-1 w-full">
                            <div className="text-stone-400 text-xs text-center w-full">┌───────┼───────┐</div>
                            <div className="grid grid-cols-3 gap-1 w-full text-center">
                              <div className="flex flex-col items-center">
                                <span className="bg-stone-100 border border-black px-1 py-0.2 text-[8px] font-black scale-90">DET</span>
                                <span className="text-[10px] font-bold text-stone-700 italic mt-0.5">The</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="bg-stone-100 border border-black px-1 py-0.2 text-[8px] font-black scale-90">ADJ</span>
                                <span className="text-[10px] font-bold text-stone-700 italic mt-0.5">happy</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="bg-stone-100 border border-black px-1 py-0.2 text-[8px] font-black scale-90">NOUN</span>
                                <span className="text-[10px] font-bold text-stone-700 italic mt-0.5">student</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right VP branch */}
                      <div className="flex flex-col items-center">
                        <div className="bg-neo-coral text-white px-2.5 py-0.5 font-bold rounded-none text-[9px]">VP (Verb Phrase)</div>
                        
                        {activeSentenceId === 'sentence_1' && (
                          <div className="flex flex-col items-center mt-1 w-full">
                            <div className="text-stone-400 text-xs text-center w-full">┌───────┴───────┐</div>
                            <div className="grid grid-cols-2 gap-2 w-full text-center">
                              <div className="flex flex-col items-center">
                                <span className="bg-stone-100 border border-black px-1.5 py-0.5 text-[8px] font-black">VERB</span>
                                <span className="text-[11px] font-bold text-stone-800 italic mt-1">has</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="bg-neo-blue/20 border border-black px-1.5 py-0.5 text-[8px] font-black">NP</span>
                                <div className="text-stone-300 text-[10px] leading-none my-0.5">┌──┼──┐</div>
                                <div className="flex gap-1 text-[8px] font-bold text-stone-600 italic">
                                  <span>a</span>
                                  <span>shiny</span>
                                  <span>star</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeSentenceId === 'sentence_2' && (
                          <div className="flex flex-col items-center mt-1 w-full">
                            <div className="text-stone-400 text-xs text-center w-full">┌───────┴───────┐</div>
                            <div className="grid grid-cols-2 gap-2 w-full text-center">
                              <div className="flex flex-col items-center">
                                <span className="bg-stone-100 border border-black px-1.5 py-0.5 text-[8px] font-black">VERB</span>
                                <span className="text-[11px] font-bold text-stone-800 italic mt-1">run</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="bg-neo-yellow/30 border border-black px-1.5 py-0.5 text-[8px] font-black">PP</span>
                                <div className="text-stone-300 text-[10px] leading-none my-0.5">┌──┴──┐</div>
                                <div className="flex gap-1 text-[8px] font-bold text-stone-600 italic">
                                  <span>to</span>
                                  <span>the park</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {activeSentenceId === 'sentence_3' && (
                          <div className="flex flex-col items-center mt-1 w-full">
                            <div className="text-stone-400 text-xs text-center w-full">┌───────┴───────┐</div>
                            <div className="grid grid-cols-2 gap-2 w-full text-center">
                              <div className="flex flex-col items-center">
                                <span className="bg-stone-100 border border-black px-1.5 py-0.5 text-[8px] font-black">VERB</span>
                                <span className="text-[11px] font-bold text-stone-800 italic mt-1">does</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="bg-stone-100 border border-black px-1.5 py-0.5 text-[8px] font-black">NOUN</span>
                                <span className="text-[11px] font-bold text-stone-800 italic mt-1">homework</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* 3. PARTS OF SPEECH LEXICAL PARSER */}
              {diagramMode === 'parser' && (
                <div className="flex flex-col md:flex-row gap-4 items-stretch py-2">
                  {/* Left: Sentence Clickable words */}
                  <div className="flex-1 flex flex-col justify-center bg-white border-2 border-black p-3.5 shadow-neo-sm">
                    <p className="text-[9px] font-mono font-black text-stone-500 uppercase mb-3">
                      Tap any word to see what job it does! 🔍
                    </p>
                    
                    <div className="flex flex-wrap gap-2 items-center justify-center py-4">
                      {activeSentenceObj.words.map((word, idx) => {
                        const isSelected = selectedWordIdx === idx;
                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              audio.playTick();
                              setSelectedWordIdx(idx);
                            }}
                            className={`px-3 py-2 border-2 border-black text-xs font-mono font-black tracking-wide transition cursor-pointer ${
                              isSelected 
                                ? 'bg-black text-white scale-105' 
                                : 'bg-stone-50 text-black hover:bg-stone-100'
                            }`}
                          >
                            {word.text}
                          </button>
                        );
                      })}
                    </div>

                    <div className="text-center mt-2">
                      <p className="text-[10px] font-bold text-stone-600">
                        Our Sentence: <span className="font-mono text-neo-coral">{activeSentenceObj.text}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Detailed syntactic card of selected word */}
                  <div className="w-full md:w-64 bg-white border-2 border-black p-3 shadow-neo-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b-2 border-black pb-1.5 mb-2">
                        <span className="font-mono font-black text-xs text-black uppercase">
                          Word Job Analysis
                        </span>
                        <span className="text-[8px] font-black font-mono bg-neo-yellow text-black border border-black px-1.5">
                          TYPE: {selectedWordObj.pos}
                        </span>
                      </div>

                      <div className="mb-2">
                        <span className="text-[9px] font-mono font-black text-stone-400 block uppercase">THE WORD</span>
                        <h4 className="font-display font-black text-base text-neo-coral italic">
                          "{selectedWordObj.text}"
                        </h4>
                      </div>

                      <div className="mb-2">
                        <span className="text-[9px] font-mono font-black text-stone-400 block uppercase">WHAT IT DOES</span>
                        <p className="text-[11px] font-black text-black uppercase leading-tight">
                          {selectedWordObj.role}
                        </p>
                      </div>

                      <div>
                        <span className="text-[9px] font-mono font-black text-stone-400 block uppercase">FUN DETAIL</span>
                        <p className="text-[10px] font-bold text-stone-700 leading-relaxed">
                          {selectedWordObj.details}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-black/10 text-right">
                      <span className="text-[8px] font-mono text-stone-400 font-bold italic">
                        Word {selectedWordIdx + 1} of {activeSentenceObj.words.length}
                      </span>
                    </div>
                  </div>

                </div>
              )}

            </div>

            <div className="mt-4 pt-3 border-t-2 border-black/15 flex items-center justify-between">
              <p className="text-[9px] font-bold text-stone-600 font-mono">
                🗺️ GRAPH: Fully accurate, 100% correct linguistic parses. S - Sentence, NP - Noun Phrase, VP - Verb Phrase, PP - Prepositional Phrase.
              </p>
              
              <button
                onClick={() => { audio.playTick(); setActiveTab('podium'); }}
                className="px-4 py-1.5 bg-[#00FF00] text-black border-2 border-black font-mono font-black text-[9px] uppercase tracking-wider transition flex items-center gap-1 shadow-neo-sm hover:translate-y-[1px]"
              >
                Go to Celebration Awards <ArrowRight size={10} />
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: PODIUM & STAR PUPILS (CELEBRATION!) */}
        {activeTab === 'podium' && (
          <div className="animate-scale-up flex flex-col items-center">
            {/* Podium Display (Top 3) */}
            <div className="w-full max-w-2xl grid grid-cols-3 gap-3 items-end mt-2 px-2">
              
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
            <div className="w-full max-w-4xl bg-white border-4 border-black p-3 mt-4 shadow-neo text-left">
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
          </div>
        )}

      </div>

      {/* Primary Reset presentation button */}
      <div className="z-20 mt-5 pb-1 flex gap-3">
        <button
          onClick={() => {
            audio.playSuccess();
            onRestart();
          }}
          className="px-4 py-2.5 bg-neo-coral hover:bg-rose-400 text-white font-black border-4 border-black shadow-neo hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-none uppercase text-xs tracking-wider inline-flex items-center gap-1.5 transition cursor-pointer animate-pulse"
        >
          <RefreshCw size={12} className="stroke-[3]" /> Restart Slides Class
        </button>
      </div>

    </div>
  );
}
