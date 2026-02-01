/**
 * FocusHeader - Header with exit button and timer
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme';
import { TwoMinuteTimer } from '../shared/TwoMinuteTimer';
import { MIN_TOUCH_TARGET } from '../../lib/design-tokens';

interface FocusHeaderProps {
    onExit: () => void;
    onTimerComplete?: () => void;
}

export function FocusHeader({
    onExit,
    onTimerComplete,
}: FocusHeaderProps): React.ReactElement {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
            <TouchableOpacity
                style={styles.exitButton}
                onPress={onExit}
                accessibilityLabel="Exit focus mode"
                accessibilityRole="button"
            >
                <Text style={[styles.exitIcon, { color: theme.colors.textSecondary }]}>
                    ✕
                </Text>
            </TouchableOpacity>

            <View style={styles.timerContainer}>
                <TwoMinuteTimer
                    size="small"
                    autoStart
                    onComplete={onTimerComplete}
                />
            </View>

            <View style={styles.spacer} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    exitButton: {
        width: MIN_TOUCH_TARGET,
        height: MIN_TOUCH_TARGET,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: MIN_TOUCH_TARGET / 2,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    exitIcon: {
        fontSize: 20,
        fontWeight: '600',
    },
    timerContainer: {
        flex: 1,
        alignItems: 'center',
    },
    spacer: {
        width: MIN_TOUCH_TARGET,
    },
});

export default FocusHeader;
