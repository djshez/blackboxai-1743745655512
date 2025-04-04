import * as vscode from 'vscode';
import { AgentController } from './agentController';
import { getWebviewContent } from './webview';
import { logInfo, logError, EXTENSION_NAME } from './utils';

let agentController: AgentController;

export function activate(context: vscode.ExtensionContext) {
    const outputChannel = vscode.window.createOutputChannel(EXTENSION_NAME);
    logInfo(outputChannel, `${EXTENSION_NAME} is now active`);

    agentController = new AgentController(outputChannel);

    let disposable = vscode.commands.registerCommand('extension.activateAgent', () => {
        try {
            // Create and show panel
            const panel = vscode.window.createWebviewPanel(
                'autonomousCodingAgent',
                EXTENSION_NAME,
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true,
                    localResourceRoots: [
                        vscode.Uri.joinPath(context.extensionUri, 'media')
                    ]
                }
            );

            // Set webview content
            panel.webview.html = getWebviewContent(panel.webview);

            // Handle messages from the webview
            panel.webview.onDidReceiveMessage(
                async message => {
                    try {
                        const response = await agentController.handleMessage(message);
                        panel.webview.postMessage(response);
                    } catch (error) {
                        logError(outputChannel, `Error handling message: ${error}`);
                        panel.webview.postMessage({
                            type: 'error',
                            message: error instanceof Error ? error.message : 'An unknown error occurred'
                        });
                    }
                },
                undefined,
                context.subscriptions
            );

            // Handle panel disposal
            panel.onDidDispose(
                () => {
                    logInfo(outputChannel, 'Agent panel disposed');
                },
                null,
                context.subscriptions
            );

        } catch (error) {
            logError(outputChannel, `Error activating agent: ${error}`);
            vscode.window.showErrorMessage('Failed to activate Autonomous Coding Agent');
        }
    });

    context.subscriptions.push(disposable);

    // Register additional commands
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.stopAgent', () => {
            logInfo(outputChannel, 'Stopping agent...');
            // Cleanup code here if needed
            vscode.window.showInformationMessage('Autonomous Coding Agent stopped');
        })
    );

    // Status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(robot) Agent";
    statusBarItem.tooltip = "Click to open Autonomous Coding Agent";
    statusBarItem.command = 'extension.activateAgent';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
}

export function deactivate() {
    // Cleanup code here
}