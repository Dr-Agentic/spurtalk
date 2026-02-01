/**
 * Friendly error messages for SpurTalk Mobile App
 * All error states use encouraging, non-judgmental language
 */

import { FORBIDDEN_WORDS } from './design-tokens';

export interface ErrorMessage {
    title: string;
    message: string;
    icon?: string;
}

export const ERROR_MESSAGES: Record<string, ErrorMessage> = {
    networkError: {
        title: 'Taking a moment to reconnect',
        message: 'We\'re having trouble reaching our servers. Your work is safe!',
        icon: 'CloudOff',
    },
    authError: {
        title: 'Let\'s try that again',
        message: 'Something didn\'t match. No worries, it happens!',
        icon: 'Key',
    },
    processingError: {
        title: 'Hmm, that didn\'t work',
        message: 'We couldn\'t process that. Maybe try again?',
        icon: 'RefreshCw',
    },
    invalidCredentials: {
        title: 'Let\'s try that again',
        message: 'Something didn\'t match. No worries!',
        icon: 'Lock',
    },
    biometricFailed: {
        title: 'That didn\'t work',
        message: 'Try your password instead.',
        icon: 'Fingerprint',
    },
    passwordMismatch: {
        title: 'Almost there!',
        message: 'Those passwords don\'t quite match - let\'s try again!',
        icon: 'Check',
    },
    emailTaken: {
        title: 'Welcome back!',
        message: 'Looks like you already have an account! Try signing in instead.',
        icon: 'User',
    },
    taskSaveError: {
        title: 'Saving took a detour',
        message: 'We couldn\'t save that right now. Your changes are temporarily stored.',
        icon: 'Save',
    },
    loadError: {
        title: 'Taking a bit longer',
        message: 'We\'re having trouble loading that. Give it another try?',
        icon: 'Download',
    },
    timeoutError: {
        title: 'Things are slow right now',
        message: 'The request took too long. Want to try again?',
        icon: 'Clock',
    },
    sessionExpired: {
        title: 'Time for a quick refresh',
        message: 'Your session has expired. Sign in again to continue.',
        icon: 'LogIn',
    },
};

/**
 * Get a friendly error message for a given error type
 */
export function getErrorMessage(errorType: string): ErrorMessage {
    return ERROR_MESSAGES[errorType] || ERROR_MESSAGES.processingError;
}

/**
 * Validate that a message doesn't contain forbidden words
 */
export function validateMessage(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return !FORBIDDEN_WORDS.some(word =>
        lowerMessage.includes(word.toLowerCase())
    );
}

/**
 * Convert a technical error to a friendly message
 */
export function toFriendlyError(error: unknown): ErrorMessage {
    if (error instanceof Error) {
        const message = error.message.toLowerCase();

        if (message.includes('network') || message.includes('fetch')) {
            return ERROR_MESSAGES.networkError;
        }
        if (message.includes('401') || message.includes('unauthorized')) {
            return ERROR_MESSAGES.authError;
        }
        if (message.includes('timeout')) {
            return ERROR_MESSAGES.timeoutError;
        }
        if (message.includes('session') || message.includes('expired')) {
            return ERROR_MESSAGES.sessionExpired;
        }
    }

    return ERROR_MESSAGES.processingError;
}

// Long loading messages for extended operations
export const LONG_LOADING_MESSAGES = [
    'Still working on it...',
    'Almost there...',
    'Good things take time...',
    'Just a moment more...',
    'Making progress...',
] as const;

/**
 * Get a random long loading message
 */
export function getLoadingMessage(): string {
    return LONG_LOADING_MESSAGES[Math.floor(Math.random() * LONG_LOADING_MESSAGES.length)];
}
