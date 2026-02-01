/**
 * QuickStats - Horizontal ScrollView with stat cards
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../lib/theme';
import { useDashboardStore } from '../../lib/store/dashboard-store';

interface StatCardProps {
    icon: string;
    label: string;
    value: number | string;
}

function StatCard({ icon, label, value }: StatCardProps): React.ReactElement {
    const { theme } = useTheme();

    return (
        <View
            style={[
                styles.card,
                { backgroundColor: theme.colors.neutralElevated },
            ]}
        >
            <Text style={styles.icon}>{icon}</Text>
            <Text style={[styles.value, { color: theme.colors.textPrimary }]}>
                {value}
            </Text>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
                {label}
            </Text>
        </View>
    );
}

export function QuickStats(): React.ReactElement {
    const stats = useDashboardStore((state) => state.stats);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <StatCard
                icon="🔥"
                label="Your streak"
                value={stats.streak}
            />
            <StatCard
                icon="✨"
                label="Small wins today"
                value={stats.todayWins}
            />
            <StatCard
                icon="🌱"
                label="Garden growth"
                value={`${stats.gardenGrowth}%`}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 12,
    },
    card: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        minWidth: 110,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    icon: {
        fontSize: 24,
        marginBottom: 8,
    },
    value: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        textAlign: 'center',
    },
});

export default QuickStats;
