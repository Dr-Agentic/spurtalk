import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MoodOption = "Energized" | "LowEnergy" | "Creative" | "NeedWin";

export interface Task {
    id: string;
    title: string;
    description?: string;
    effort: "Tiny" | "Small" | "Medium" | "Big";
    emotionalTag?: "Boring" | "Scary" | "Fun";
    fuzzyDeadline: "Soon" | "ThisWeek" | "Eventually";
    compellingEvent?: string;
}

export interface DashboardStats {
    streak: number;
    todayWins: number;
    gardenGrowth: number;
}

interface DashboardState {
    currentMood: MoodOption | null;
    primaryTask: Task | null;
    stats: DashboardStats;
    isTimerActive: boolean;
    timerSeconds: number;
}

interface DashboardActions {
    setMood: (mood: MoodOption | null) => void;
    setPrimaryTask: (task: Task | null) => void;
    startTimer: (seconds?: number) => void;
    pauseTimer: () => void;
    resetTimer: () => void;
    decrementTimer: () => void;
    completeTask: () => void;
    skipTask: () => void;
    incrementStats: (field: keyof DashboardStats) => void;
}

type DashboardStore = DashboardState & DashboardActions;

const DEFAULT_TIMER_SECONDS = 2 * 60; // 2 minutes

export const useDashboardStore = create<DashboardStore>()(
    persist(
        (set, get) => ({
            // Initial state
            currentMood: null,
            primaryTask: null,
            stats: {
                streak: 0,
                todayWins: 0,
                gardenGrowth: 0,
            },
            isTimerActive: false,
            timerSeconds: DEFAULT_TIMER_SECONDS,

            // Actions
            setMood: (mood) => set({ currentMood: mood }),

            setPrimaryTask: (task) => set({ primaryTask: task }),

            startTimer: (seconds = DEFAULT_TIMER_SECONDS) =>
                set({ isTimerActive: true, timerSeconds: seconds }),

            pauseTimer: () => set({ isTimerActive: false }),

            resetTimer: () =>
                set({ isTimerActive: false, timerSeconds: DEFAULT_TIMER_SECONDS }),

            decrementTimer: () => {
                const { timerSeconds, isTimerActive } = get();
                if (isTimerActive && timerSeconds > 0) {
                    set({ timerSeconds: timerSeconds - 1 });
                } else if (timerSeconds <= 0) {
                    set({ isTimerActive: false });
                }
            },

            completeTask: () => {
                const { stats } = get();
                set({
                    primaryTask: null,
                    stats: {
                        ...stats,
                        todayWins: stats.todayWins + 1,
                        gardenGrowth: stats.gardenGrowth + 1,
                    },
                    isTimerActive: false,
                    timerSeconds: DEFAULT_TIMER_SECONDS,
                });
            },

            skipTask: () => {
                set({
                    primaryTask: null,
                    isTimerActive: false,
                    timerSeconds: DEFAULT_TIMER_SECONDS,
                });
            },

            incrementStats: (field) => {
                const { stats } = get();
                set({
                    stats: {
                        ...stats,
                        [field]: stats[field] + 1,
                    },
                });
            },
        }),
        {
            name: "spurtalk-dashboard",
            partialize: (state) => ({
                currentMood: state.currentMood,
                stats: state.stats,
            }),
        }
    )
);

export default useDashboardStore;
