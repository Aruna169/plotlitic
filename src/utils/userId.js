/**
 * User ID Management
 * Generates and stores anonymous user ID in localStorage
 */

const USER_ID_KEY = 'graphApp_userId';

/**
 * Generate a simple UUID v4
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Get or create user ID
 * Returns the user's anonymous ID from localStorage, or creates a new one
 */
export function getUserId() {
    let userId = localStorage.getItem(USER_ID_KEY);

    if (!userId) {
        userId = generateUUID();
        localStorage.setItem(USER_ID_KEY, userId);
    }

    return userId;
}

/**
 * Clear user ID (for testing purposes)
 */
export function clearUserId() {
    localStorage.removeItem(USER_ID_KEY);
}
