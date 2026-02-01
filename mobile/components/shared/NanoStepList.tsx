/**
 * NanoStepList - Checklist of nano-steps with cinema mode
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
} from 'react-native-reanimated';
import { useTheme } from '../../lib/theme';
import { Badge } from '../ui/Badge';
import { hapticTaskComplete } from '../../lib/haptics';
import { MIN_TOUCH_TARGET } from '../../lib/design-tokens';
import type { NanoStep } from '../../types';

interface NanoStepListProps {
    steps: NanoStep[];
    showOne?: boolean;
    cinemaMode?: boolean;
    onStepComplete?: (stepId: string) => void;
}

interface StepItemProps {
    step: NanoStep;
    cinemaMode: boolean;
    onComplete: (stepId: string) => void;
}

function StepItem({ step, cinemaMode, onComplete }: StepItemProps): React.ReactElement {
    const { theme } = useTheme();
    const scale = useSharedValue(1);

    const handlePress = (): void => {
        if (!step.completed) {
            scale.value = withSpring(1.05, {}, () => {
                scale.value = withSpring(1);
            });
            hapticTaskComplete();
            onComplete(step.id);
        }
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const containerStyle = cinemaMode
        ? {
            backgroundColor: theme.colors.neutralElevated,
            padding: 20,
            borderRadius: theme.radii.lg,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
        }
        : {
            backgroundColor: theme.colors.neutralElevated,
            padding: 12,
            borderRadius: theme.radii.md,
            marginBottom: 8,
        };

    return (
        <Animated.View style={animatedStyle}>
            <TouchableOpacity
                style={[styles.stepItem, containerStyle]}
                onPress={handlePress}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: step.completed }}
                accessibilityLabel={step.text}
            >
                <View
                    style={[
                        styles.checkbox,
                        {
                            borderColor: step.completed
                                ? theme.colors.primary
                                : theme.colors.sage500,
                            backgroundColor: step.completed
                                ? theme.colors.primary
                                : 'transparent',
                        },
                    ]}
                >
                    {step.completed && (
                        <Text style={styles.checkmark}>✓</Text>
                    )}
                </View>

                <View style={styles.stepContent}>
                    <Text
                        style={[
                            cinemaMode ? styles.stepTextCinema : styles.stepText,
                            {
                                color: step.completed
                                    ? theme.colors.sage500
                                    : theme.colors.textPrimary,
                                textDecorationLine: step.completed ? 'line-through' : 'none',
                            },
                        ]}
                    >
                        {step.text}
                    </Text>

                    {step.estimatedMinutes !== undefined && step.estimatedMinutes <= 2 && (
                        <Badge label="<2 min" size="small" variant="effort" />
                    )}
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

export function NanoStepList({
    steps,
    showOne = false,
    cinemaMode = false,
    onStepComplete,
}: NanoStepListProps): React.ReactElement {
    const { theme } = useTheme();

    const handleComplete = (stepId: string): void => {
        onStepComplete?.(stepId);
    };

    // In cinema mode with showOne, only show the first incomplete step
    const visibleSteps = showOne
        ? steps.filter((s) => !s.completed).slice(0, 1)
        : steps;

    if (cinemaMode && showOne) {
        const currentStep = visibleSteps[0];
        if (!currentStep) {
            return (
                <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                        All steps completed! 🎉
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.cinemaContainer}>
                <StepItem
                    step={currentStep}
                    cinemaMode={true}
                    onComplete={handleComplete}
                />
            </View>
        );
    }

    return (
        <FlatList
            data={visibleSteps}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <StepItem
                    step={item}
                    cinemaMode={cinemaMode}
                    onComplete={handleComplete}
                />
            )}
            contentContainerStyle={styles.listContainer}
            scrollEnabled={!showOne}
        />
    );
}

const styles = StyleSheet.create({
    listContainer: {
        padding: 16,
    },
    cinemaContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: MIN_TOUCH_TARGET,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    checkmark: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    stepContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepText: {
        fontSize: 16,
        flex: 1,
    },
    stepTextCinema: {
        fontSize: 20,
        fontWeight: '500',
        flex: 1,
        lineHeight: 28,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    emptyText: {
        fontSize: 18,
        textAlign: 'center',
    },
});

export default NanoStepList;
