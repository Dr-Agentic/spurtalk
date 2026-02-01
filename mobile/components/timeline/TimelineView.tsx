/**
 * TimelineView - FlatList with section headers and progressive blur zones
 */

import React from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import { useTheme } from '../../lib/theme';
import { TaskCard } from '../shared/TaskCard';
import { BLUR_INTENSITIES } from '../../lib/design-tokens';
import type { Task } from '@spurtalk/shared';

interface TimelineSection {
    title: string;
    data: Task[];
    blurIntensity: number;
}

interface TimelineViewProps {
    sections: TimelineSection[];
    onTaskPress?: (task: Task) => void;
}

export function TimelineView({
    sections,
    onTaskPress,
}: TimelineViewProps): React.ReactElement {
    const { theme } = useTheme();

    const renderSectionHeader = ({
        section,
    }: {
        section: TimelineSection;
    }): React.ReactElement => (
        <View
            style={[
                styles.sectionHeader,
                { backgroundColor: theme.colors.neutral },
            ]}
        >
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
                {section.title}
            </Text>
        </View>
    );

    const renderItem = ({
        item,
        section,
    }: {
        item: Task;
        section: TimelineSection;
    }): React.ReactElement => (
        <View
            style={[
                styles.itemContainer,
                { opacity: 1 - section.blurIntensity / 100 },
            ]}
        >
            <TaskCard
                task={item}
                variant="compact"
                interactive
                onPress={() => onTaskPress?.(item)}
            />
        </View>
    );

    const renderEmpty = (): React.ReactElement => (
        <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No tasks in your timeline
            </Text>
        </View>
    );

    return (
        <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={styles.listContent}
            stickySectionHeadersEnabled
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 20,
    },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    itemContainer: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    emptyContainer: {
        padding: 32,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
    },
});

export default TimelineView;
