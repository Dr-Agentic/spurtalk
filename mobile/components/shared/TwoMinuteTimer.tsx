/**
 * TwoMinuteTimer - Visual countdown timer with completion prompt
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../../lib/theme';
import { hapticTaskComplete, hapticWarning } from '../../lib/haptics';
import { Button } from '../ui/Button';
import { TIMER_SETTINGS } from '../../lib/design-tokens';

interface TwoMinuteTimerProps {
    onComplete?: () => void;
    onKeepGoing?: () => void;
    size?: 'small' | 'large';
    autoStart?: boolean;
    minutes?: number;
}

type TimerState = 'idle' | 'running' | 'paused' | 'complete';

export function TwoMinuteTimer({
    onComplete,
    onKeepGoing,
    size = 'large',
    autoStart = false,
    minutes = TIMER_SETTINGS.defaultMinutes,
}: TwoMinuteTimerProps): React.ReactElement {
    const { theme } = useTheme();
    const [state, setState] = useState<TimerState>(autoStart ? 'running' : 'idle');
    const [secondsRemaining, setSecondsRemaining] = useState(minutes * 60);
    const [showPrompt, setShowPrompt] = useState(false);
    const progressAnim = useRef(new Animated.Value(1)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const totalSeconds = minutes * 60;

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startTimer = useCallback((): void => {
        setState('running');
        setSecondsRemaining(totalSeconds);
        progressAnim.setValue(1);
    }, [totalSeconds, progressAnim]);

    const pauseTimer = useCallback((): void => {
        setState('paused');
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const resumeTimer = useCallback((): void => {
        setState('running');
    }, []);

    const handleKeepGoing = useCallback((): void => {
        setShowPrompt(false);
        setSecondsRemaining(totalSeconds);
        setState('running');
        onKeepGoing?.();
    }, [totalSeconds, onKeepGoing]);

    const handleDone = useCallback((): void => {
        setShowPrompt(false);
        setState('idle');
        onComplete?.();
    }, [onComplete]);

    // Timer countdown effect
    useEffect(() => {
        if (state === 'running') {
            intervalRef.current = setInterval(() => {
                setSecondsRemaining((prev) => {
                    if (prev <= 1) {
                        if (intervalRef.current) {
                            clearInterval(intervalRef.current);
                        }
                        setState('complete');
                        setShowPrompt(true);
                        hapticTaskComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [state]);

    // Progress animation
    useEffect(() => {
        const progress = secondsRemaining / totalSeconds;
        Animated.timing(progressAnim, {
            toValue: progress,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    }, [secondsRemaining, totalSeconds, progressAnim]);

    // Pulse animation when running
    useEffect(() => {
        if (state === 'running') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 1000,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [state, pulseAnim]);

    // Warning haptic at 30 seconds
    useEffect(() => {
        if (secondsRemaining === 30 && state === 'running') {
            hapticWarning();
        }
    }, [secondsRemaining, state]);

    const timerSize = size === 'large' ? 160 : 80;
    const fontSize = size === 'large' ? 36 : 20;

    const strokeWidth = size === 'large' ? 8 : 4;
    const radius = (timerSize - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const strokeDashoffset = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });

    if (showPrompt) {
        return (
            <View style={styles.promptContainer}>
                <Text style={[styles.promptTitle, { color: theme.colors.textPrimary }]}>
                    2 minutes done! 🎉
                </Text>
                <Text style={[styles.promptMessage, { color: theme.colors.textSecondary }]}>
                    What would you like to do?
                </Text>
                <View style={styles.promptButtons}>
                    <Button
                        label="Keep going!"
                        variant="primary"
                        onPress={handleKeepGoing}
                    />
                    <Button
                        label="Great job! Done."
                        variant="secondary"
                        onPress={handleDone}
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.timerCircle,
                    {
                        width: timerSize,
                        height: timerSize,
                        transform: [{ scale: pulseAnim }],
                    },
                ]}
            >
                {/* Background circle */}
                <View
                    style={[
                        styles.circleBackground,
                        {
                            width: timerSize,
                            height: timerSize,
                            borderRadius: timerSize / 2,
                            borderWidth: strokeWidth,
                            borderColor: theme.colors.sage500 + '30',
                        },
                    ]}
                />

                {/* Progress circle (simplified - using border) */}
                <View
                    style={[
                        styles.circleProgress,
                        {
                            width: timerSize,
                            height: timerSize,
                            borderRadius: timerSize / 2,
                            borderWidth: strokeWidth,
                            borderColor: theme.colors.primary,
                            opacity: secondsRemaining / totalSeconds,
                        },
                    ]}
                />

                {/* Time text */}
                <Text
                    style={[
                        styles.timeText,
                        {
                            fontSize,
                            color: theme.colors.textPrimary,
                        },
                    ]}
                >
                    {formatTime(secondsRemaining)}
                </Text>
            </Animated.View>

            {state === 'idle' && (
                <Button
                    label="Start"
                    variant="primary"
                    size={size === 'large' ? 'large' : 'medium'}
                    onPress={startTimer}
                />
            )}

            {state === 'running' && (
                <Button
                    label="Pause"
                    variant="ghost"
                    size={size === 'large' ? 'large' : 'medium'}
                    onPress={pauseTimer}
                />
            )}

            {state === 'paused' && (
                <Button
                    label="Resume"
                    variant="primary"
                    size={size === 'large' ? 'large' : 'medium'}
                    onPress={resumeTimer}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
    },
    timerCircle: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    circleBackground: {
        position: 'absolute',
    },
    circleProgress: {
        position: 'absolute',
    },
    timeText: {
        fontWeight: '600',
        fontVariant: ['tabular-nums'],
    },
    promptContainer: {
        alignItems: 'center',
        gap: 16,
        padding: 24,
    },
    promptTitle: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
    },
    promptMessage: {
        fontSize: 16,
        textAlign: 'center',
    },
    promptButtons: {
        flexDirection: 'column',
        gap: 12,
        marginTop: 16,
    },
});

export default TwoMinuteTimer;
