import * as vscode from 'vscode';

export function logInfo(outputChannel: vscode.OutputChannel, message: string): void {
    const timestamp = new Date().toISOString();
    outputChannel.appendLine(`[INFO ${timestamp}] ${message}`);
}

export function logError(outputChannel: vscode.OutputChannel, message: string): void {
    const timestamp = new Date().toISOString();
    outputChannel.appendLine(`[ERROR ${timestamp}] ${message}`);
}

export function validateFileName(fileName: string): boolean {
    // Check if filename is valid and doesn't contain illegal characters
    const illegalChars = /[<>:"/\\|?*\x00-\x1F]/;
    return !illegalChars.test(fileName);
}

export function sanitizeInput(input: string): string {
    // Basic input sanitization
    return input.trim();
}

export function isProFeature(featureName: string): boolean {
    const proFeatures = [
        'advancedCodeGeneration',
        'customTemplates',
        'teamCollaboration',
        'codeAnalytics'
    ];
    return proFeatures.includes(featureName);
}

export function formatError(error: any): string {
    if (error instanceof Error) {
        return `${error.name}: ${error.message}`;
    }
    return String(error);
}

export function generateUniqueId(): string {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function debounce(func: Function, wait: number): (...args: any[]) => void {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function checkFileExists(uri: vscode.Uri): Promise<boolean> {
    return vscode.workspace.fs.stat(uri)
        .then(() => true)
        .catch(() => false);
}

export const EXTENSION_NAME = 'Autonomous Coding Agent';
export const CREATOR_NAME = 'Marty Montgomery';
export const VERSION = '1.0.0';

export const ERROR_MESSAGES = {
    FILE_CREATE: 'Failed to create file',
    FILE_EDIT: 'Failed to edit file',
    COMMAND_EXECUTE: 'Failed to execute command',
    BROWSER_OPEN: 'Failed to open browser',
    INVALID_INPUT: 'Invalid input provided',
    PRO_FEATURE: 'This feature requires a Pro subscription',
    UNKNOWN_ERROR: 'An unknown error occurred'
};