/**
 * Hook to respect accessibility reduce motion setting
 */

import { useState, useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Returns true if the user has enabled "Reduce Motion" in system settings
 */
export function useReducedMotion(): boolean {
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        // Check initial value
        AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);

        // Subscribe to changes
        const subscription = AccessibilityInfo.addEventListener(
            'reduceMotionChanged',
            setReduceMotion
        );

        return () => {
            subscription.remove();
        };
    }, []);

    return reduceMotion;
}

export default useReducedMotion;
