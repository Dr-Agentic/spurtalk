/**
 * AuthCard - Reusable card wrapper for auth screens
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../../lib/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AuthCardProps {
    children: ReactNode;
    showLogo?: boolean;
}

export function AuthCard({ children, showLogo = true }: AuthCardProps): React.ReactElement {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.colors.neutral }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {showLogo && (
                    <View style={styles.logoContainer}>
                        {/* Logo placeholder - would use actual logo image */}
                        <View
                            style={[
                                styles.logoPlaceholder,
                                { backgroundColor: theme.colors.primary + '20' },
                            ]}
                        >
                            <View
                                style={[
                                    styles.logoInner,
                                    { backgroundColor: theme.colors.primary },
                                ]}
                            />
                        </View>
                    </View>
                )}
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: theme.colors.neutralElevated,
                            borderRadius: theme.radii.xl,
                        },
                    ]}
                >
                    {children}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoInner: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    card: {
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
});

export default AuthCard;
