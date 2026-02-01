/**
 * GardenCanvas - SVG-based garden visualization
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../lib/theme';
import { hapticButtonPress } from '../../lib/haptics';

interface GardenElement {
    id: string;
    type: 'flower' | 'tree';
    x: number;
    y: number;
    taskTitle: string;
}

interface GardenCanvasProps {
    elements: GardenElement[];
    onElementPress?: (element: GardenElement) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CANVAS_SIZE = SCREEN_WIDTH - 32;

function Flower({ x, y, onPress }: { x: number; y: number; onPress: () => void }): React.ReactElement {
    const { theme } = useTheme();
    const scale = useSharedValue(1);

    const handlePress = (): void => {
        scale.value = withSpring(1.2, {}, () => {
            scale.value = withSpring(1);
        });
        hapticButtonPress();
        onPress();
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <TouchableOpacity
            style={[styles.element, { left: x, top: y }]}
            onPress={handlePress}
            activeOpacity={0.8}
        >
            <Animated.View style={animatedStyle}>
                <View style={[styles.flowerCenter, { backgroundColor: theme.colors.warning }]} />
                <View style={[styles.petal, styles.petalTop, { backgroundColor: theme.colors.primary }]} />
                <View style={[styles.petal, styles.petalRight, { backgroundColor: theme.colors.primary }]} />
                <View style={[styles.petal, styles.petalBottom, { backgroundColor: theme.colors.primary }]} />
                <View style={[styles.petal, styles.petalLeft, { backgroundColor: theme.colors.primary }]} />
            </Animated.View>
        </TouchableOpacity>
    );
}

function Tree({ x, y, onPress }: { x: number; y: number; onPress: () => void }): React.ReactElement {
    const { theme } = useTheme();
    const scale = useSharedValue(1);

    const handlePress = (): void => {
        scale.value = withSpring(1.1, {}, () => {
            scale.value = withSpring(1);
        });
        hapticButtonPress();
        onPress();
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <TouchableOpacity
            style={[styles.element, { left: x, top: y }]}
            onPress={handlePress}
            activeOpacity={0.8}
        >
            <Animated.View style={[styles.tree, animatedStyle]}>
                <View style={[styles.treeTop, { backgroundColor: theme.colors.success }]} />
                <View style={[styles.treeTrunk, { backgroundColor: theme.colors.sand500 }]} />
            </Animated.View>
        </TouchableOpacity>
    );
}

export function GardenCanvas({
    elements,
    onElementPress,
}: GardenCanvasProps): React.ReactElement {
    const { theme } = useTheme();

    return (
        <View
            style={[
                styles.canvas,
                { backgroundColor: theme.colors.neutralElevated },
            ]}
        >
            {/* Sky gradient effect */}
            <View style={[styles.sky, { backgroundColor: theme.colors.secondary + '20' }]} />

            {/* Ground */}
            <View style={[styles.ground, { backgroundColor: theme.colors.success + '30' }]} />

            {/* Garden elements */}
            {elements.map((element) =>
                element.type === 'flower' ? (
                    <Flower
                        key={element.id}
                        x={element.x}
                        y={element.y}
                        onPress={() => onElementPress?.(element)}
                    />
                ) : (
                    <Tree
                        key={element.id}
                        x={element.x}
                        y={element.y}
                        onPress={() => onElementPress?.(element)}
                    />
                )
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    canvas: {
        width: CANVAS_SIZE,
        height: CANVAS_SIZE,
        borderRadius: 20,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    sky: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '60%',
    },
    ground: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '40%',
    },
    element: {
        position: 'absolute',
    },
    flowerCenter: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    petal: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    petalTop: {
        top: -8,
        left: 1,
    },
    petalRight: {
        top: 1,
        left: 10,
    },
    petalBottom: {
        top: 10,
        left: 1,
    },
    petalLeft: {
        top: 1,
        left: -8,
    },
    tree: {
        alignItems: 'center',
    },
    treeTop: {
        width: 40,
        height: 50,
        borderRadius: 20,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
    },
    treeTrunk: {
        width: 10,
        height: 20,
        borderRadius: 2,
    },
});

export default GardenCanvas;
