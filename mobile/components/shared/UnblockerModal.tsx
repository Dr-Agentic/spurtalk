/**
 * UnblockerModal - Modal for breaking down stuck tasks into nano-steps
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../lib/theme';
import { Button } from '../ui/Button';
import { TaskCard } from './TaskCard';
import { NanoStepList } from './NanoStepList';
import { LoadingState } from '../ui/LoadingState';
import { hapticMediumImpact } from '../../lib/haptics';
import type { NanoStep } from '../../types';
import type { Task } from '@spurtalk/shared';

interface UnblockerModalProps {
    visible: boolean;
    task: Task | null;
    onClose: () => void;
    onStartFirstStep?: (step: NanoStep) => void;
    onEditSteps?: (steps: NanoStep[]) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function UnblockerModal({
    visible,
    task,
    onClose,
    onStartFirstStep,
    onEditSteps,
}: UnblockerModalProps): React.ReactElement | null {
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const [nanoSteps, setNanoSteps] = useState<NanoStep[]>([]);
    const translateY = useSharedValue(SCREEN_HEIGHT);
    const opacity = useSharedValue(0);

    // Simulated nano-step generation (would call API in production)
    const generateNanoSteps = async (): Promise<void> => {
        setIsLoading(true);
        hapticMediumImpact();

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Generate example nano-steps (in production, this would come from API)
        const generatedSteps: NanoStep[] = [
            {
                id: '1',
                text: 'Open the relevant file or document',
                completed: false,
                estimatedMinutes: 1,
            },
            {
                id: '2',
                text: 'Review what needs to be done',
                completed: false,
                estimatedMinutes: 2,
            },
            {
                id: '3',
                text: 'Make the first small change',
                completed: false,
                estimatedMinutes: 2,
            },
            {
                id: '4',
                text: 'Check your progress',
                completed: false,
                estimatedMinutes: 1,
            },
            {
                id: '5',
                text: 'Save your work',
                completed: false,
                estimatedMinutes: 1,
            },
        ];

        setNanoSteps(generatedSteps);
        setIsLoading(false);
    };

    useEffect(() => {
        if (visible) {
            translateY.value = withSpring(0, { damping: 15 });
            opacity.value = withSpring(1);
            generateNanoSteps();
        } else {
            translateY.value = withSpring(SCREEN_HEIGHT);
            opacity.value = withSpring(0);
            setNanoSteps([]);
        }
    }, [visible]);

    const animatedContentStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const animatedOverlayStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    const handleClose = (): void => {
        translateY.value = withSpring(SCREEN_HEIGHT, {}, (finished) => {
            if (finished) {
                runOnJS(onClose)();
            }
        });
        opacity.value = withSpring(0);
    };

    const handleStartFirstStep = (): void => {
        if (nanoSteps.length > 0 && onStartFirstStep) {
            onStartFirstStep(nanoSteps[0]);
        }
        handleClose();
    };

    const handleEditSteps = (): void => {
        if (onEditSteps) {
            onEditSteps(nanoSteps);
        }
        handleClose();
    };

    const handleStepComplete = (stepId: string): void => {
        setNanoSteps((prev) =>
            prev.map((step) =>
                step.id === stepId ? { ...step, completed: true } : step
            )
        );
    };

    if (!task) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
        >
            <Animated.View
                style={[
                    styles.overlay,
                    { backgroundColor: theme.colors.dimOverlay },
                    animatedOverlayStyle,
                ]}
            >
                <TouchableOpacity
                    style={styles.overlayTouch}
                    onPress={handleClose}
                    activeOpacity={1}
                />
            </Animated.View>

            <Animated.View
                style={[
                    styles.content,
                    {
                        backgroundColor: theme.colors.neutral,
                        borderTopLeftRadius: theme.radii.xl,
                        borderTopRightRadius: theme.radii.xl,
                    },
                    animatedContentStyle,
                ]}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.handle} />
                    <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                        Let's break this down
                    </Text>
                    <TouchableOpacity
                        onPress={handleClose}
                        style={styles.closeButton}
                        accessibilityLabel="Close"
                    >
                        <Text style={{ color: theme.colors.textSecondary, fontSize: 24 }}>
                            ×
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Task Card */}
                <View style={styles.taskSection}>
                    <TaskCard task={task} variant="compact" />
                </View>

                {/* Nano Steps */}
                <ScrollView
                    style={styles.stepsSection}
                    contentContainerStyle={styles.stepsContent}
                >
                    {isLoading ? (
                        <LoadingState
                            variant="spinner"
                            showMessage
                            message="Breaking this down for you..."
                        />
                    ) : (
                        <NanoStepList
                            steps={nanoSteps}
                            onStepComplete={handleStepComplete}
                        />
                    )}
                </ScrollView>

                {/* Actions */}
                {!isLoading && nanoSteps.length > 0 && (
                    <View style={styles.actions}>
                        <Button
                            label="Start with step 1"
                            variant="primary"
                            size="large"
                            onPress={handleStartFirstStep}
                        />
                        <Button
                            label="Edit these"
                            variant="ghost"
                            onPress={handleEditSteps}
                        />
                    </View>
                )}
            </Animated.View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    overlayTouch: {
        flex: 1,
    },
    content: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: SCREEN_HEIGHT * 0.85,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    handle: {
        position: 'absolute',
        top: 8,
        width: 40,
        height: 4,
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: 2,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
    },
    closeButton: {
        position: 'absolute',
        right: 16,
        top: 12,
        padding: 8,
    },
    taskSection: {
        padding: 16,
    },
    stepsSection: {
        flex: 1,
        minHeight: 200,
    },
    stepsContent: {
        paddingBottom: 16,
    },
    actions: {
        padding: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.1)',
    },
});

export default UnblockerModal;
