/**
 * Garden Screen - Interactive garden visualization
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/theme';
import { GardenCanvas } from '../../components/garden/GardenCanvas';
import { GardenStats } from '../../components/garden/GardenStats';
import { LoadingState } from '../../components/ui/LoadingState';
import { Button } from '../../components/ui/Button';
import { api } from '../../lib/api';

interface GardenElement {
    id: string;
    type: 'flower' | 'tree';
    x: number;
    y: number;
    taskTitle: string;
}

export default function GardenScreen(): React.ReactElement {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    const [elements, setElements] = useState<GardenElement[]>([]);
    const [stats, setStats] = useState({ totalFlowers: 0, totalTrees: 0, longestStreak: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedElement, setSelectedElement] = useState<GardenElement | null>(null);

    useEffect(() => {
        fetchGarden();
    }, []);

    const fetchGarden = async (): Promise<void> => {
        setIsLoading(true);
        try {
            // In production, would fetch real garden data
            // For now, generate mock elements
            const mockElements: GardenElement[] = [
                { id: '1', type: 'flower', x: 50, y: 200, taskTitle: 'Morning meditation' },
                { id: '2', type: 'flower', x: 120, y: 220, taskTitle: 'Send email' },
                { id: '3', type: 'tree', x: 200, y: 150, taskTitle: 'Complete project report' },
                { id: '4', type: 'flower', x: 80, y: 250, taskTitle: 'Water plants' },
                { id: '5', type: 'flower', x: 250, y: 230, taskTitle: 'Quick stretches' },
                { id: '6', type: 'tree', x: 100, y: 140, taskTitle: 'Review quarterly goals' },
                { id: '7', type: 'flower', x: 180, y: 260, taskTitle: 'Call mom' },
            ];

            setElements(mockElements);
            setStats({
                totalFlowers: mockElements.filter((e) => e.type === 'flower').length,
                totalTrees: mockElements.filter((e) => e.type === 'tree').length,
                longestStreak: 7,
            });
        } catch (error) {
            console.error('Failed to fetch garden:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleElementPress = (element: GardenElement): void => {
        setSelectedElement(element);
    };

    if (isLoading) {
        return (
            <View
                style={[
                    styles.loadingContainer,
                    { backgroundColor: theme.colors.neutral, paddingTop: insets.top },
                ]}
            >
                <LoadingState variant="spinner" message="Growing your garden..." />
            </View>
        );
    }

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.colors.neutral }]}
            contentContainerStyle={[
                styles.content,
                { paddingTop: insets.top, paddingBottom: insets.bottom + 20 },
            ]}
        >
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                    Your Garden
                </Text>
                <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                    Every completed task grows something beautiful
                </Text>
            </View>

            <GardenStats {...stats} />

            <GardenCanvas elements={elements} onElementPress={handleElementPress} />

            {/* Element Details Modal */}
            <Modal
                visible={!!selectedElement}
                transparent
                animationType="fade"
                onRequestClose={() => setSelectedElement(null)}
            >
                <TouchableOpacity
                    style={[styles.modalOverlay, { backgroundColor: theme.colors.dimOverlay }]}
                    onPress={() => setSelectedElement(null)}
                    activeOpacity={1}
                >
                    <View
                        style={[
                            styles.modalContent,
                            { backgroundColor: theme.colors.neutralElevated },
                        ]}
                    >
                        <Text style={styles.modalIcon}>
                            {selectedElement?.type === 'flower' ? '🌸' : '🌳'}
                        </Text>
                        <Text style={[styles.modalTitle, { color: theme.colors.textPrimary }]}>
                            {selectedElement?.taskTitle}
                        </Text>
                        <Text style={[styles.modalSubtitle, { color: theme.colors.textSecondary }]}>
                            Completed task
                        </Text>
                        <Button
                            label="Nice!"
                            variant="primary"
                            onPress={() => setSelectedElement(null)}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
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
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    modalContent: {
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        minWidth: 250,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
    },
    modalIcon: {
        fontSize: 48,
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        marginBottom: 24,
    },
});
