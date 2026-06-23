import { SpeakingPrompt, QuizQuestion } from '../types';

// Activity 1: Solo Pronoun Safari
export const SOLO_PROMPTS: SpeakingPrompt[] = [
  {
    id: 'solo_safari_1',
    title: 'Spot the Pronoun! 🦁',
    description: 'Help the safari team! Swap their names for He, She, It, or They.',
    level: 'Kid Friendly',
    topic: 'Pronouns',
    format: 'solo',
    visualHint: '🦁',
    guidelines: [
      'Sarah the guide 🧑‍🌾 ➔ [She / They] is very friendly!',
      'Cute baby elephant 🐘 ➔ [It / He] is splashing water!',
      'Two tall giraffes 🦒🦒 ➔ [They / It] are eating leaves!'
    ]
  }
];

// Activity 2: Pairs Is or Are Safari
export const PAIRS_PROMPTS: SpeakingPrompt[] = [
  {
    id: 'pairs_safari_1',
    title: 'Is or Are! 🦒',
    description: 'Practice using Is (one animal) and Are (many animals) with your partner.',
    level: 'Kid Friendly',
    topic: 'Is vs. Are',
    format: 'pairs',
    visualHint: '🦒',
    guidelines: [
      'A: "Is the tall giraffe eating leaves? 🦒"',
      'B: "Yes, it is!"',
      'A: "Are the playful monkeys jumping? 🐒"',
      'B: "Yes, they are!"'
    ]
  }
];

// Activity 3: Groups Has or Have Team
export const GROUPS_PROMPTS: SpeakingPrompt[] = [
  {
    id: 'group_safari_1',
    title: 'Has or Have! 🐘',
    description: 'Take turns describing what the safari animals have.',
    level: 'Kid Friendly',
    topic: 'Has vs. Have',
    format: 'group',
    visualHint: '🐘',
    guidelines: [
      'Student A: "The elephant 🐘 has a long trunk!"',
      'Student B: "The zebras 🦓 have cool stripes!"',
      'Student C: "The parrot 🦜 has colorful feathers!"',
      'Student D: "We have fun binoculars! 🧑‍🌾"'
    ]
  }
];

// Activity 4: Jungle Routines - Do or Does
export const DO_DOES_SAFARI_PROMPTS = [
  {
    id: 'do_does_1',
    title: 'Do or Does! 🐨',
    description: 'Ask questions about wild animal habits.',
    guidelines: [
      'Student A: "Does the little koala sleep? 🐨"',
      'Student B: "Yes, it does!"',
      'Student C: "Do the happy lions hunt? 🦁"',
      'Student D: "Yes, they do!"'
    ]
  }
];

// Activity 5: Action Verbs Suffix
export const VERB_SUFFIX_SAFARI_PROMPTS = [
  {
    id: 'suffix_1',
    title: 'Cheetah Action Suffix! 🐆',
    description: 'Add -s for ONE animal. Keep it normal for MANY.',
    guidelines: [
      'Student A: "One quick cheetah 🐆 runs fast! (runs)"',
      'Student B: "Three green frogs 🐸 jump high! (jump)"',
      'Student C: "One silly monkey 🐒 climbs the vine! (climbs)"',
      'Student D: "Parrots 🦜 sing lovely songs! (sing)"'
    ]
  }
];

// 5 child-friendly animal safari quiz questions
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q_safari_1',
    question: 'The big lions are sleeping. Which pronoun replaces "The big lions"? 🦁',
    options: ['He', 'It', 'She', 'They'],
    correctIndex: 3,
    explanation: 'For more than one lion, we say "They".',
    emojiHint: '🦁🦁'
  },
  {
    id: 'q_safari_2',
    question: 'Complete the sentence: "The baby giraffe _______ very tall." 🦒',
    options: ['am', 'is', 'are', 'be'],
    correctIndex: 1,
    explanation: 'For one giraffe, we use "is".',
    emojiHint: '🦒'
  },
  {
    id: 'q_safari_3',
    question: 'Complete the sentence: "The birds _______ colorful wings." 🦜',
    options: ['has', 'have', 'having', 'haves'],
    correctIndex: 1,
    explanation: '"The birds" is more than one, so we use "have".',
    emojiHint: '🦅'
  },
  {
    id: 'q_safari_4',
    question: 'Choose the correct word: "_______ the monkey like bananas?" 🐒',
    options: ['Do', 'Does', 'Doing', 'Done'],
    correctIndex: 1,
    explanation: 'For one monkey ("It"), we start with "Does".',
    emojiHint: '🍌'
  },
  {
    id: 'q_safari_5',
    question: 'Which sentence is correct? ⭐',
    options: [
      'The cheetah run fast.',
      'The cheetah runs fast.',
      'The cheetahs runs fast.',
      'The cheetah running fast.'
    ],
    correctIndex: 1,
    explanation: 'One cheetah "runs" (add -s).',
    emojiHint: '🐆'
  }
];
