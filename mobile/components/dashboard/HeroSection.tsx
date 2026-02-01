/**
 * HeroSection - Dashboard hero with greeting and primary task
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../lib/theme';
import { TaskCard } from '../shared/TaskCard';
import { Button } from '../ui/Button';
import { getTimeBasedGreeting } from '../../lib/design-tokens';
import { useDashboardStore } from '../../lib/store/dashboard-store';

export function HeroSection(): React.ReactElement {
    const { theme } = useTheme();
    const router = useRouter();
    const primaryTask = useDashboardStore((state) => state.primaryTask);
    const greeting = getTimeBasedGreeting();

    const handleStartFocus = (): void => {
        if (primaryTask) {
            router.push({ pathname: '/focus', params: { taskId: primaryTask.id } });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.greeting, { color: theme.colors.textPrimary }]}>
                {greeting}
            </Text>

            {primaryTask ? (
                <View style={styles.taskSection}>
                    <TaskCard task={primaryTask} variant="hero" />
                    <Button
                        label="Just 2 Minutes"
                        variant="primary"
                        size="large"
                        onPress={handleStartFocus}
                    />
                </View>
            ) : (
                <View
                    style={[
                        styles.emptyState,
                        { backgroundColor: theme.colors.neutralElevated },
                    ]}
                >
                    <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary }]}>
                        All caught up! 🎉
                    </Text>
                    <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                        No tasks for now. Enjoy the moment!
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    greeting: {
        fontSize: 28,
        fontWeight: '600',
        lineHeight: 36,
        marginBottom: 20,
    },
    taskSection: {
        gap: 16,
    },
    emptyState: {
        padding: 32,
        borderRadius: 16,
        alignItems: 'center',
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default HeroSection;
