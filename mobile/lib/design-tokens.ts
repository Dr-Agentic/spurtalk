/**
 * Design token constants for SpurTalk Mobile App
 * These constants enforce the psychological safety design system
 */

// Colors that should NEVER be used in the app
export const FORBIDDEN_COLORS = [
    '#FF0000', // Pure red // design-ignore
    '#DC2626', // Red-600 // design-ignore
    '#EF4444', // Red-500 // design-ignore
    '#F87171', // Red-400 // design-ignore
    '#FFFFFF', // Stark white (use neutral #faf9f7 instead) // design-ignore
] as const;

// Words that should NEVER appear in user-facing text
export const FORBIDDEN_WORDS = [
    'Failed',
    'Error',
    'Invalid',
    'Wrong',
    'Incorrect',
    'Overdue', // design-ignore
    'Late', // design-ignore
    'Urgent', // design-ignore
    'Deadline', // design-ignore
    'Warning',
    'Critical',
    'Expired',
] as const;

// Effort level options for tasks
export const EFFORT_LEVELS = ['Tiny', 'Small', 'Medium', 'Big'] as const;

// Emotional tags for tasks
export const EMOTIONAL_TAGS = ['Boring', 'Scary', 'Fun'] as const;

// Fuzzy deadline options (no exact dates)
export const FUZZY_DEADLINES = ['Soon', 'This Week', 'Eventually'] as const;

// Mood options for filtering/prioritizing tasks
export const MOOD_OPTIONS = ['Energized', 'Low energy', 'Creative', 'Need a win'] as const;

// Minimum touch target size (in pt) for accessibility
export const MIN_TOUCH_TARGET = 44;

// Animation durations (in ms)
export const ANIMATION_DURATIONS = {
    fast: 150,
    normal: 300,
    slow: 500,
} as const;

// Timer settings
export const TIMER_SETTINGS = {
    defaultMinutes: 2,
    maxMinutes: 60,
} as const;

// Card stack settings
export const CARD_STACK = {
    visibleCards: 3,
    rotationDegrees: 30,
    swipeThreshold: 0.3, // 30% of screen width
} as const;

// Blur intensities for timeline zones
export const BLUR_INTENSITIES = {
    immediate: 0,
    soon: 10,
    thisWeek: 20,
    eventually: 30,
} as const;

// Garden settings
export const GARDEN_SETTINGS = {
    flowerForTinyTask: true,
    treeForBigTask: true,
} as const;

// Dynamic greeting messages (time-based)
export const GREETINGS = {
    morning: [
        'Good morning! Ready for a small step?',
        'Rise and shine! What small win shall we tackle?',
        'Morning! Every journey starts with one step.',
    ],
    afternoon: [
        'Good afternoon! How about a quick win?',
        'Hey there! Ready for something manageable?',
        'Afternoon check-in! What feels doable right now?',
    ],
    evening: [
        'Good evening! One more small step before rest?',
        'Winding down? Let\'s tackle something gentle.',
        'Evening! Just a tiny task before calling it a day?',
    ],
} as const;

// Helper to get time-based greeting
export function getTimeBasedGreeting(): string {
    const hour = new Date().getHours();
    const greetings = hour < 12
        ? GREETINGS.morning
        : hour < 18
            ? GREETINGS.afternoon
            : GREETINGS.evening;

    return greetings[Math.floor(Math.random() * greetings.length)];
}

// Types derived from constants
export type EffortLevel = typeof EFFORT_LEVELS[number];
export type EmotionalTag = typeof EMOTIONAL_TAGS[number];
export type FuzzyDeadline = typeof FUZZY_DEADLINES[number];
export type MoodOption = typeof MOOD_OPTIONS[number];
