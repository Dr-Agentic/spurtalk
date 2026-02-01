/**
 * Badge component for effort levels, emotional tags, and deadlines
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../lib/theme';
import type { BadgeVariant } from '../../types';

interface BadgeProps {
    label: string;
    variant?: BadgeVariant;
    color?: string;
    size?: 'small' | 'medium';
}

export function Badge({
    label,
    variant = 'default',
    color,
    size = 'medium',
}: BadgeProps): React.ReactElement {
    const { theme } = useTheme();

    const getBackgroundColor = (): string => {
        if (color) return color + '20'; // 20% opacity

        switch (variant) {
            case 'effort':
                return theme.colors.primary + '20';
            case 'emotional':
                return theme.colors.secondary + '20';
            case 'deadline':
                return theme.colors.sand500 + '20';
            default:
                return theme.colors.sage500 + '20';
        }
    };

    const getTextColor = (): string => {
        if (color) return color;

        switch (variant) {
            case 'effort':
                return theme.colors.primary;
            case 'emotional':
                return theme.colors.secondary;
            case 'deadline':
                return theme.colors.sand500;
            default:
                return theme.colors.sage700;
        }
    };

    const containerStyle: ViewStyle = {
        backgroundColor: getBackgroundColor(),
        paddingHorizontal: size === 'small' ? 6 : 10,
        paddingVertical: size === 'small' ? 2 : 4,
        borderRadius: theme.radii.sm,
        alignSelf: 'flex-start',
    };

    const textStyle: TextStyle = {
        color: getTextColor(),
        fontSize: size === 'small' ? 10 : 12,
        fontWeight: '500',
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={[styles.text, textStyle]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
    },
    text: {
        textAlign: 'center',
    },
});

/**
 * Effort level badge (specialized)
 */
export function EffortBadge({ level }: { level: string }): React.ReactElement {
    return <Badge label={level} variant="effort" />;
}

/**
 * Emotional tag badge (specialized)
 */
export function EmotionalBadge({ tag }: { tag: string }): React.ReactElement {
    return <Badge label={tag} variant="emotional" />;
}

/**
 * Deadline badge (specialized)
 */
export function DeadlineBadge({ deadline }: { deadline: string }): React.ReactElement {
    return <Badge label={deadline} variant="deadline" />;
}

export default Badge;
