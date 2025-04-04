"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_MESSAGES = exports.VERSION = exports.CREATOR_NAME = exports.EXTENSION_NAME = exports.checkFileExists = exports.debounce = exports.generateUniqueId = exports.formatError = exports.isProFeature = exports.sanitizeInput = exports.validateFileName = exports.logError = exports.logInfo = void 0;
const vscode = require("vscode");
function logInfo(outputChannel, message) {
    const timestamp = new Date().toISOString();
    outputChannel.appendLine(`[INFO ${timestamp}] ${message}`);
}
exports.logInfo = logInfo;
function logError(outputChannel, message) {
    const timestamp = new Date().toISOString();
    outputChannel.appendLine(`[ERROR ${timestamp}] ${message}`);
}
exports.logError = logError;
function validateFileName(fileName) {
    // Check if filename is valid and doesn't contain illegal characters
    const illegalChars = /[<>:"/\\|?*\x00-\x1F]/;
    return !illegalChars.test(fileName);
}
exports.validateFileName = validateFileName;
function sanitizeInput(input) {
    // Basic input sanitization
    return input.trim();
}
exports.sanitizeInput = sanitizeInput;
function isProFeature(featureName) {
    const proFeatures = [
        'advancedCodeGeneration',
        'customTemplates',
        'teamCollaboration',
        'codeAnalytics'
    ];
    return proFeatures.includes(featureName);
}
exports.isProFeature = isProFeature;
function formatError(error) {
    if (error instanceof Error) {
        return `${error.name}: ${error.message}`;
    }
    return String(error);
}
exports.formatError = formatError;
function generateUniqueId() {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
exports.generateUniqueId = generateUniqueId;
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
exports.debounce = debounce;
async function checkFileExists(uri) {
    try {
        await vscode.workspace.fs.stat(uri);
        return true;
    }
    catch {
        return false;
    }
}
exports.checkFileExists = checkFileExists;
exports.EXTENSION_NAME = 'Autonomous Coding Agent';
exports.CREATOR_NAME = 'Marty Montgomery';
exports.VERSION = '1.0.0';
exports.ERROR_MESSAGES = {
    FILE_CREATE: 'Failed to create file',
    FILE_EDIT: 'Failed to edit file',
    COMMAND_EXECUTE: 'Failed to execute command',
    BROWSER_OPEN: 'Failed to open browser',
    INVALID_INPUT: 'Invalid input provided',
    PRO_FEATURE: 'This feature requires a Pro subscription',
    UNKNOWN_ERROR: 'An unknown error occurred'
};
//# sourceMappingURL=utils.js.map