/**
 * Deck Screen - Card-based task swiping interface
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme';
import { CardStack } from '../../components/deck/CardStack';
import { DeckControls } from '../../components/deck/DeckControls';
import { SwipeHints } from '../../components/deck/SwipeHints';
import { UnblockerModal } from '../../components/shared/UnblockerModal';
import { LoadingState } from '../../components/ui/LoadingState';
import { useDeckStore } from '../../lib/store/deck-store';
import { api } from '../../lib/api';
import type { Task } from '@spurtalk/shared';

export default function DeckScreen(): React.ReactElement {
    const { theme } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const cards = useDeckStore((state) => state.cards);
    const currentIndex = useDeckStore((state) => state.currentIndex);
    const hasSeenHints = useDeckStore((state) => state.hasSeenHints);
    const isLoading = useDeckStore((state) => state.isLoading);
    const setCards = useDeckStore((state) => state.setCards);
    const nextCard = useDeckStore((state) => state.nextCard);
    const moveToBottom = useDeckStore((state) => state.moveToBottom);
    const dismissHints = useDeckStore((state) => state.dismissHints);
    const setLoading = useDeckStore((state) => state.setLoading);

    const [showUnblocker, setShowUnblocker] = useState(false);
    const currentTask = cards[currentIndex] || null;

    const fetchDeck = async (): Promise<void> => {
        setLoading(true);
        try {
            const { data } = await api.get<Task[]>('/tasks/deck');
            setCards(data);
        } catch (error) {
            console.error('Failed to fetch deck:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeck();
    }, []);

    const handleSwipeRight = async (): Promise<void> => {
        if (!currentTask) return;

        try {
            await api.post(`/tasks/deck/${currentTask.id}/swipe`, { direction: 'right' });
            router.push({ pathname: '/focus', params: { taskId: currentTask.id } });
        } catch (error) {
            console.error('Failed to process swipe:', error);
        }
    };

    const handleSwipeLeft = async (): Promise<void> => {
        if (!currentTask) return;

        try {
            await api.post(`/tasks/deck/${currentTask.id}/swipe`, { direction: 'left' });
            moveToBottom();
        } catch (error) {
            console.error('Failed to process swipe:', error);
        }
    };

    const handleSwipeDown = (): void => {
        setShowUnblocker(true);
    };

    if (isLoading) {
        return (
            <View
                style={[
                    styles.loadingContainer,
                    { backgroundColor: theme.colors.neutral, paddingTop: insets.top },
                ]}
            >
                <LoadingState variant="spinner" message="Loading your deck..." />
            </View>
        );
    }

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: theme.colors.neutral, paddingTop: insets.top },
            ]}
        >
            <CardStack
                cards={cards}
                currentIndex={currentIndex}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
                onSwipeDown={handleSwipeDown}
            />

            <View style={{ paddingBottom: insets.bottom }}>
                <DeckControls
                    onDoNow={handleSwipeRight}
                    onNotNow={handleSwipeLeft}
                    onBreakDown={handleSwipeDown}
                    disabled={!currentTask}
                />
            </View>

            <SwipeHints visible={!hasSeenHints} onDismiss={dismissHints} />

            <UnblockerModal
                visible={showUnblocker}
                task={currentTask}
                onClose={() => setShowUnblocker(false)}
                onStartFirstStep={() => {
                    if (currentTask) {
                        router.push({ pathname: '/focus', params: { taskId: currentTask.id } });
                    }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
