/**
 * DeckControls - Button alternatives for accessibility
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/theme';
import { Button } from '../ui/Button';
import { MIN_TOUCH_TARGET } from '../../lib/design-tokens';

interface DeckControlsProps {
    onDoNow: () => void;
    onNotNow: () => void;
    onBreakDown: () => void;
    disabled?: boolean;
}

export function DeckControls({
    onDoNow,
    onNotNow,
    onBreakDown,
    disabled = false,
}: DeckControlsProps): React.ReactElement {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.buttonWrapper}>
                    <Button
                        label="Not right now"
                        variant="ghost"
                        onPress={onNotNow}
                        disabled={disabled}
                        icon={<View style={styles.iconPlaceholder} />}
                    />
                </View>

                <View style={styles.buttonWrapper}>
                    <Button
                        label="Do this now"
                        variant="primary"
                        size="large"
                        onPress={onDoNow}
                        disabled={disabled}
                        icon={<View style={styles.iconPlaceholder} />}
                    />
                </View>
            </View>

            <Button
                label="Break this down"
                variant="secondary"
                onPress={onBreakDown}
                disabled={disabled}
                icon={<View style={styles.iconPlaceholder} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 12,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    buttonWrapper: {
        flex: 1,
    },
    iconPlaceholder: {
        width: 20,
        height: 20,
    },
});

export default DeckControls;
