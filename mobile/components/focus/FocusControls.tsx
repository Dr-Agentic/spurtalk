/**
 * FocusControls - Done/Stuck/Pause buttons
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../ui/Button';

interface FocusControlsProps {
    onDone: () => void;
    onStuck: () => void;
    onPause: () => void;
}

export function FocusControls({
    onDone,
    onStuck,
    onPause,
}: FocusControlsProps): React.ReactElement {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
            <Button
                label="Done (for now)!"
                variant="primary"
                size="large"
                onPress={onDone}
            />
            <View style={styles.secondaryButtons}>
                <View style={styles.buttonHalf}>
                    <Button
                        label="I'm stuck"
                        variant="secondary"
                        onPress={onStuck}
                    />
                </View>
                <View style={styles.buttonHalf}>
                    <Button
                        label="Take a breath"
                        variant="ghost"
                        onPress={onPause}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 12,
    },
    secondaryButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    buttonHalf: {
        flex: 1,
    },
});

export default FocusControls;
