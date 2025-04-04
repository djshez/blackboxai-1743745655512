import * as vscode from 'vscode';
import * as cp from 'child_process';
import { promisify } from 'util';
import { logInfo, logError, validateFileName, sanitizeInput, isProFeature, ERROR_MESSAGES } from './utils';

const exec = promisify(cp.exec);

interface CommandResult {
    stdout: string;
    stderr: string;
}

export class AgentController {
    private isProEnabled: boolean = false;
    private outputChannel: vscode.OutputChannel;

    constructor(outputChannel: vscode.OutputChannel) {
        this.outputChannel = outputChannel;
    }

    async handleMessage(message: any): Promise<any> {
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
        } catch (error) {
            logError(this.outputChannel, `Error in handleMessage: ${error}`);
            return {
                type: 'error',
                message: error instanceof Error ? error.message : 'An unknown error occurred'
            };
        }
    }

    private async createFile(payload: { path: string; content: string }): Promise<any> {
        try {
            const { path, content } = payload;
            
            if (!validateFileName(path)) {
                throw new Error(ERROR_MESSAGES.INVALID_INPUT);
            }

            const uri = vscode.Uri.file(path);
            const encoder = new TextEncoder();
            await vscode.workspace.fs.writeFile(uri, encoder.encode(sanitizeInput(content)));
            
            logInfo(this.outputChannel, `File created successfully: ${path}`);
            return {
                type: 'success',
                message: 'File created successfully'
            };
        } catch (error) {
            logError(this.outputChannel, `Error creating file: ${error}`);
            throw new Error(ERROR_MESSAGES.FILE_CREATE);
        }
    }

    private async editFile(payload: { path: string; content: string }): Promise<any> {
        try {
            const { path, content } = payload;
            
            if (!validateFileName(path)) {
                throw new Error(ERROR_MESSAGES.INVALID_INPUT);
            }

            const uri = vscode.Uri.file(path);
            const encoder = new TextEncoder();
            await vscode.workspace.fs.writeFile(uri, encoder.encode(sanitizeInput(content)));
            
            logInfo(this.outputChannel, `File edited successfully: ${path}`);
            return {
                type: 'success',
                message: 'File edited successfully'
            };
        } catch (error) {
            logError(this.outputChannel, `Error editing file: ${error}`);
            throw new Error(ERROR_MESSAGES.FILE_EDIT);
        }
    }

    private async executeCommand(payload: { command: string }): Promise<any> {
        try {
            const { command } = payload;
            const sanitizedCommand = sanitizeInput(command);
            
            if (!sanitizedCommand) {
                throw new Error(ERROR_MESSAGES.INVALID_INPUT);
            }

            const result: CommandResult = await exec(sanitizedCommand);
            
            logInfo(this.outputChannel, `Command executed successfully: ${sanitizedCommand}`);
            return {
                type: 'success',
                message: 'Command executed successfully',
                data: {
                    stdout: result.stdout,
                    stderr: result.stderr
                }
            };
        } catch (error) {
            logError(this.outputChannel, `Error executing command: ${error}`);
            throw new Error(ERROR_MESSAGES.COMMAND_EXECUTE);
        }
    }

    private async openBrowser(payload: { url: string }): Promise<any> {
        try {
            const { url } = payload;
            
            if (!url || !url.startsWith('http')) {
                throw new Error(ERROR_MESSAGES.INVALID_INPUT);
            }

            // For web-based VSCode, we'll use a specific command to open URLs
            await vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
            
            logInfo(this.outputChannel, `Browser opened successfully for URL: ${url}`);
            return {
                type: 'success',
                message: 'Browser opened successfully'
            };
        } catch (error) {
            logError(this.outputChannel, `Error opening browser: ${error}`);
            throw new Error(ERROR_MESSAGES.BROWSER_OPEN);
        }
    }

    private checkProAccess(feature: string): boolean {
        if (isProFeature(feature) && !this.isProEnabled) {
            throw new Error(ERROR_MESSAGES.PRO_FEATURE);
        }
        return true;
    }

    // Additional helper methods for Pro features can be added here
}