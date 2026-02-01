/**
 * TaskCard - Core task display card with effort indicators
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../lib/theme';
import { Badge } from '../ui/Badge';
import type { TaskCardVariant } from '../../types';
import type { Task } from '@spurtalk/shared';

interface TaskCardProps {
    task: Task;
    variant?: TaskCardVariant['type'];
    interactive?: boolean;
    onPress?: () => void;
}

export function TaskCard({
    task,
    variant = 'default',
    interactive = false,
    onPress,
}: TaskCardProps): React.ReactElement {
    const { theme } = useTheme();

    const getContainerStyle = () => {
        const baseStyle = {
            backgroundColor: theme.colors.neutralElevated,
            borderRadius: theme.radii.lg,
            padding: variant === 'compact' ? 12 : variant === 'hero' ? 24 : 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        };

        if (variant === 'hero') {
            return {
                ...baseStyle,
                borderWidth: 2,
                borderColor: theme.colors.primary + '30',
            };
        }

        return baseStyle;
    };

    const getTitleStyle = () => {
        const baseStyle = {
            color: theme.colors.textPrimary,
            fontWeight: '600' as const,
            marginBottom: 8,
        };

        switch (variant) {
            case 'hero':
                return { ...baseStyle, fontSize: 24, lineHeight: 32 };
            case 'compact':
                return { ...baseStyle, fontSize: 16, lineHeight: 22 };
            default:
                return { ...baseStyle, fontSize: 20, lineHeight: 28 };
        }
    };

    const content = (
        <View style={[styles.container, getContainerStyle()]}>
            <Text style={getTitleStyle()}>{task.title}</Text>

            <View style={styles.badges}>
                {task.effortLevel && (
                    <Badge label={task.effortLevel} variant="effort" />
                )}
                {task.emotionalTag && (
                    <Badge label={task.emotionalTag} variant="emotional" />
                )}
                {task.fuzzyDeadline && (
                    <Badge label={task.fuzzyDeadline} variant="deadline" />
                )}
            </View>

            {task.description && variant !== 'compact' && (
                <Text
                    style={[
                        styles.description,
                        { color: theme.colors.textSecondary },
                    ]}
                    numberOfLines={variant === 'hero' ? 3 : 2}
                >
                    {task.description}
                </Text>
            )}

            {task.compellingEvent && variant !== 'compact' && (
                <Text
                    style={[
                        styles.compellingEvent,
                        { color: theme.colors.sage500 },
                    ]}
                    numberOfLines={1}
                >
                    {task.compellingEvent}
                </Text>
            )}
        </View>
    );

    if (interactive && onPress) {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel={`Task: ${task.title}`}
            >
                {content}
            </TouchableOpacity>
        );
    }

    return content;
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    badges: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        marginTop: 8,
    },
    compellingEvent: {
        fontSize: 13,
        fontStyle: 'italic',
        marginTop: 8,
    },
});

export default TaskCard;
