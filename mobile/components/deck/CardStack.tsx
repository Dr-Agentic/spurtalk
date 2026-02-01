/**
 * CardStack - Enhanced deck with stack preview and haptics
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import { useTheme } from '../../lib/theme';
import { TaskCard } from '../shared/TaskCard';
import { hapticSwipeComplete, hapticMediumImpact } from '../../lib/haptics';
import { CARD_STACK } from '../../lib/design-tokens';
import { useReducedMotion } from '../../lib/hooks/useReducedMotion';
import type { Task } from '@spurtalk/shared';

interface CardStackProps {
    cards: Task[];
    currentIndex: number;
    onSwipeRight: () => void;
    onSwipeLeft: () => void;
    onSwipeDown: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * CARD_STACK.swipeThreshold;

export function CardStack({
    cards,
    currentIndex,
    onSwipeRight,
    onSwipeLeft,
    onSwipeDown,
}: CardStackProps): React.ReactElement {
    const { theme } = useTheme();
    const reduceMotion = useReducedMotion();

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const handleSwipe = useCallback(
        (direction: 'right' | 'left' | 'down') => {
            hapticSwipeComplete();
            if (direction === 'right') {
                onSwipeRight();
            } else if (direction === 'left') {
                onSwipeLeft();
            } else {
                hapticMediumImpact();
                onSwipeDown();
            }
            // Reset position
            translateX.value = 0;
            translateY.value = 0;
        },
        [onSwipeRight, onSwipeLeft, onSwipeDown]
    );

    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd((event) => {
            if (event.translationX > SWIPE_THRESHOLD) {
                runOnJS(handleSwipe)('right');
            } else if (event.translationX < -SWIPE_THRESHOLD) {
                runOnJS(handleSwipe)('left');
            } else if (event.translationY > 80) {
                runOnJS(handleSwipe)('down');
            } else {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
            }
        });

    const topCardStyle = useAnimatedStyle(() => {
        const rotation = reduceMotion
            ? 0
            : interpolate(
                translateX.value,
                [-SCREEN_WIDTH, SCREEN_WIDTH],
                [-CARD_STACK.rotationDegrees, CARD_STACK.rotationDegrees],
                Extrapolation.CLAMP
            );

        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: `${rotation}deg` },
            ],
        };
    });

    const activeTask = cards[currentIndex];
    const nextCards = cards.slice(currentIndex + 1, currentIndex + CARD_STACK.visibleCards);

    if (!activeTask) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
                    All caught up! 🎉
                </Text>
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                    Come back later for more tasks.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Stack preview (cards behind) */}
            {nextCards.map((task, index) => (
                <View
                    key={task.id}
                    style={[
                        styles.stackCard,
                        {
                            backgroundColor: theme.colors.neutralElevated,
                            transform: [
                                { scale: 1 - (index + 1) * 0.05 },
                                { translateY: (index + 1) * 8 },
                            ],
                            zIndex: -index - 1,
                        },
                    ]}
                >
                    <Text
                        style={[styles.stackTitle, { color: theme.colors.textSecondary }]}
                        numberOfLines={1}
                    >
                        {task.title}
                    </Text>
                </View>
            ))}

            {/* Top card (interactive) */}
            <GestureDetector gesture={gesture}>
                <Animated.View
                    style={[
                        styles.topCard,
                        { backgroundColor: theme.colors.neutralElevated },
                        topCardStyle,
                    ]}
                >
                    <TaskCard task={activeTask} variant="default" />
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    topCard: {
        width: SCREEN_WIDTH * 0.9,
        minHeight: 400,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    stackCard: {
        position: 'absolute',
        width: SCREEN_WIDTH * 0.9,
        height: 400,
        borderRadius: 20,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stackTitle: {
        fontSize: 16,
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default CardStack;
