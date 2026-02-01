/**
 * Button component with variants and accessibility support
 */

import React, { useCallback } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    View,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../lib/theme';
import { MIN_TOUCH_TARGET } from '../../lib/design-tokens';
import { hapticButtonPress } from '../../lib/haptics';
import { useReducedMotion } from '../../lib/hooks/useReducedMotion';
import type { ButtonVariant, ButtonSize } from '../../types';

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    accessibilityLabel?: string;
    testID?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function Button({
    label,
    onPress,
    variant = 'primary',
    size = 'medium',
    loading = false,
    disabled = false,
    icon,
    accessibilityLabel,
    testID,
}: ButtonProps): React.ReactElement {
    const { theme } = useTheme();
    const reduceMotion = useReducedMotion();
    const scale = useSharedValue(1);

    const handlePressIn = useCallback(() => {
        if (!reduceMotion) {
            scale.value = withSpring(0.96);
        }
        hapticButtonPress();
    }, [reduceMotion, scale]);

    const handlePressOut = useCallback(() => {
        if (!reduceMotion) {
            scale.value = withSpring(1);
        }
    }, [reduceMotion, scale]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const getButtonStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
            minHeight: MIN_TOUCH_TARGET,
            borderRadius: theme.radii.md,
            paddingHorizontal: size === 'large' ? 24 : size === 'small' ? 12 : 16,
            paddingVertical: size === 'large' ? 16 : size === 'small' ? 8 : 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled ? 0.5 : 1,
        };

        switch (variant) {
            case 'primary':
                return {
                    ...baseStyle,
                    backgroundColor: theme.colors.primary,
                };
            case 'secondary':
                return {
                    ...baseStyle,
                    backgroundColor: theme.colors.secondary,
                };
            case 'ghost':
                return {
                    ...baseStyle,
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: theme.colors.sage500,
                };
            case 'danger-soft':
                return {
                    ...baseStyle,
                    backgroundColor: theme.colors.sand500 + '20', // 20% opacity
                };
            default:
                return baseStyle;
        }
    };

    const getTextStyle = (): TextStyle => {
        const baseStyle: TextStyle = {
            fontWeight: '600',
            fontSize: size === 'large' ? 18 : size === 'small' ? 14 : 16,
        };

        switch (variant) {
            case 'primary':
                return {
                    ...baseStyle,
                    color: theme.colors.primaryForeground,
                };
            case 'secondary':
                return {
                    ...baseStyle,
                    color: theme.colors.secondaryForeground,
                };
            case 'ghost':
                return {
                    ...baseStyle,
                    color: theme.colors.textPrimary,
                };
            case 'danger-soft':
                return {
                    ...baseStyle,
                    color: theme.colors.sand500,
                };
            default:
                return baseStyle;
        }
    };

    return (
        <AnimatedTouchable
            style={[getButtonStyle(), animatedStyle]}
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            accessibilityLabel={accessibilityLabel || label}
            accessibilityRole="button"
            accessibilityState={{ disabled: disabled || loading }}
            testID={testID}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'ghost' || variant === 'danger-soft'
                        ? theme.colors.textPrimary
                        : theme.colors.primaryForeground}
                    size="small"
                />
            ) : (
                <View style={styles.content}>
                    {icon && <View style={styles.icon}>{icon}</View>}
                    <Text style={getTextStyle()}>{label}</Text>
                </View>
            )}
        </AnimatedTouchable>
    );
}

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginRight: 8,
    },
});

export default Button;
