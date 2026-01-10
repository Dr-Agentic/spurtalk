export interface MotivationalQuote {
  id: string;
  text: string;
  author?: string;
  category: 'imperfect_action' | 'progress_over_perfection' | 'done_is_better' | 'learning_mindset';
}

export const motivationalQuotes: MotivationalQuote[] = [
  {
    id: 'imperfect_001',
    text: "Perfect is the enemy of good.",
    author: "Voltaire",
    category: 'imperfect_action'
  },
  {
    id: 'imperfect_002',
    text: "Done is better than perfect.",
    author: "Sheryl Sandberg",
    category: 'done_is_better'
  },
  {
    id: 'imperfect_003',
    text: "The best way to get something done is to begin.",
    author: "Ernest Hemingway",
    category: 'imperfect_action'
  },
  {
    id: 'progress_001',
    text: "Progress, not perfection.",
    category: 'progress_over_perfection'
  },
  {
    id: 'progress_002',
    text: "It's better to do something imperfectly than to do nothing perfectly.",
    author: "Robert Schuller",
    category: 'imperfect_action'
  },
  {
    id: 'progress_003',
    text: "Small steps in the right direction can turn out to be the biggest step of your life.",
    category: 'progress_over_perfection'
  },
  {
    id: 'done_001',
    text: "A professional is someone who does a job well even when they don't like it.",
    author: "Jodie Foster",
    category: 'done_is_better'
  },
  {
    id: 'done_002',
    text: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
    author: "Steve Jobs",
    category: 'learning_mindset'
  },
  {
    id: 'learning_001',
    text: "Done is better than perfect. Perfect is a myth.",
    category: 'done_is_better'
  },
  {
    id: 'learning_002',
    text: "Every expert was once a beginner. Every professional was once an amateur.",
    category: 'learning_mindset'
  },
  {
    id: 'learning_003',
    text: "The only real mistake is the one from which we learn nothing.",
    author: "Henry Ford",
    category: 'learning_mindset'
  },
  {
    id: 'learning_004',
    text: "Don't let perfect be the enemy of the good enough.",
    category: 'progress_over_perfection'
  }
];

export function getRandomQuote(): MotivationalQuote {
  const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
  return motivationalQuotes[randomIndex];
}

export function getQuotesByCategory(category: MotivationalQuote['category']): MotivationalQuote[] {
  return motivationalQuotes.filter(quote => quote.category === category);
}

export function getQuoteById(id: string): MotivationalQuote | undefined {
  return motivationalQuotes.find(quote => quote.id === id);
}

export function getDailyQuote(): MotivationalQuote {
  const today = new Date().toISOString().split('T')[0];
  const dayNumber = Math.floor(new Date(today).getTime() / (1000 * 60 * 60 * 24));
  const index = dayNumber % motivationalQuotes.length;
  return motivationalQuotes[index];
}

export function isGoodEnoughLabel(): string[] {
  return [
    "Good Enough",
    "Done (for now)",
    "80% is victory",
    "Progress over perfection",
    "Good-enough mode: ON",
    "Imperfect action counts!",
    "Done > Perfect"
  ];
}

export function getCompletionMessage(): string[] {
  return [
    "Great job getting started!",
    "Progress is progress, no matter how small.",
    "You're moving forward - that's what matters!",
    "Imperfect action beats perfect planning.",
    "Every step counts toward your goal.",
    "Done is better than perfect!",
    "You're building momentum - keep going!"
  ];
}

export function getRandomGoodEnoughLabel(): string {
  const labels = isGoodEnoughLabel();
  return labels[Math.floor(Math.random() * labels.length)];
}

export function getRandomCompletionMessage(): string {
  const messages = getCompletionMessage();
  return messages[Math.floor(Math.random() * messages.length)];
}