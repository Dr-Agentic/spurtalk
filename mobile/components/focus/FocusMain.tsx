/**
 * FocusMain - Task title and nano-step in cinema mode
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '../../lib/theme';
import { NanoStepList } from '../shared/NanoStepList';
import type { NanoStep } from '../../types';
import type { Task } from '@spurtalk/shared';

interface FocusMainProps {
    task: Task;
    nanoSteps: NanoStep[];
    onStepComplete: (stepId: string) => void;
}

export function FocusMain({
    task,
    nanoSteps,
    onStepComplete,
}: FocusMainProps): React.ReactElement {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <Animated.View entering={FadeIn.duration(500)}>
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                    {task.title}
                </Text>
            </Animated.View>

            <View style={styles.stepsContainer}>
                <NanoStepList
                    steps={nanoSteps}
                    showOne
                    cinemaMode
                    onStepComplete={onStepComplete}
                />
            </View>

            {task.compellingEvent && (
                <Text style={[styles.compellingEvent, { color: theme.colors.sage500 }]}>
                    {task.compellingEvent}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 36,
    },
    stepsContainer: {
        minHeight: 150,
        justifyContent: 'center',
    },
    compellingEvent: {
        fontSize: 14,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 24,
    },
});

export default FocusMain;
