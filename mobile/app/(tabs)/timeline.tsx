/**
 * Timeline Screen - River timeline with blur zones
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../lib/theme';
import { TimelineView } from '../../components/timeline/TimelineView';
import { LoadingState } from '../../components/ui/LoadingState';
import { BLUR_INTENSITIES } from '../../lib/design-tokens';
import { api } from '../../lib/api';
import type { Task } from '@spurtalk/shared';

interface TimelineSection {
    title: string;
    data: Task[];
    blurIntensity: number;
}

export default function TimelineScreen(): React.ReactElement {
    const { theme } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [sections, setSections] = useState<TimelineSection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchTimeline = async (): Promise<void> => {
        try {
            const { data: tasks } = await api.get<Task[]>('/tasks');

            // Group tasks by fuzzy deadline (would be more sophisticated in production)
            const immediate = tasks.filter((t) => t.fuzzyDeadline === 'Soon').slice(0, 3);
            const soon = tasks.filter((t) => t.fuzzyDeadline === 'This Week').slice(0, 3);
            const eventually = tasks.filter((t) => t.fuzzyDeadline === 'Eventually').slice(0, 3);

            setSections([
                { title: 'Right now', data: immediate, blurIntensity: BLUR_INTENSITIES.immediate },
                { title: 'Soon', data: soon, blurIntensity: BLUR_INTENSITIES.soon },
                { title: 'This week', data: tasks.slice(0, 2), blurIntensity: BLUR_INTENSITIES.thisWeek },
                { title: 'Eventually', data: eventually, blurIntensity: BLUR_INTENSITIES.eventually },
            ]);
        } catch (error) {
            console.error('Failed to fetch timeline:', error);
            // Use empty sections on error
            setSections([
                { title: 'Right now', data: [], blurIntensity: 0 },
                { title: 'Soon', data: [], blurIntensity: 10 },
                { title: 'This week', data: [], blurIntensity: 20 },
                { title: 'Eventually', data: [], blurIntensity: 30 },
            ]);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTimeline();
    }, []);

    const handleRefresh = (): void => {
        setIsRefreshing(true);
        fetchTimeline();
    };

    const handleTaskPress = (task: Task): void => {
        router.push({ pathname: '/focus', params: { taskId: task.id } });
    };

    if (isLoading) {
        return (
            <View
                style={[
                    styles.loadingContainer,
                    { backgroundColor: theme.colors.neutral, paddingTop: insets.top },
                ]}
            >
                <LoadingState variant="spinner" message="Loading your river..." />
            </View>
        );
    }

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: theme.colors.neutral, paddingTop: insets.top },
            ]}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                    Your River
                </Text>
            </View>

            <TimelineView
                sections={sections}
                onTaskPress={handleTaskPress}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '600',
    },
});
