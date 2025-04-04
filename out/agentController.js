"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentController = void 0;
const vscode = require("vscode");
const cp = require("child_process");
const util_1 = require("util");
const utils_1 = require("./utils");
const exec = (0, util_1.promisify)(cp.exec);
class AgentController {
    constructor(outputChannel) {
        this.isProEnabled = false;
        this.outputChannel = outputChannel;
    }
    async handleMessage(message) {
        try {
            switch (message.type) {
                case 'createFile':
                    return await this.createFile(message.payload);
                case 'editFile':
                    return await this.editFile(message.payload);
                case 'executeCommand':
                    return await this.executeCommand(message.payload);
                case 'openBrowser':
                    return await this.openBrowser(message.payload);
                case 'checkProStatus':
                    return { type: 'proStatus', isEnabled: this.isProEnabled };
                default:
                    throw new Error(`Unknown message type: ${message.type}`);
            }
        }
        catch (error) {
            (0, utils_1.logError)(this.outputChannel, `Error in handleMessage: ${error}`);
            return {
                type: 'error',
                message: error instanceof Error ? error.message : 'An unknown error occurred'
            };
        }
    }
    async createFile(payload) {
        try {
            const { path, content } = payload;
            if (!(0, utils_1.validateFileName)(path)) {
                throw new Error(utils_1.ERROR_MESSAGES.INVALID_INPUT);
            }
            const uri = vscode.Uri.file(path);
            const encoder = new TextEncoder();
            await vscode.workspace.fs.writeFile(uri, encoder.encode((0, utils_1.sanitizeInput)(content)));
            (0, utils_1.logInfo)(this.outputChannel, `File created successfully: ${path}`);
            return {
                type: 'success',
                message: 'File created successfully'
            };
        }
        catch (error) {
            (0, utils_1.logError)(this.outputChannel, `Error creating file: ${error}`);
            throw new Error(utils_1.ERROR_MESSAGES.FILE_CREATE);
        }
    }
    async editFile(payload) {
        try {
            const { path, content } = payload;
            if (!(0, utils_1.validateFileName)(path)) {
                throw new Error(utils_1.ERROR_MESSAGES.INVALID_INPUT);
            }
            const uri = vscode.Uri.file(path);
            const encoder = new TextEncoder();
            await vscode.workspace.fs.writeFile(uri, encoder.encode((0, utils_1.sanitizeInput)(content)));
            (0, utils_1.logInfo)(this.outputChannel, `File edited successfully: ${path}`);
            return {
                type: 'success',
                message: 'File edited successfully'
            };
        }
        catch (error) {
            (0, utils_1.logError)(this.outputChannel, `Error editing file: ${error}`);
            throw new Error(utils_1.ERROR_MESSAGES.FILE_EDIT);
        }
    }
    async executeCommand(payload) {
        try {
            const { command } = payload;
            const sanitizedCommand = (0, utils_1.sanitizeInput)(command);
            if (!sanitizedCommand) {
                throw new Error(utils_1.ERROR_MESSAGES.INVALID_INPUT);
            }
            const result = await exec(sanitizedCommand);
            (0, utils_1.logInfo)(this.outputChannel, `Command executed successfully: ${sanitizedCommand}`);
            return {
                type: 'success',
                message: 'Command executed successfully',
                data: {
                    stdout: result.stdout,
                    stderr: result.stderr
                }
            };
        }
        catch (error) {
            (0, utils_1.logError)(this.outputChannel, `Error executing command: ${error}`);
            throw new Error(utils_1.ERROR_MESSAGES.COMMAND_EXECUTE);
        }
    }
    async openBrowser(payload) {
        try {
            const { url } = payload;
            if (!url || !url.startsWith('http')) {
                throw new Error(utils_1.ERROR_MESSAGES.INVALID_INPUT);
            }
            // For web-based VSCode, we'll use a specific command to open URLs
            await vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
            (0, utils_1.logInfo)(this.outputChannel, `Browser opened successfully for URL: ${url}`);
            return {
                type: 'success',
                message: 'Browser opened successfully'
            };
        }
        catch (error) {
            (0, utils_1.logError)(this.outputChannel, `Error opening browser: ${error}`);
            throw new Error(utils_1.ERROR_MESSAGES.BROWSER_OPEN);
        }
    }
    checkProAccess(feature) {
        if ((0, utils_1.isProFeature)(feature) && !this.isProEnabled) {
            throw new Error(utils_1.ERROR_MESSAGES.PRO_FEATURE);
        }
        return true;
    }
}
exports.AgentController = AgentController;
//# sourceMappingURL=agentController.js.map