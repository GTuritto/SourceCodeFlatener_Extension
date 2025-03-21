"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const codeFlattener_1 = require("./codeFlattener");
function activate(context) {
    console.log('Source Code Flattener extension is now active');
    const flattener = new codeFlattener_1.CodeFlattener();
    // Register the flatten code command
    const disposable = vscode.commands.registerCommand('source-code-flattener.flattenCode', async () => {
        try {
            // Get workspace folder
            if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
                vscode.window.showErrorMessage('No workspace folder is open. Please open a project first.');
                return;
            }
            const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
            // Get configuration
            const config = vscode.workspace.getConfiguration('sourceCodeFlattener');
            const outputFolderName = config.get('outputFolder', 'CodeFlattened');
            const excludePatterns = config.get('excludePatterns', ['bin/**', 'obj/**', 'node_modules/**', '**/CodeFlattened/**']);
            const includePatterns = config.get('includePatterns', []);
            const maxFileSizeBytes = config.get('maxFileSizeBytes', 10 * 1024 * 1024); // 10 MB
            const maxOutputFileSizeBytes = config.get('maxOutputFileSizeBytes', 5 * 1024 * 1024); // 5 MB
            // Always add the output folder to excludes to avoid processing it
            const normalizedOutputFolder = outputFolderName.endsWith('/') ? outputFolderName : `${outputFolderName}/**`;
            if (!excludePatterns.includes(normalizedOutputFolder) && !excludePatterns.includes(`**/${normalizedOutputFolder}`)) {
                excludePatterns.push(`**/${normalizedOutputFolder}`);
            }
            // Run the flattening process
            const outputFolder = path.join(workspaceFolder, outputFolderName);
            // Create progress notification
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Flattening Source Code",
                cancellable: true
            }, async (progress, token) => {
                token.onCancellationRequested(() => {
                    console.log("User canceled the flattening operation");
                });
                progress.report({ increment: 0, message: "Starting..." });
                try {
                    await flattener.flattenWorkspace(workspaceFolder, outputFolder, includePatterns, excludePatterns, maxFileSizeBytes, maxOutputFileSizeBytes, (message, increment) => progress.report({ increment, message }));
                    vscode.window.showInformationMessage('Source code has been flattened successfully!');
                }
                catch (err) {
                    vscode.window.showErrorMessage(`Error flattening source code: ${err.message}`);
                }
            });
        }
        catch (err) {
            vscode.window.showErrorMessage(`Error: ${err.message}`);
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map