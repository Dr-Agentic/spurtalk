/**
 * Mobile-specific type definitions for SpurTalk Mobile App
 * Note: Import shared types from @spurtalk/shared where possible
 */

export type MoodOption = 'Energized' | 'Low energy' | 'Creative' | 'Need a win';

export type EffortLevel = 'Tiny' | 'Small' | 'Medium' | 'Big';

export type EmotionalTag = 'Boring' | 'Scary' | 'Fun';

export type FuzzyDeadline = 'Soon' | 'This Week' | 'Eventually';

export interface NanoStep {
    id: string;
    text: string;
    completed: boolean;
    estimatedMinutes?: number;
}

export interface ThemeColors {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    success: string;
    warning: string;
    neutral: string;
    neutralElevated: string;
    dimOverlay: string;
    sand500: string;
    sage500: string;
    sage700: string;
    lavender600: string;
    textPrimary: string;
    textSecondary: string;
    surfaceElevated: string;
}

export interface ThemeTypography {
    h1: {
        fontSize: number;
        lineHeight: number;
        fontWeight: '400' | '500' | '600' | '700';
    };
    h2: {
        fontSize: number;
        lineHeight: number;
        fontWeight: '400' | '500' | '600' | '700';
    };
    h3: {
        fontSize: number;
        lineHeight: number;
        fontWeight: '400' | '500' | '600' | '700';
    };
    subheader: {
        fontSize: number;
        lineHeight: number;
        fontWeight: '400' | '500' | '600' | '700';
    };
    body: {
        fontSize: number;
        lineHeight: number;
        fontWeight: '400' | '500' | '600' | '700';
    };
    bodySmall: {
        fontSize: number;
        lineHeight: number;
        fontWeight: '400' | '500' | '600' | '700';
    };
    caption: {
        fontSize: number;
        lineHeight: number;
        fontWeight: '400' | '500' | '600' | '700';
    };
}

export interface ThemeSpacing {
    1: number;
    2: number;
    3: number;
    4: number;
    6: number;
    8: number;
}

export interface ThemeRadii {
    sm: number;
    md: number;
    lg: number;
    xl: number;
}

export interface ThemeConfig {
    colors: ThemeColors;
    typography: ThemeTypography;
    spacing: ThemeSpacing;
    radii: ThemeRadii;
    isDark: boolean;
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger-soft';
export type ButtonSize = 'small' | 'medium' | 'large';

export type BadgeVariant = 'effort' | 'emotional' | 'deadline' | 'default';

export type LoadingVariant = 'spinner' | 'skeleton' | 'progress';

export type ToastVariant = 'success' | 'info' | 'attention';

export interface TaskCardVariant {
    type: 'default' | 'hero' | 'compact';
}

// Navigation param types for type-safe navigation
export type RootStackParamList = {
    '(auth)': undefined;
    '(tabs)': undefined;
    focus: { taskId: string };
};

export type AuthStackParamList = {
    login: undefined;
    register: undefined;
    'forgot-password': undefined;
};

export type TabsParamList = {
    index: undefined;
    deck: undefined;
    timeline: undefined;
    garden: undefined;
};
