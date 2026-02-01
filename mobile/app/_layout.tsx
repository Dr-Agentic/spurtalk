/**
 * Root Layout - Main app entry with Stack navigator and auth check
 */

import React, { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider, useTheme } from '../lib/theme';
import { useAuthStore } from '../lib/store/auth';

function RootLayoutNav(): React.ReactElement {
    const { theme, isDark } = useTheme();
    const segments = useSegments();
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Small delay to ensure stores are hydrated
        const timer = setTimeout(() => setIsReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!isReady) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            // Redirect to login if not authenticated
            router.replace('/(auth)/login');
        } else if (user && inAuthGroup) {
            // Redirect to home if authenticated
            router.replace('/(tabs)');
        }
    }, [user, segments, isReady]);

    if (!isReady) {
        return (
            <View style={[styles.loading, { backgroundColor: theme.colors.neutral }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.neutral }]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <Slot />
        </View>
    );
}

export default function RootLayout(): React.ReactElement {
    return (
        <GestureHandlerRootView style={styles.container}>
            <ThemeProvider>
                <RootLayoutNav />
            </ThemeProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
