/**
 * Tabs Layout - Tab navigator for main app screens
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/theme';

// Tab icons (using emoji for simplicity, would use Lucide in production)
function TabIcon({ name, focused }: { name: string; focused: boolean }): React.ReactElement {
    const icons: Record<string, string> = {
        index: '🏠',
        deck: '📚',
        timeline: '⏰',
        garden: '🌸',
    };

    return (
        <View style={[styles.iconContainer, focused && styles.iconFocused]}>
            <View style={styles.icon}>
                <View style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}>
                    <View>{/* Icon placeholder */}</View>
                </View>
            </View>
        </View>
    );
}

export default function TabsLayout(): React.ReactElement {
    const { theme } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.colors.neutral,
                    borderTopColor: theme.colors.success + '30',
                    borderTopWidth: 1,
                    height: 80,
                    paddingBottom: 20,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.sage500,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <TabIcon name="index" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="deck"
                options={{
                    title: 'Deck',
                    tabBarIcon: ({ focused }) => <TabIcon name="deck" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="timeline"
                options={{
                    title: 'Timeline',
                    tabBarIcon: ({ focused }) => <TabIcon name="timeline" focused={focused} />,
                }}
            />
            <Tabs.Screen
                name="garden"
                options={{
                    title: 'Garden',
                    tabBarIcon: ({ focused }) => <TabIcon name="garden" focused={focused} />,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
    },
    iconFocused: {
        transform: [{ scale: 1.1 }],
    },
    icon: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
