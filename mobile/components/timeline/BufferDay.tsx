/**
 * BufferDay - Rest day indicator before deadlines
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/theme';

interface BufferDayProps {
    message?: string;
}

export function BufferDay({
    message = 'Rest day before deadline',
}: BufferDayProps): React.ReactElement {
    const { theme } = useTheme();

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: theme.colors.secondary + '15' },
            ]}
        >
            <Text style={styles.icon}>☕</Text>
            <Text style={[styles.message, { color: theme.colors.secondary }]}>
                {message}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        gap: 12,
    },
    icon: {
        fontSize: 24,
    },
    message: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export default BufferDay;
