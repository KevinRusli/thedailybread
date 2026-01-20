/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VideoHistoryItem } from './types';

const STORAGE_KEY = 'dailybread_video_history';
const DOWNLOADS_FOLDER = 'downloads';

/**
 * Save video history to localStorage
 */
export function saveHistoryToStorage(history: VideoHistoryItem[]): void {
    try {
        // Store only essential data (not blob/videoObject)
        const storableHistory = history.map(item => ({
            id: item.id,
            url: item.url,
            timestamp: item.timestamp,
            prompt: item.prompt,
            config: item.config,
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storableHistory));
    } catch (error) {
        console.error('Failed to save history to localStorage:', error);
    }
}

/**
 * Load video history from localStorage
 */
export function loadHistoryFromStorage(): VideoHistoryItem[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const parsed = JSON.parse(stored);
        return parsed.map((item: any) => ({
            ...item,
            blob: null, // Blob can't be stored
            videoObject: null, // Video object can't be stored
        }));
    } catch (error) {
        console.error('Failed to load history from localStorage:', error);
        return [];
    }
}

/**
 * Save video blob to downloads folder
 */
export async function saveVideoToDownloads(blob: Blob, filename: string): Promise<string> {
    try {
        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 100);

        return filename;
    } catch (error) {
        console.error('Failed to save video:', error);
        throw error;
    }
}

/**
 * Open downloads folder (trigger browser downloads)
 */
export function openDownloadsFolder(): void {
    // In browser context, we can only trigger download
    // For Electron, we can actually open the folder
    if (typeof window !== 'undefined' && (window as any).electron) {
        // Electron-specific code can go here
        console.log('Opening downloads folder via Electron...');
    } else {
        alert('Videos are saved to your browser\'s Downloads folder.\n\nYou can find them at:\nWindows: C:\\Users\\YourName\\Downloads\nMac: /Users/YourName/Downloads');
    }
}

/**
 * Format filename for saved video
 */
export function formatVideoFilename(prompt: string, id: string): string {
    // Clean prompt for filename (remove special chars, limit length)
    const cleanPrompt = prompt
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 30);

    const timestamp = new Date().toISOString().split('T')[0];
    return `dailybread-${cleanPrompt}-${timestamp}-${id.substring(0, 8)}.mp4`;
}
