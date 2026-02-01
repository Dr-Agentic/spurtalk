/**
 * Notification toast component with friendly variants
 * NO red error variant - uses encouraging colors instead
 */

import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withDelay,
    runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../lib/theme';
import { hapticButtonPress } from '../../lib/haptics';
import type { ToastVariant } from '../../types';

interface NotificationToastProps {
    message: string;
    variant?: ToastVariant;
    visible: boolean;
    onDismiss: () => void;
    duration?: number;
    action?: {
        label: string;
        onPress: () => void;
    };
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function NotificationToast({
    message,
    variant = 'info',
    visible,
    onDismiss,
    duration = 4000,
    action,
}: NotificationToastProps): React.ReactElement | null {
    const { theme } = useTheme();
    const translateY = useSharedValue(-100);
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            translateY.value = withSpring(0, { damping: 15 });
            opacity.value = withSpring(1);

            if (duration > 0) {
                const timer = setTimeout(() => {
                    dismissToast();
                }, duration);
                return () => clearTimeout(timer);
            }
        } else {
            translateY.value = withSpring(-100);
            opacity.value = withDelay(100, withSpring(0));
        }
    }, [visible, duration]);

    const dismissToast = (): void => {
        translateY.value = withSpring(-100, {}, (finished) => {
            if (finished) {
                runOnJS(onDismiss)();
            }
        });
        opacity.value = withSpring(0);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        opacity: opacity.value,
    }));

    const getBackgroundColor = (): string => {
        switch (variant) {
            case 'success':
                return theme.colors.primary;
            case 'info':
                return theme.colors.secondary;
            case 'attention':
                return theme.colors.warning;
            default:
                return theme.colors.secondary;
        }
    };

    const getIcon = (): string => {
        switch (variant) {
            case 'success':
                return '✨'; // Sparkles
            case 'info':
                return '💡'; // Lightbulb
            case 'attention':
                return '⭐'; // Star
            default:
                return '💡';
        }
    };

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor: getBackgroundColor() },
                animatedStyle,
            ]}
        >
            <TouchableOpacity
                style={styles.content}
                onPress={() => {
                    hapticButtonPress();
                    dismissToast();
                }}
                activeOpacity={0.9}
            >
                <Text style={styles.icon}>{getIcon()}</Text>
                <Text style={styles.message} numberOfLines={2}>
                    {message}
                </Text>
                {action && (
                    <TouchableOpacity
                        onPress={() => {
                            hapticButtonPress();
                            action.onPress();
                            dismissToast();
                        }}
                        style={styles.actionButton}
                    >
                        <Text style={styles.actionText}>{action.label}</Text>
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 50,
        left: 16,
        right: 16,
        maxWidth: SCREEN_WIDTH - 32,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        zIndex: 1000,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    icon: {
        fontSize: 20,
        marginRight: 12,
    },
    message: {
        flex: 1,
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
    actionButton: {
        marginLeft: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 6,
    },
    actionText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default NotificationToast;
