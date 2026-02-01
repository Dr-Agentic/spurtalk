/**
 * GardenStats - Stats display for garden
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/theme';

interface GardenStatsProps {
    totalFlowers: number;
    totalTrees: number;
    longestStreak: number;
}

export function GardenStats({
    totalFlowers,
    totalTrees,
    longestStreak,
}: GardenStatsProps): React.ReactElement {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.neutralElevated }]}>
                <Text style={styles.statIcon}>🌸</Text>
                <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
                    {totalFlowers}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Flowers
                </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.neutralElevated }]}>
                <Text style={styles.statIcon}>🌳</Text>
                <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
                    {totalTrees}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Trees
                </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.colors.neutralElevated }]}>
                <Text style={styles.statIcon}>🔥</Text>
                <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>
                    {longestStreak}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Best Streak
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    statIcon: {
        fontSize: 28,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 4,
    },
});

export default GardenStats;
