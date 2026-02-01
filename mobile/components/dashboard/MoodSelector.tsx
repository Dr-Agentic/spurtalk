/**
 * MoodSelector - Mood selection for filtering/prioritizing tasks
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../lib/theme';
import { MOOD_OPTIONS, MIN_TOUCH_TARGET } from '../../lib/design-tokens';
import { useDashboardStore } from '../../lib/store/dashboard-store';
import { hapticButtonPress } from '../../lib/haptics';
import type { MoodOption } from '../../types';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface MoodButtonProps {
    mood: MoodOption;
    isSelected: boolean;
    onPress: () => void;
}

function MoodButton({ mood, isSelected, onPress }: MoodButtonProps): React.ReactElement {
    const { theme } = useTheme();
    const scale = useSharedValue(1);

    const handlePress = (): void => {
        scale.value = withSpring(0.95, {}, () => {
            scale.value = withSpring(1);
        });
        hapticButtonPress();
        onPress();
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const getMoodEmoji = (): string => {
        switch (mood) {
            case 'Energized':
                return '⚡';
            case 'Low energy':
                return '🌙';
            case 'Creative':
                return '🎨';
            case 'Need a win':
                return '🏆';
            default:
                return '✨';
        }
    };

    return (
        <AnimatedTouchable
            style={[
                styles.moodButton,
                {
                    backgroundColor: isSelected
                        ? theme.colors.primary + '20'
                        : theme.colors.neutralElevated,
                    borderColor: isSelected
                        ? theme.colors.primary
                        : 'transparent',
                },
                animatedStyle,
            ]}
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`${mood} mood`}
        >
            <Text style={styles.emoji}>{getMoodEmoji()}</Text>
            <Text
                style={[
                    styles.moodText,
                    {
                        color: isSelected
                            ? theme.colors.primary
                            : theme.colors.textPrimary,
                    },
                ]}
            >
                {mood}
            </Text>
        </AnimatedTouchable>
    );
}

export function MoodSelector(): React.ReactElement {
    const { theme } = useTheme();
    const currentMood = useDashboardStore((state) => state.currentMood);
    const setMood = useDashboardStore((state) => state.setMood);

    const handleMoodSelect = (mood: MoodOption): void => {
        if (currentMood === mood) {
            setMood(null); // Deselect if already selected
        } else {
            setMood(mood);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.question, { color: theme.colors.textPrimary }]}>
                How are you feeling?
            </Text>
            <View style={styles.buttons}>
                {MOOD_OPTIONS.map((mood) => (
                    <MoodButton
                        key={mood}
                        mood={mood as MoodOption}
                        isSelected={currentMood === mood}
                        onPress={() => handleMoodSelect(mood as MoodOption)}
                    />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    question: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 16,
    },
    buttons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    moodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 2,
        minHeight: MIN_TOUCH_TARGET,
        gap: 8,
    },
    emoji: {
        fontSize: 20,
    },
    moodText: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export default MoodSelector;
