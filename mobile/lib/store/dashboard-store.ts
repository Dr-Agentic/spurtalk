/**
 * Dashboard store for managing home screen state
 */

import { create } from 'zustand';
import { Task } from '@spurtalk/shared';
import type { MoodOption } from '../../types';

interface DashboardStats {
    streak: number;
    todayWins: number;
    gardenGrowth: number;
}

interface DashboardState {
    currentMood: MoodOption | null;
    primaryTask: Task | null;
    stats: DashboardStats;
    isLoading: boolean;

    // Actions
    setMood: (mood: MoodOption | null) => void;
    setPrimaryTask: (task: Task | null) => void;
    setStats: (stats: DashboardStats) => void;
    setLoading: (loading: boolean) => void;
    refreshDashboard: () => Promise<void>;
}

const initialStats: DashboardStats = {
    streak: 0,
    todayWins: 0,
    gardenGrowth: 0,
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
    currentMood: null,
    primaryTask: null,
    stats: initialStats,
    isLoading: false,

    setMood: (mood) => set({ currentMood: mood }),

    setPrimaryTask: (task) => set({ primaryTask: task }),

    setStats: (stats) => set({ stats }),

    setLoading: (loading) => set({ isLoading: loading }),

    refreshDashboard: async () => {
        set({ isLoading: true });
        try {
            // In production, this would fetch from API
            // For now, we'll just simulate a refresh
            await new Promise((resolve) => setTimeout(resolve, 500));

            // Stats would come from API
            // set({ stats: fetchedStats, primaryTask: fetchedTask });
        } catch (error) {
            console.error('Failed to refresh dashboard:', error);
        } finally {
            set({ isLoading: false });
        }
    },
}));

export default useDashboardStore;
