/**
 * Register Screen - Encouraging registration with minimal required fields
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Switch,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTheme } from '../../lib/theme';
import { AuthCard } from '../../components/auth/AuthCard';
import { Button } from '../../components/ui/Button';
import { NotificationToast } from '../../components/ui/NotificationToast';
import { useAuthStore } from '../../lib/store/auth';
import { api } from '../../lib/api';
import { toFriendlyError } from '../../lib/error-messages';
import { MIN_TOUCH_TARGET } from '../../lib/design-tokens';

export default function RegisterScreen(): React.ReactElement {
    const { theme } = useTheme();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const setTokens = useAuthStore((state) => state.setTokens);
    const setUser = useAuthStore((state) => state.setUser);

    const handleRegister = async (): Promise<void> => {
        if (!email || !password || !confirmPassword) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Those passwords don't quite match - let's try again!");
            return;
        }

        if (!agreeToTerms) {
            setErrorMessage('Please agree to the terms to continue');
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        try {
            const { data } = await api.post('/auth/register', { email, password });
            setTokens(data.tokens.accessToken, data.tokens.refreshToken);
            setUser(data.user);
            router.replace('/(tabs)');
        } catch (error: any) {
            if (error.response?.status === 409) {
                setErrorMessage(
                    'Looks like you already have an account! Try signing in instead.'
                );
            } else {
                const friendlyError = toFriendlyError(error);
                setErrorMessage(friendlyError.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard showLogo>
            <Text style={[styles.welcomeText, { color: theme.colors.textPrimary }]}>
                Ready to start?
            </Text>
            <Text style={[styles.subtext, { color: theme.colors.textSecondary }]}>
                No pressure. Just possibilities.
            </Text>

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

                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: theme.colors.neutral,
                            borderColor: theme.colors.sage500 + '50',
                            color: theme.colors.textPrimary,
                        },
                    ]}
                    placeholder="Create password"
                    placeholderTextColor={theme.colors.sage500}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoComplete="new-password"
                    accessibilityLabel="Password"
                />

                <TextInput
                    style={[
                        styles.input,
                        {
                            backgroundColor: theme.colors.neutral,
                            borderColor: theme.colors.sage500 + '50',
                            color: theme.colors.textPrimary,
                        },
                    ]}
                    placeholder="Confirm password"
                    placeholderTextColor={theme.colors.sage500}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoComplete="new-password"
                    accessibilityLabel="Confirm password"
                />

                <View style={styles.termsRow}>
                    <Switch
                        value={agreeToTerms}
                        onValueChange={setAgreeToTerms}
                        trackColor={{
                            false: theme.colors.sage500 + '50',
                            true: theme.colors.primary + '80',
                        }}
                        thumbColor={agreeToTerms ? theme.colors.primary : '#f4f3f4'}
                    />
                    <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
                        I agree to the terms
                    </Text>
                </View>

                <Button
                    label="Create my space"
                    variant="primary"
                    size="large"
                    onPress={handleRegister}
                    loading={loading}
                    disabled={loading}
                />

                <Link href="/(auth)/login" asChild>
                    <TouchableOpacity style={styles.link}>
                        <Text style={[styles.linkText, { color: theme.colors.textSecondary }]}>
                            Already have an account?{' '}
                            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                                Sign in
                            </Text>
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>

            <NotificationToast
                message={errorMessage || ''}
                variant="attention"
                visible={!!errorMessage}
                onDismiss={() => setErrorMessage(null)}
            />
        </AuthCard>
    );
}

const styles = StyleSheet.create({
    welcomeText: {
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
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    termsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        minHeight: MIN_TOUCH_TARGET,
    },
    termsText: {
        fontSize: 14,
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
