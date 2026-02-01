/**
 * Focus Screen - Full-screen immersive focus mode
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../lib/theme';
import { FocusHeader } from '../components/focus/FocusHeader';
import { FocusMain } from '../components/focus/FocusMain';
import { FocusControls } from '../components/focus/FocusControls';
import { UnblockerModal } from '../components/shared/UnblockerModal';
import { LoadingState } from '../components/ui/LoadingState';
import { NotificationToast } from '../components/ui/NotificationToast';
import { hapticTaskComplete } from '../lib/haptics';
import { api } from '../lib/api';
import type { Task } from '@spurtalk/shared';
import type { NanoStep } from '../types';

export default function FocusScreen(): React.ReactElement {
    const { theme } = useTheme();
    const router = useRouter();
    const { taskId } = useLocalSearchParams<{ taskId: string }>();

    const [task, setTask] = useState<Task | null>(null);
    const [nanoSteps, setNanoSteps] = useState<NanoStep[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showUnblocker, setShowUnblocker] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    useEffect(() => {
        if (taskId) {
            fetchTask();
        }
    }, [taskId]);

    const fetchTask = async (): Promise<void> => {
        setIsLoading(true);
        try {
            const { data } = await api.get<Task>(`/tasks/${taskId}`);
            setTask(data);

            // Generate mock nano steps (would come from API in production)
            setNanoSteps([
                { id: '1', text: 'Take a deep breath', completed: false, estimatedMinutes: 1 },
                { id: '2', text: 'Open what you need', completed: false, estimatedMinutes: 1 },
                { id: '3', text: 'Make one small change', completed: false, estimatedMinutes: 2 },
            ]);
        } catch (error) {
            console.error('Failed to fetch task:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExit = (): void => {
        router.back();
    };

    const handleDone = async (): Promise<void> => {
        hapticTaskComplete();
        setToastMessage('Great work! 🎉');
        setShowToast(true);

        try {
            await api.post(`/tasks/${taskId}/complete`);
        } catch (error) {
            console.error('Failed to mark task complete:', error);
        }

        setTimeout(() => {
            router.back();
        }, 1500);
    };

    const handleStuck = (): void => {
        setShowUnblocker(true);
    };

    const handlePause = (): void => {
        setToastMessage('Take your time. We\'ll be here when you\'re ready.');
        setShowToast(true);
    };

    const handleStepComplete = (stepId: string): void => {
        setNanoSteps((prev) =>
            prev.map((step) =>
                step.id === stepId ? { ...step, completed: true } : step
            )
        );

        // Check if all steps complete
        const allComplete = nanoSteps.every((s) =>
            s.id === stepId ? true : s.completed
        );
        if (allComplete) {
            handleDone();
        }
    };

    const handleTimerComplete = (): void => {
        setToastMessage('2 minutes done! You\'re doing great.');
        setShowToast(true);
    };

    if (isLoading || !task) {
        return (
            <View
                style={[
                    styles.container,
                    { backgroundColor: theme.colors.dimOverlay },
                ]}
            >
                <StatusBar barStyle="light-content" />
                <LoadingState variant="spinner" message="Getting ready..." />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.dimOverlay }]}>
            <StatusBar barStyle="light-content" />

            <FocusHeader onExit={handleExit} onTimerComplete={handleTimerComplete} />

            <View style={styles.spotlightContainer}>
                <View
                    style={[
                        styles.spotlight,
                        { backgroundColor: theme.colors.neutralElevated },
                    ]}
                >
                    <FocusMain
                        task={task}
                        nanoSteps={nanoSteps}
                        onStepComplete={handleStepComplete}
                    />
                </View>
            </View>

            <FocusControls
                onDone={handleDone}
                onStuck={handleStuck}
                onPause={handlePause}
            />

            <UnblockerModal
                visible={showUnblocker}
                task={task}
                onClose={() => setShowUnblocker(false)}
            />

            <NotificationToast
                message={toastMessage}
                variant="success"
                visible={showToast}
                onDismiss={() => setShowToast(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    spotlightContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    spotlight: {
        borderRadius: 24,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 10,
    },
});
