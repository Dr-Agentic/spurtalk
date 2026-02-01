/**
 * Theme configuration for SpurTalk Mobile App
 * Psychological safety color system with dark mode support
 */

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import type { ThemeConfig, ThemeColors, ThemeTypography, ThemeSpacing, ThemeRadii } from '../types';

// Light mode colors
const lightColors: ThemeColors = {
    primary: '#14b8a6',
    primaryForeground: '#ffffff',
    secondary: '#8b7cf6',
    secondaryForeground: '#ffffff',
    success: '#10b981',
    warning: '#f59e0b',
    neutral: '#faf9f7', // Warm white, NOT stark white
    neutralElevated: '#ffffff',
    dimOverlay: 'rgba(26, 26, 46, 0.7)',
    sand500: '#d97706',
    sage500: '#6b7280',
    sage700: '#374151',
    lavender600: '#7c3aed',
    textPrimary: '#1a1a2e',
    textSecondary: '#6b7280',
    surfaceElevated: '#ffffff',
};

// Dark mode colors
const darkColors: ThemeColors = {
    primary: '#14b8a6',
    primaryForeground: '#ffffff',
    secondary: '#8b7cf6',
    secondaryForeground: '#ffffff',
    success: '#10b981',
    warning: '#f59e0b',
    neutral: '#1a1a2e',
    neutralElevated: '#16213e',
    dimOverlay: 'rgba(26, 26, 46, 0.9)',
    sand500: '#d97706',
    sage500: '#9ca3af',
    sage700: '#d1d5db',
    lavender600: '#a78bfa',
    textPrimary: '#f5f4f1',
    textSecondary: '#a7c4a0',
    surfaceElevated: '#0f0f23',
};

// Typography scale
const typography: ThemeTypography = {
    h1: {
        fontSize: 32,
        lineHeight: 40,
        fontWeight: '600',
    },
    h2: {
        fontSize: 28,
        lineHeight: 36,
        fontWeight: '600',
    },
    h3: {
        fontSize: 24,
        lineHeight: 32,
        fontWeight: '600',
    },
    subheader: {
        fontSize: 20,
        lineHeight: 28,
        fontWeight: '500',
    },
    body: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '400',
    },
    bodySmall: {
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '400',
    },
    caption: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '400',
    },
};

// Spacing scale
const spacing: ThemeSpacing = {
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    6: 24,
    8: 32,
};

// Border radius scale
const radii: ThemeRadii = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
};

// Create theme config
const createTheme = (isDark: boolean): ThemeConfig => ({
    colors: isDark ? darkColors : lightColors,
    typography,
    spacing,
    radii,
    isDark,
});

// Theme context
interface ThemeContextValue {
    theme: ThemeConfig;
    isDark: boolean;
    toggleTheme: () => void;
    setDark: (dark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Theme provider props
interface ThemeProviderProps {
    children: ReactNode;
}

// Theme provider component
export function ThemeProvider({ children }: ThemeProviderProps): React.ReactElement {
    const systemColorScheme = useColorScheme();
    const [isDarkOverride, setIsDarkOverride] = useState<boolean | null>(null);

    const isDark = isDarkOverride !== null ? isDarkOverride : systemColorScheme === 'dark';
    const theme = useMemo(() => createTheme(isDark), [isDark]);

    const toggleTheme = (): void => {
        setIsDarkOverride((prev) => (prev === null ? !isDark : !prev));
    };

    const setDark = (dark: boolean): void => {
        setIsDarkOverride(dark);
    };

    const value = useMemo(
        () => ({ theme, isDark, toggleTheme, setDark }),
        [theme, isDark]
    );

    return (
        <ThemeContext.Provider value= { value } >
        { children }
        </ThemeContext.Provider>
    );
}

// Hook to use theme
export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

// Export theme config for static access
export const lightTheme = createTheme(false);
export const darkTheme = createTheme(true);

// Export individual theme parts for convenience
export const colors = {
    light: lightColors,
    dark: darkColors,
};

export { typography, spacing, radii };
