/**
 * SpurTalk Design Tokens
 * 
 * Central source of truth for design constants.
 * These enforce psychological safety principles throughout the app.
 */

// ========================================
// FORBIDDEN PATTERNS
// ========================================

/**
 * Colors that should NEVER appear in the UI
 * These are considered psychologically unsafe
 */
export const FORBIDDEN_COLORS = [
  "#FF0000", // Pure red // design-ignore
  "#DC2626", // Tailwind red-600 // design-ignore
  "#EF4444", // Tailwind red-500 // design-ignore
  "#B91C1C", // Tailwind red-700 // design-ignore
  "#FFFFFF", // Pure white (as full backgrounds) // design-ignore
] as const;

/**
 * Words that should NEVER appear in the UI
 * These create shame and anxiety
 */
export const FORBIDDEN_WORDS = [
  "Overdue", // design-ignore
  "Late", // design-ignore
  "Urgent", // design-ignore
  "Failed",
  "Error",
  "Deadline missed",
  "Behind schedule",
  "You forgot",
  "You should have",
  "Warning:",
  "Alert:",
] as const;

// ========================================
// EFFORT LEVELS
// ========================================

export const EFFORT_LEVELS = [
  "Tiny",   // ~5 minutes
  "Small",  // ~15 minutes
  "Medium", // ~30 minutes
  "Big",    // ~1 hour+
] as const;

export type EffortLevel = typeof EFFORT_LEVELS[number];

export const EFFORT_DESCRIPTIONS: Record<EffortLevel, string> = {
  Tiny: "Quick win, under 5 minutes",
  Small: "A focused sprint, about 15 minutes",
  Medium: "Solid chunk of work, around 30 minutes",
  Big: "Deep work session, an hour or more",
};

export const EFFORT_COLORS: Record<EffortLevel, string> = {
  Tiny: "bg-success/20 text-success",
  Small: "bg-primary/20 text-primary",
  Medium: "bg-secondary/20 text-secondary",
  Big: "bg-attention/20 text-attention",
};

// ========================================
// EMOTIONAL TAGS
// ========================================

export const EMOTIONAL_TAGS = [
  "Boring",  // Mundane but necessary
  "Scary",   // Anxiety-inducing
  "Fun",     // Enjoyable
] as const;

export type EmotionalTag = typeof EMOTIONAL_TAGS[number];

export const EMOTIONAL_TAG_ICONS: Record<EmotionalTag, string> = {
  Boring: "😴",
  Scary: "😰",
  Fun: "🎉",
};

// ========================================
// FUZZY DEADLINES
// ========================================

export const FUZZY_DEADLINES = [
  "Soon",       // Next few days
  "This Week",  // Within the week
  "Eventually", // No pressure
] as const;

export type FuzzyDeadline = typeof FUZZY_DEADLINES[number];

export const FUZZY_DEADLINE_DESCRIPTIONS: Record<FuzzyDeadline, string> = {
  Soon: "In the next few days",
  "This Week": "Sometime this week",
  Eventually: "When the time is right",
};

// ========================================
// MOOD OPTIONS
// ========================================

export const MOOD_OPTIONS = [
  "Energized",
  "Low energy",
  "Creative",
  "Need a win",
] as const;

export type MoodOption = typeof MOOD_OPTIONS[number];

export const MOOD_ICONS: Record<MoodOption, string> = {
  Energized: "⚡",
  "Low energy": "🌙",
  Creative: "🎨",
  "Need a win": "🏆",
};

export const MOOD_DESCRIPTIONS: Record<MoodOption, string> = {
  Energized: "Ready to tackle something challenging",
  "Low energy": "Looking for easy, gentle tasks",
  Creative: "In the mood for something expressive",
  "Need a win": "Want a quick accomplishment",
};

// ========================================
// SWIPE DIRECTIONS
// ========================================

export const SWIPE_DIRECTIONS = ["right", "left", "down"] as const;

export type SwipeDirection = typeof SWIPE_DIRECTIONS[number];

export const SWIPE_ACTIONS: Record<SwipeDirection, { label: string; description: string }> = {
  right: { label: "Focus Now", description: "Start working on this task" },
  left: { label: "Later", description: "Move to the back of the deck" },
  down: { label: "Stuck", description: "Get help breaking this down" },
};

// ========================================
// TOAST VARIANTS (No error variant!)
// ========================================

export const TOAST_VARIANTS = ["success", "info", "attention"] as const;

export type ToastVariant = typeof TOAST_VARIANTS[number];

// ========================================
// TIME-BASED GREETINGS
// ========================================

export function getGreeting(hour: number, userName?: string): string {
  const name = userName ? `, ${userName}` : "";

  if (hour >= 5 && hour < 12) {
    return `Good morning${name}! Ready for a small step?`;
  } else if (hour >= 12 && hour < 17) {
    return `Good afternoon${name}! What shall we tackle?`;
  } else if (hour >= 17 && hour < 21) {
    return `Good evening${name}! Time for a gentle task?`;
  } else {
    return `Hey there${name}! One thing at a time.`;
  }
}

// ========================================
// FRIENDLY ERROR MESSAGES
// ========================================

export const FRIENDLY_ERRORS = {
  invalidCredentials: "Let's try that again - something didn't match. No worries!",
  networkError: "We're having trouble connecting. Your credentials are safe!",
  passwordMismatch: "Those passwords don't quite match - let's try again!",
  emailTaken: "Looks like you already have an account! Try signing in instead.",
  weakPassword: "Let's make that password a bit stronger for your security.",
  genericError: "Something unexpected happened. Let's take a breath and try again.",
  sessionExpired: "Your session took a little nap. Let's sign in again.",
  notFound: "We couldn't find what you're looking for. Maybe it moved?",
} as const;

// ========================================
// NAVIGATION ITEMS
// ========================================

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { label: "Deck", href: "/deck", icon: "Layers" },
  { label: "Timeline", href: "/timeline", icon: "Calendar" },
  { label: "Garden", href: "/garden", icon: "Flower" },
  { label: "Documents", href: "/documents", icon: "FileText" },
] as const;

export const USER_MENU_ITEMS = [
  { label: "Profile", href: "/settings/profile", icon: "User" },
  { label: "Settings", href: "/settings", icon: "Settings" },
  { label: "Help", href: "/help", icon: "HelpCircle" },
  { label: "Logout", href: "/logout", icon: "LogOut", variant: "destructive" as const },
] as const;

// ========================================
// LOADING MESSAGES
// ========================================

export const LOADING_MESSAGES = [
  "Still working on it...",
  "Almost there...",
  "Good things take time...",
  "Just a moment...",
  "Preparing something nice...",
] as const;

export function getRandomLoadingMessage(): string {
  return LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
}

// ========================================
// CELEBRATION MESSAGES
// ========================================

export const CELEBRATION_MESSAGES = [
  "You did it! 🎉",
  "Amazing work! ✨",
  "One step closer! 🌱",
  "Look at you go! 🚀",
  "That's a win! 🏆",
] as const;

export function getRandomCelebration(): string {
  return CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];
}
