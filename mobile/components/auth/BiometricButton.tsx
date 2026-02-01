/**
 * BiometricButton - Face ID / Touch ID button with availability check
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useTheme } from '../../lib/theme';
import { hapticButtonPress } from '../../lib/haptics';
import { MIN_TOUCH_TARGET } from '../../lib/design-tokens';

interface BiometricButtonProps {
    onSuccess: () => void;
    onError?: (error: string) => void;
}

type BiometricType = 'face' | 'fingerprint' | 'none';

export function BiometricButton({
    onSuccess,
    onError,
}: BiometricButtonProps): React.ReactElement | null {
    const { theme } = useTheme();
    const [isAvailable, setIsAvailable] = useState(false);
    const [biometricType, setBiometricType] = useState<BiometricType>('none');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkBiometricAvailability();
    }, []);

    const checkBiometricAvailability = async (): Promise<void> => {
        try {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();

            if (compatible && enrolled) {
                setIsAvailable(true);

                // Determine type of biometric
                const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
                if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                    setBiometricType('face');
                } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                    setBiometricType('fingerprint');
                }
            }
        } catch (error) {
            console.error('Biometric check failed:', error);
        }
    };

    const handleAuthenticate = async (): Promise<void> => {
        if (isLoading) return;

        setIsLoading(true);
        hapticButtonPress();

        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Sign in with biometrics',
                cancelLabel: 'Cancel',
                disableDeviceFallback: false,
                fallbackLabel: 'Use password',
            });

            if (result.success) {
                onSuccess();
            } else if (result.error) {
                onError?.("That didn't work. Try your password instead.");
            }
        } catch (error) {
            onError?.("That didn't work. Try your password instead.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAvailable) {
        return null;
    }

    const getIcon = (): string => {
        if (biometricType === 'face') {
            return Platform.OS === 'ios' ? '👤' : '👤';
        }
        return '👆';
    };

    const getLabel = (): string => {
        if (biometricType === 'face') {
            return Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition';
        }
        return 'Fingerprint';
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    backgroundColor: theme.colors.neutralElevated,
                    borderColor: theme.colors.sage500 + '50',
                },
            ]}
            onPress={handleAuthenticate}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel={`Sign in with ${getLabel()}`}
        >
            <View style={styles.content}>
                <Text style={styles.icon}>{getIcon()}</Text>
                <Text style={[styles.label, { color: theme.colors.textPrimary }]}>
                    {getLabel()}
                </Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        minHeight: MIN_TOUCH_TARGET,
        borderRadius: 12,
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    icon: {
        fontSize: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default BiometricButton;
