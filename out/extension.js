"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const agentController_1 = require("./agentController");
const webview_1 = require("./webview");
const utils_1 = require("./utils");
let agentController;
function activate(context) {
    const outputChannel = vscode.window.createOutputChannel(utils_1.EXTENSION_NAME);
    (0, utils_1.logInfo)(outputChannel, `${utils_1.EXTENSION_NAME} is now active`);
    agentController = new agentController_1.AgentController(outputChannel);
    let disposable = vscode.commands.registerCommand('extension.activateAgent', () => {
        try {
            // Create and show panel
            const panel = vscode.window.createWebviewPanel('autonomousCodingAgent', utils_1.EXTENSION_NAME, vscode.ViewColumn.One, {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(context.extensionUri, 'media')
                ]
            });
            // Set webview content
            panel.webview.html = (0, webview_1.getWebviewContent)(panel.webview);
            // Handle messages from the webview
            panel.webview.onDidReceiveMessage(async (message) => {
                try {
                    const response = await agentController.handleMessage(message);
                    panel.webview.postMessage(response);
                }
                catch (error) {
                    (0, utils_1.logError)(outputChannel, `Error handling message: ${error}`);
                    panel.webview.postMessage({
                        type: 'error',
                        message: error instanceof Error ? error.message : 'An unknown error occurred'
                    });
                }
            }, undefined, context.subscriptions);
            // Handle panel disposal
            panel.onDidDispose(() => {
                (0, utils_1.logInfo)(outputChannel, 'Agent panel disposed');
            }, null, context.subscriptions);
        }
        catch (error) {
            (0, utils_1.logError)(outputChannel, `Error activating agent: ${error}`);
            vscode.window.showErrorMessage('Failed to activate Autonomous Coding Agent');
        }
    });
    context.subscriptions.push(disposable);
    // Register additional commands
    context.subscriptions.push(vscode.commands.registerCommand('extension.stopAgent', () => {
        (0, utils_1.logInfo)(outputChannel, 'Stopping agent...');
        // Cleanup code here if needed
        vscode.window.showInformationMessage('Autonomous Coding Agent stopped');
    }));
    // Status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(robot) Agent";
    statusBarItem.tooltip = "Click to open Autonomous Coding Agent";
    statusBarItem.command = 'extension.activateAgent';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
}
exports.activate = activate;
function deactivate() {
    // Cleanup code here
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map