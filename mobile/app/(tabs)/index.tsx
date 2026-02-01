/**
 * Home Screen (Dashboard) - Central hub with primary task and mood selector
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme';
import { HeroSection } from '../../components/dashboard/HeroSection';
import { QuickStats } from '../../components/dashboard/QuickStats';
import { MoodSelector } from '../../components/dashboard/MoodSelector';
import { useDashboardStore } from '../../lib/store/dashboard-store';
import { api } from '../../lib/api';
import type { Task } from '@spurtalk/shared';

export default function HomeScreen(): React.ReactElement {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const isLoading = useDashboardStore((state) => state.isLoading);
    const setLoading = useDashboardStore((state) => state.setLoading);
    const setPrimaryTask = useDashboardStore((state) => state.setPrimaryTask);
    const setStats = useDashboardStore((state) => state.setStats);

    const fetchDashboardData = async (): Promise<void> => {
        setLoading(true);
        try {
            // Fetch primary task
            const { data: tasks } = await api.get<Task[]>('/tasks/deck');
            if (tasks.length > 0) {
                setPrimaryTask(tasks[0]);
            }

            // In production, would fetch stats from API
            // For now, use mock data
            setStats({
                streak: 5,
                todayWins: 3,
                gardenGrowth: 42,
            });
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.neutral }]}
            contentContainerStyle={[
                styles.content,
                { paddingTop: insets.top, paddingBottom: insets.bottom + 20 },
            ]}
            refreshControl={
                <RefreshControl
                    refreshing={isLoading}
                    onRefresh={fetchDashboardData}
                    tintColor={theme.colors.primary}
                />
            }
        >
            <HeroSection />
            <QuickStats />
            <MoodSelector />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flexGrow: 1,
    },
});
