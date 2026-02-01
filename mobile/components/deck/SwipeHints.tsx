/**
 * SwipeHints - First-time user hints overlay
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
    FadeIn,
    FadeOut,
} from 'react-native-reanimated';
import { useTheme } from '../../lib/theme';
import { hapticButtonPress } from '../../lib/haptics';

interface SwipeHintsProps {
    visible: boolean;
    onDismiss: () => void;
}

export function SwipeHints({
    visible,
    onDismiss,
}: SwipeHintsProps): React.ReactElement | null {
    const { theme } = useTheme();

    const handleDismiss = (): void => {
        hapticButtonPress();
        onDismiss();
    };

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.overlay,
                { backgroundColor: theme.colors.dimOverlay },
            ]}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
        >
            <TouchableOpacity
                style={styles.content}
                onPress={handleDismiss}
                activeOpacity={0.95}
            >
                <View
                    style={[
                        styles.hintCard,
                        { backgroundColor: theme.colors.neutralElevated },
                    ]}
                >
                    <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                        How to use the deck
                    </Text>

                    <View style={styles.hintsContainer}>
                        <View style={styles.hintRow}>
                            <Text style={styles.arrow}>→</Text>
                            <View style={styles.hintText}>
                                <Text style={[styles.hintAction, { color: theme.colors.primary }]}>
                                    Swipe right
                                </Text>
                                <Text style={[styles.hintDesc, { color: theme.colors.textSecondary }]}>
                                    to start this task
                                </Text>
                            </View>
                        </View>

                        <View style={styles.hintRow}>
                            <Text style={styles.arrow}>←</Text>
                            <View style={styles.hintText}>
                                <Text style={[styles.hintAction, { color: theme.colors.sand500 }]}>
                                    Swipe left
                                </Text>
                                <Text style={[styles.hintDesc, { color: theme.colors.textSecondary }]}>
                                    for later
                                </Text>
                            </View>
                        </View>

                        <View style={styles.hintRow}>
                            <Text style={styles.arrow}>↓</Text>
                            <View style={styles.hintText}>
                                <Text style={[styles.hintAction, { color: theme.colors.secondary }]}>
                                    Swipe down
                                </Text>
                                <Text style={[styles.hintDesc, { color: theme.colors.textSecondary }]}>
                                    to break it down
                                </Text>
                            </View>
                        </View>
                    </View>

                    <Text style={[styles.dismissText, { color: theme.colors.sage500 }]}>
                        Tap anywhere to dismiss
                    </Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 32,
    },
    hintCard: {
        padding: 24,
        borderRadius: 20,
        maxWidth: 320,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 24,
    },
    hintsContainer: {
        gap: 20,
        marginBottom: 24,
    },
    hintRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    arrow: {
        fontSize: 28,
        width: 40,
        textAlign: 'center',
    },
    hintText: {
        flex: 1,
    },
    hintAction: {
        fontSize: 16,
        fontWeight: '600',
    },
    hintDesc: {
        fontSize: 14,
    },
    dismissText: {
        fontSize: 13,
        textAlign: 'center',
    },
});

export default SwipeHints;
