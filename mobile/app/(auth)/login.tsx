/**
 * Login Screen - Welcoming login with biometric option
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
import { BiometricButton } from '../../components/auth/BiometricButton';
import { Button } from '../../components/ui/Button';
import { NotificationToast } from '../../components/ui/NotificationToast';
import { useAuthStore } from '../../lib/store/auth';
import { api } from '../../lib/api';
import { getErrorMessage, toFriendlyError } from '../../lib/error-messages';
import { MIN_TOUCH_TARGET } from '../../lib/design-tokens';

export default function LoginScreen(): React.ReactElement {
    const { theme } = useTheme();
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const setTokens = useAuthStore((state) => state.setTokens);
    const setUser = useAuthStore((state) => state.setUser);

    const handleLogin = async (): Promise<void> => {
        if (!email || !password) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        try {
            const { data } = await api.post('/auth/login', { email, password });
            setTokens(data.tokens.accessToken, data.tokens.refreshToken);
            setUser(data.user);
            router.replace('/(tabs)');
        } catch (error) {
            const friendlyError = toFriendlyError(error);
            setErrorMessage(friendlyError.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBiometricSuccess = async (): Promise<void> => {
        // In production, would retrieve stored credentials from SecureStore
        // and auto-login
        setErrorMessage('Biometric login would use stored credentials');
    };

    const handleBiometricError = (error: string): void => {
        setErrorMessage(error);
    };

    return (
        <AuthCard showLogo>
            <Text style={[styles.welcomeText, { color: theme.colors.textPrimary }]}>
                Welcome back!
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
                    placeholder="Password"
                    placeholderTextColor={theme.colors.sage500}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoComplete="password"
                    accessibilityLabel="Password"
                />

                <View style={styles.rememberRow}>
                    <Switch
                        value={rememberMe}
                        onValueChange={setRememberMe}
                        trackColor={{
                            false: theme.colors.sage500 + '50',
                            true: theme.colors.primary + '80',
                        }}
                        thumbColor={rememberMe ? theme.colors.primary : '#f4f3f4'}
                    />
                    <Text style={[styles.rememberText, { color: theme.colors.textSecondary }]}>
                        Remember me
                    </Text>
                </View>

                <BiometricButton
                    onSuccess={handleBiometricSuccess}
                    onError={handleBiometricError}
                />

                <Button
                    label="Let's go!"
                    variant="primary"
                    size="large"
                    onPress={handleLogin}
                    loading={loading}
                    disabled={loading}
                />

                <Link href="/(auth)/forgot-password" asChild>
                    <TouchableOpacity style={styles.link}>
                        <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                            Forgot password?
                        </Text>
                    </TouchableOpacity>
                </Link>

                <Link href="/(auth)/register" asChild>
                    <TouchableOpacity style={styles.link}>
                        <Text style={[styles.linkText, { color: theme.colors.textSecondary }]}>
                            New here?{' '}
                            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
                                Create account
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
    rememberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        minHeight: MIN_TOUCH_TARGET,
    },
    rememberText: {
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
