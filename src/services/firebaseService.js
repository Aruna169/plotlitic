/**
 * Firebase Service
 * Handles all Firebase operations for saving app feedback
 */

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getUserId } from '../utils/userId';

/**
 * Save app feedback to Firebase
 * @param {Object} data - Feedback data to save
 * @param {Array} data.validPoints - Array of {x, y} points
 * @param {string} data.feedback - User's feedback
 * @param {Object} data.sheetSize - Sheet dimensions
 * @param {Object} data.sheetSize - Sheet dimensions
 * @param {Object} data.squeeze - Squeeze settings
 * @param {string} data.sessionId - Unique session ID for the tab
 * @param {number} data.sessionStartTime - Timestamp when session started
 * @param {number} data.duration - Duration in ms since session start
 * @param {number} data.interval - Time in ms since last action
 * @returns {Promise<string>} Document ID
 */
export async function saveAppFeedback(data) {
    try {
        const userId = getUserId();

        const docData = {
            userId,
            timestamp: serverTimestamp(),
            feedback: data.feedback,
            validPoints: data.validPoints,
            sheetSize: data.sheetSize,
            sheetSize: data.sheetSize,
            squeeze: data.squeeze,
            sessionId: data.sessionId,
            sessionStartTime: data.sessionStartTime,
            duration: data.duration,
            interval: data.interval
        };

        const docRef = await addDoc(collection(db, 'appFeedback'), docData);

        console.log('Feedback saved with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error saving feedback:', error);
        throw error;
    }
}
