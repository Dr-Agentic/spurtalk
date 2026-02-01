/**
 * Auth Layout - Stack navigator for auth screens
 */

import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../lib/theme';

export default function AuthLayout(): React.ReactElement {
    const { theme } = useTheme();

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: theme.colors.neutral,
                },
                animation: 'fade',
            }}
        >
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="forgot-password" />
        </Stack>
    );
}
