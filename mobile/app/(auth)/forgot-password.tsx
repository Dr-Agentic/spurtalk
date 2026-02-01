/**
 * Forgot Password Screen - Password reset flow
 */

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTheme } from '../../lib/theme';
import { AuthCard } from '../../components/auth/AuthCard';
import { Button } from '../../components/ui/Button';
import { NotificationToast } from '../../components/ui/NotificationToast';
import { api } from '../../lib/api';
import { toFriendlyError } from '../../lib/error-messages';
import { MIN_TOUCH_TARGET } from '../../lib/design-tokens';

export default function ForgotPasswordScreen(): React.ReactElement {
    const { theme } = useTheme();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'attention' } | null>(
        null
    );

    const handleResetRequest = async (): Promise<void> => {
        if (!email) {
            setMessage({ text: 'Please enter your email', type: 'attention' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await api.post('/auth/forgot-password', { email });
            setSent(true);
            setMessage({
                text: "We've sent you reset instructions if that email exists in our system.",
                type: 'success',
            });
        } catch (error) {
            // Show success message even on error to prevent email enumeration
            setSent(true);
            setMessage({
                text: "We've sent you reset instructions if that email exists in our system.",
                type: 'success',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard showLogo>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>
                No worries!
            </Text>
            <Text style={[styles.subtext, { color: theme.colors.textSecondary }]}>
                {sent
                    ? 'Check your email for reset instructions.'
                    : "We'll help you get back in."}
            </Text>

            {!sent ? (
                <View style={styles.form}>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: theme.colors.neutral,
                                borderColor: theme.colors.sage500 + '50',
                                color: theme.colors.textPrimary,
                            },
                        ]}
                        placeholder="Your email"
                        placeholderTextColor={theme.colors.sage500}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                        accessibilityLabel="Email address"
                    />

                    <Button
                        label="Send reset link"
                        variant="primary"
                        size="large"
                        onPress={handleResetRequest}
                        loading={loading}
                        disabled={loading}
                    />
                </View>
            ) : (
                <View style={styles.form}>
                    <Button
                        label="Back to login"
                        variant="primary"
                        size="large"
                        onPress={() => router.replace('/(auth)/login')}
                    />
                </View>
            )}

            <Link href="/(auth)/login" asChild>
                <TouchableOpacity style={styles.link}>
                    <Text style={[styles.linkText, { color: theme.colors.textSecondary }]}>
                        Remember your password?{' '}
                        <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                            Sign in
                        </Text>
                    </Text>
                </TouchableOpacity>
            </Link>

            <NotificationToast
                message={message?.text || ''}
                variant={message?.type || 'info'}
                visible={!!message}
                onDismiss={() => setMessage(null)}
                duration={sent ? 0 : 4000}
            />
        </AuthCard>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtext: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
    },
    form: {
        gap: 16,
        marginBottom: 16,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    link: {
        alignItems: 'center',
        paddingVertical: 8,
        minHeight: MIN_TOUCH_TARGET,
        justifyContent: 'center',
    },
    linkText: {
        fontSize: 14,
    },
});
