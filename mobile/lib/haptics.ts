/**
 * Haptic feedback configuration for SpurTalk Mobile App
 * Provides tactile feedback for key interactions
 */

import * as Haptics from 'expo-haptics';

/**
 * Trigger haptic feedback for button press
 */
export async function hapticButtonPress(): Promise<void> {
    try {
        await Haptics.selectionAsync();
    } catch {
        // Haptics may not be available on all devices
    }
}

/**
 * Trigger haptic feedback when a swipe is completed
 */
export async function hapticSwipeComplete(): Promise<void> {
    try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
        // Haptics may not be available on all devices
    }
}

/**
 * Trigger haptic feedback when a task is completed
 */
export async function hapticTaskComplete(): Promise<void> {
    try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
        // Haptics may not be available on all devices
    }
}

/**
 * Trigger haptic feedback for soft warning (no harsh feedback)
 */
export async function hapticWarning(): Promise<void> {
    try {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
        // Haptics may not be available on all devices
    }
}

/**
 * Trigger haptic feedback for medium impact (e.g., unblocker swipe)
 */
export async function hapticMediumImpact(): Promise<void> {
    try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
        // Haptics may not be available on all devices
    }
}

/**
 * Trigger haptic feedback for heavy impact (rarely used)
 */
export async function hapticHeavyImpact(): Promise<void> {
    try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
        // Haptics may not be available on all devices
    }
}

/**
 * All haptic feedback functions in one object
 */
export const haptics = {
    buttonPress: hapticButtonPress,
    swipeComplete: hapticSwipeComplete,
    taskComplete: hapticTaskComplete,
    warning: hapticWarning,
    mediumImpact: hapticMediumImpact,
    heavyImpact: hapticHeavyImpact,
};

export default haptics;
