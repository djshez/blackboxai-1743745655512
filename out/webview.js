"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebviewContent = void 0;
const utils_1 = require("./utils");
function getWebviewContent(webview) {
    const nonce = getNonce();
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; script-src 'nonce-${nonce}' https://cdn.tailwindcss.com; img-src https: data:; font-src https:;">
        
        <title>Autonomous Coding Agent</title>
        
        <!-- Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>
        
        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
        
        <!-- Google Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        
        <style>
            body {
                font-family: 'Inter', sans-serif;
                background-color: var(--vscode-editor-background);
                color: var(--vscode-editor-foreground);
            }
        </style>
    </head>
    <body class="min-h-screen">
        <!-- Header -->
        <header class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 px-8 shadow-lg">
            <div class="max-w-7xl mx-auto">
                <h1 class="text-3xl font-bold mb-2">Autonomous Coding Agent</h1>
                <p class="text-sm opacity-90">Created by ${utils_1.CREATOR_NAME}</p>
            </div>
        </header>

        <div class="flex min-h-[calc(100vh-88px)]">
            <!-- Sidebar Navigation -->
            <nav class="w-64 bg-gray-800 p-6 space-y-6">
                <div class="space-y-2">
                    <h2 class="text-white font-semibold mb-4">File Operations</h2>
                    <button id="createFileBtn" class="w-full flex items-center space-x-3 text-gray-300 hover:text-white px-4 py-2 rounded hover:bg-gray-700">
                        <i class="fas fa-file-plus"></i>
                        <span>Create File</span>
                    </button>
                    <button id="editFileBtn" class="w-full flex items-center space-x-3 text-gray-300 hover:text-white px-4 py-2 rounded hover:bg-gray-700">
                        <i class="fas fa-edit"></i>
                        <span>Edit File</span>
                    </button>
                </div>

                <div class="space-y-2">
                    <h2 class="text-white font-semibold mb-4">Command Execution</h2>
                    <button id="runCommandBtn" class="w-full flex items-center space-x-3 text-gray-300 hover:text-white px-4 py-2 rounded hover:bg-gray-700">
                        <i class="fas fa-terminal"></i>
                        <span>Run Command</span>
                    </button>
                </div>

                <div class="space-y-2">
                    <h2 class="text-white font-semibold mb-4">Browser Integration</h2>
                    <button id="openBrowserBtn" class="w-full flex items-center space-x-3 text-gray-300 hover:text-white px-4 py-2 rounded hover:bg-gray-700">
                        <i class="fas fa-globe"></i>
                        <span>Open Browser</span>
                    </button>
                </div>

                <div class="pt-6">
                    <button id="upgradeBtn" class="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-200">
                        <i class="fas fa-crown mr-2"></i>
                        Upgrade to Pro
                    </button>
                </div>
            </nav>

            <!-- Main Content Area -->
            <main class="flex-1 p-8">
                <div id="contentArea" class="bg-gray-700 rounded-lg p-6 mb-6 min-h-[200px]">
                    <p class="text-gray-300 text-center">Select an action from the sidebar to get started</p>
                </div>

                <!-- Activity Log -->
                <div class="bg-gray-800 rounded-lg p-6">
                    <h2 class="text-white font-semibold mb-4">Activity Log</h2>
                    <div id="logArea" class="bg-gray-900 rounded p-4 h-48 overflow-y-auto text-sm text-gray-300">
                        <!-- Logs will be inserted here -->
                    </div>
                </div>
            </main>
        </div>

        <script nonce="${nonce}">
            (function() {
                const vscode = acquireVsCodeApi();
                
                // Initialize logging
                function log(message, type = 'info') {
                    const logArea = document.getElementById('logArea');
                    const logEntry = document.createElement('div');
                    logEntry.className = \`mb-2 \${type === 'error' ? 'text-red-400' : 'text-gray-300'}\`;
                    logEntry.textContent = \`[\${new Date().toLocaleTimeString()}] \${message}\`;
                    logArea.appendChild(logEntry);
                    logArea.scrollTop = logArea.scrollHeight;
                }

                // Handle button clicks
                document.getElementById('createFileBtn').addEventListener('click', () => {
                    log('Initiating file creation...');
                    // Implementation will be added
                });

                document.getElementById('editFileBtn').addEventListener('click', () => {
                    log('Opening file editor...');
                    // Implementation will be added
                });

                document.getElementById('runCommandBtn').addEventListener('click', () => {
                    log('Preparing to run command...');
                    // Implementation will be added
                });

                document.getElementById('openBrowserBtn').addEventListener('click', () => {
                    log('Opening browser integration...');
                    // Implementation will be added
                });

                document.getElementById('upgradeBtn').addEventListener('click', () => {
                    log('Opening upgrade options...');
                    // Implementation will be added
                });

                // Handle messages from the extension
                window.addEventListener('message', event => {
                    const message = event.data;
                    switch (message.type) {
                        case 'error':
                            log(message.message, 'error');
                            break;
                        case 'success':
                            log(message.message);
                            break;
                        default:
                            console.log('Unknown message type:', message.type);
                    }
                });

                // Log initial startup
                log('Autonomous Coding Agent initialized');
            }())
        </script>
    </body>
    </html>`;
}
exports.getWebviewContent = getWebviewContent;
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=webview.js.map