/**
 * Deck store for managing card deck state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '@spurtalk/shared';

interface DeckState {
    cards: Task[];
    currentIndex: number;
    hasSeenHints: boolean;
    isLoading: boolean;

    // Actions
    setCards: (cards: Task[]) => void;
    nextCard: () => void;
    previousCard: () => void;
    moveToBottom: () => void;
    setCurrentIndex: (index: number) => void;
    dismissHints: () => void;
    setLoading: (loading: boolean) => void;
    resetDeck: () => void;
}

// Custom storage adapter for AsyncStorage
const asyncStorageAdapter = {
    getItem: async (name: string): Promise<string | null> => {
        return await AsyncStorage.getItem(name);
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await AsyncStorage.setItem(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        await AsyncStorage.removeItem(name);
    },
};

export const useDeckStore = create<DeckState>()(
    persist(
        (set, get) => ({
            cards: [],
            currentIndex: 0,
            hasSeenHints: false,
            isLoading: false,

            setCards: (cards) => set({ cards, currentIndex: 0 }),

            nextCard: () => {
                const { currentIndex, cards } = get();
                if (currentIndex < cards.length - 1) {
                    set({ currentIndex: currentIndex + 1 });
                }
            },

            previousCard: () => {
                const { currentIndex } = get();
                if (currentIndex > 0) {
                    set({ currentIndex: currentIndex - 1 });
                }
            },

            moveToBottom: () => {
                const { cards, currentIndex } = get();
                if (cards.length === 0) return;

                const currentCard = cards[currentIndex];
                const newCards = [
                    ...cards.slice(0, currentIndex),
                    ...cards.slice(currentIndex + 1),
                    currentCard,
                ];

                set({
                    cards: newCards,
                    // Keep at same index (which now shows next card)
                    currentIndex: Math.min(currentIndex, newCards.length - 1),
                });
            },

            setCurrentIndex: (index) => set({ currentIndex: index }),

            dismissHints: () => set({ hasSeenHints: true }),

            setLoading: (loading) => set({ isLoading: loading }),

            resetDeck: () => set({ cards: [], currentIndex: 0 }),
        }),
        {
            name: 'deck-storage',
            storage: createJSONStorage(() => asyncStorageAdapter),
            partialize: (state) => ({
                hasSeenHints: state.hasSeenHints,
            }),
        }
    )
);

export default useDeckStore;
