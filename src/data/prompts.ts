import { SpeakingPrompt, QuizQuestion } from '../types';

export const SOLO_PROMPTS: SpeakingPrompt[] = [
  {
    id: 'solo_1',
    title: 'Hello! This is Me!',
    description: 'Greet the class and introduce your name, age, and favorite color.',
    level: 'Starter L1',
    topic: 'My Self',
    format: 'solo',
    visualHint: '👋',
    guidelines: [
      'Hello, everyone! 🌟',
      'My name is [Name]. 📛',
      'I am [Age] years old! 🎂',
      'My favorite color is [Color]! 🎨'
    ]
  },
  {
    id: 'solo_2',
    title: 'What Is It?',
    description: 'Describe a random toy or animal of your choice.',
    level: 'Starter L1',
    topic: 'Objects & Animals',
    format: 'solo',
    visualHint: '🧸',
    guidelines: [
      'Look! This is a [cat / ball / doll]! 🧸',
      'It is [big / small / happy]! 🟢',
      'It has [two eyes / a tail]! 👀',
      'I love my [object]! ❤️'
    ]
  },
  {
    id: 'solo_3',
    title: 'My Super Family!',
    description: 'Tell your friends about a family member.',
    level: 'Starter L1',
    topic: 'My Family',
    format: 'solo',
    visualHint: '🏡',
    guidelines: [
      'This is my [mother / father / brother / sister]! 🧑‍🧑‍🧒',
      'Her/His name is [Name]. 📛',
      'She/He is very [good / happy / tall]! ✨',
      'We like [eating / playing] together! 🍕'
    ]
  },
  {
    id: 'solo_4',
    title: 'Today’s Weather',
    description: 'Look out the window and tell the class about the weather.',
    level: 'Starter L1',
    topic: 'Weather',
    format: 'solo',
    visualHint: '☀️',
    guidelines: [
      'Look at the sky! ⛅',
      'The weather is [sunny / rainy / cloudy]! 🌧️',
      'I feel [good / cold / warm]! 🥰',
      'I like [sun / rain / wind]!'
    ]
  },
  {
    id: 'solo_5',
    title: 'The Yummy Food',
    description: 'Talk about your favorite fruit or dessert.',
    level: 'Starter L1',
    topic: 'Food',
    format: 'solo',
    visualHint: '🍎',
    guidelines: [
      'My favorite food is [pizza / apple / banana]! 🍕',
      'It is [sweet / red / round]! 🔴',
      'I eat it on [Monday / every day]! 📅',
      'It is so yummy! 😋'
    ]
  }
];

export const PAIRS_PROMPTS: SpeakingPrompt[] = [
  {
    id: 'pairs_1',
    title: 'The Friendly Hello',
    description: 'Meet your partner and ask how they are today!',
    level: 'Starter L1',
    topic: 'Feelings & Greetings',
    format: 'pairs',
    visualHint: '💬',
    guidelines: [
      'A: "Hello! My name is A. What is your name?"',
      'B: "Hi A! I am B. Nice to meet you!"',
      'A: "How are you today, B?"',
      'B: "I am [happy / great / tired]! How are you?"',
      'A: "I am [happy / hungry]! Thank you!"'
    ]
  },
  {
    id: 'pairs_2',
    title: 'Pet Friends',
    description: 'Ask your partner about pets and animals.',
    level: 'Starter L1',
    topic: 'Pets',
    format: 'pairs',
    visualHint: '🦁',
    guidelines: [
      'A: "Do you like [cats / dogs / birds]?"',
      'B: "Yes, I do! They are very [cute / nice]! Do you?"',
      'A: "No, I don’t! I like [lions / rabbits] instead!"',
      'B: "Wow! [Lions] are very [big / fast]!"'
    ]
  },
  {
    id: 'pairs_3',
    title: 'Color Mixer game',
    description: 'Look at classroom items around you and ask for their colors.',
    level: 'Starter L1',
    topic: 'Colors & Objects',
    format: 'pairs',
    visualHint: '✏️',
    guidelines: [
      'A: "What is this? [point to a pencil/book]"',
      'B: "This is a [pencil]! Direct question: What color is it?"',
      'A: "It is [blue / yellow / red]!"',
      'B: "Excellent! Do you have a red pencil?"',
      'A: "Yes, I do! / No, I have a black pen."'
    ]
  },
  {
    id: 'pairs_4',
    title: 'My Favorite Hobby',
    description: 'Talk about what you love to do on weekends.',
    level: 'Starter L1',
    topic: 'Hobbies',
    format: 'pairs',
    visualHint: '⚽',
    guidelines: [
      'A: "What do you like to do?"',
      'B: "I like [playing football / swimming / drawing]! What about you?"',
      'A: "I like [singing / reading / sleeping]!"',
      'B: "Cool! Let’s play together!"'
    ]
  }
];

export const GROUPS_PROMPTS: SpeakingPrompt[] = [
  {
    id: 'group_1',
    title: 'The Word Chain Game',
    description: 'Take turns naming things that match a specific color.',
    level: 'Starter L1',
    topic: 'Group Chain',
    format: 'group',
    visualHint: '🌈',
    guidelines: [
      'Leader selects: Color is GREEN! 🟢',
      'Student A: "A watermelon is green!"',
      'Student B: "An apple is green!"',
      'Student C: "Grass is green!"'
    ]
  },
  {
    id: 'group_2',
    title: 'Show and Tell Circle',
    description: 'Each group member tells the others about something in their hands.',
    level: 'Starter L1',
    topic: 'Objects',
    format: 'group',
    visualHint: '🎒',
    guidelines: [
      'Student A: "Look, I have a [pencil / ruler]. It is grey."',
      'Student B: "I have a [backpack / phone]. It is green."',
      'Student C: "I have an [eraser]. It is white."'
    ]
  },
  {
    id: 'group_3',
    title: 'Super Action Chain',
    description: 'Command center! Person A says an action, and the others must act it out while speaking.',
    level: 'Starter L1',
    topic: 'Verbs & Play',
    format: 'group',
    visualHint: '🏃‍♂️',
    guidelines: [
      'Student A: "Jump! Everybody jump!" 🦘',
      'Students B, C: [Jumping] "We are jumping!" 🌟',
      'Student B: "Sleep! Everybody sleep!" 😴',
      'Students A, C: [Pretend sleep] "We are sleeping!"'
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q_1',
    question: 'Which of these is an ANIMAL? 🦁',
    options: ['Apple', 'Pencil', 'Elephant', 'Happy'],
    correctIndex: 2,
    explanation: 'Elephant is a huge animal with big ears!',
    emojiHint: '🐘'
  },
  {
    id: 'q_2',
    question: 'Complete: "Nice to ______ you!" 👋',
    options: ['meet', 'make', 'many', 'more'],
    correctIndex: 0,
    explanation: 'We say "Nice to meet you" when we meet a friend!',
    emojiHint: '🤝'
  },
  {
    id: 'q_3',
    question: 'What color do you get if you mix Red 🟥 and Yellow 🟨?',
    options: ['Green', 'Orange', 'Blue', 'Purple'],
    correctIndex: 1,
    explanation: 'Red and Yellow make ORANGE! 🍊',
    emojiHint: '🍊'
  },
  {
    id: 'q_4',
    question: 'Which sentence is CORRECT? ⭐',
    options: ['He like pizza.', 'He liking pizza.', 'He likes pizza.', 'He is likes pizza.'],
    correctIndex: 2,
    explanation: 'For he/she/it, we add an "s": "He likes pizza".',
    emojiHint: '🍕'
  },
  {
    id: 'q_5',
    question: 'I fly in the sky. I have colorful wings. What am I? 🦋',
    options: ['A dog', 'A butterfly', 'A fish', 'A house'],
    correctIndex: 1,
    explanation: 'A butterfly has wings and flies in the gardens!',
    emojiHint: '🦋'
  },
  {
    id: 'q_6',
    question: 'Complete: "In the morning, the sun is in the ______."',
    options: ['ground', 'sea', 'sky', 'night'],
    correctIndex: 2,
    explanation: 'We see the sun high up in the blue sky! ☀️',
    emojiHint: '☀️'
  }
];
