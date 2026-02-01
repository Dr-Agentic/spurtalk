/**
 * Loading state component with spinner, skeleton, and progress variants
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../../lib/theme';
import { getLoadingMessage } from '../../lib/error-messages';
import type { LoadingVariant } from '../../types';

interface LoadingStateProps {
    variant?: LoadingVariant;
    message?: string;
    progress?: number;
    showMessage?: boolean;
    size?: 'small' | 'medium' | 'large';
}

export function LoadingState({
    variant = 'spinner',
    message,
    progress = 0,
    showMessage = false,
    size = 'medium',
}: LoadingStateProps): React.ReactElement {
    const { theme } = useTheme();
    const [longLoadMessage, setLongLoadMessage] = useState<string | null>(null);
    const spinValue = new Animated.Value(0);
    const shimmerValue = new Animated.Value(0);

    // Spin animation for spinner
    useEffect(() => {
        if (variant === 'spinner') {
            Animated.loop(
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        }
    }, [variant]);

    // Shimmer animation for skeleton
    useEffect(() => {
        if (variant === 'skeleton') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(shimmerValue, {
                        toValue: 1,
                        duration: 1000,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                    Animated.timing(shimmerValue, {
                        toValue: 0,
                        duration: 1000,
                        easing: Easing.ease,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        }
    }, [variant]);

    // Show long loading message after 3 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            if (showMessage) {
                setLongLoadMessage(getLoadingMessage());
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, [showMessage]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const shimmerOpacity = shimmerValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    const getSpinnerSize = (): number => {
        switch (size) {
            case 'small': return 20;
            case 'large': return 48;
            default: return 32;
        }
    };

    const spinnerSize = getSpinnerSize();

    if (variant === 'spinner') {
        return (
            <View style={styles.container}>
                <Animated.View
                    style={[
                        styles.spinner,
                        {
                            width: spinnerSize,
                            height: spinnerSize,
                            borderRadius: spinnerSize / 2,
                            borderColor: theme.colors.primary + '30',
                            borderTopColor: theme.colors.primary,
                            transform: [{ rotate: spin }],
                        },
                    ]}
                />
                {(message || longLoadMessage) && (
                    <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
                        {message || longLoadMessage}
                    </Text>
                )}
            </View>
        );
    }

    if (variant === 'skeleton') {
        return (
            <View style={styles.skeletonContainer}>
                <Animated.View
                    style={[
                        styles.skeletonBar,
                        {
                            backgroundColor: theme.colors.sage500,
                            opacity: shimmerOpacity,
                            width: '100%',
                            height: 20,
                            borderRadius: theme.radii.sm,
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.skeletonBar,
                        {
                            backgroundColor: theme.colors.sage500,
                            opacity: shimmerOpacity,
                            width: '75%',
                            height: 20,
                            borderRadius: theme.radii.sm,
                            marginTop: 8,
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.skeletonBar,
                        {
                            backgroundColor: theme.colors.sage500,
                            opacity: shimmerOpacity,
                            width: '50%',
                            height: 20,
                            borderRadius: theme.radii.sm,
                            marginTop: 8,
                        },
                    ]}
                />
            </View>
        );
    }

    if (variant === 'progress') {
        return (
            <View style={styles.progressContainer}>
                <View
                    style={[
                        styles.progressTrack,
                        {
                            backgroundColor: theme.colors.sage500 + '30',
                            borderRadius: theme.radii.sm,
                        },
                    ]}
                >
                    <View
                        style={[
                            styles.progressFill,
                            {
                                backgroundColor: theme.colors.primary,
                                borderRadius: theme.radii.sm,
                                width: `${Math.min(100, Math.max(0, progress))}%`,
                            },
                        ]}
                    />
                </View>
                {(message || longLoadMessage) && (
                    <Text style={[styles.progressMessage, { color: theme.colors.textSecondary }]}>
                        {message || longLoadMessage}
                    </Text>
                )}
            </View>
        );
    }

    return <View />;
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    spinner: {
        borderWidth: 3,
    },
    message: {
        marginTop: 12,
        fontSize: 14,
        textAlign: 'center',
    },
    skeletonContainer: {
        width: '100%',
        padding: 16,
    },
    skeletonBar: {},
    progressContainer: {
        width: '100%',
        padding: 16,
    },
    progressTrack: {
        height: 8,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
    },
    progressMessage: {
        marginTop: 8,
        fontSize: 14,
        textAlign: 'center',
    },
});

export default LoadingState;
