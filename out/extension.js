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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const codeFlattener_1 = require("./codeFlattener");
function activate(context) {
    console.log('CodeFlattener extension is now active');
    const flattener = new codeFlattener_1.CodeFlattener();
    // Register Explorer context menu command
    const contextMenuDisposable = vscode.commands.registerCommand('code-flattener.flattenFromExplorer', async (fileUri) => {
        try {
            // Get workspace folder containing the selected file
            if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
                vscode.window.showErrorMessage('No workspace folder is open. Please open a project first.');
                return;
            }
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri)?.uri.fsPath || vscode.workspace.workspaceFolders[0].uri.fsPath;
            // Get configuration
            const config = vscode.workspace.getConfiguration('codeFlattener');
            const outputFolderName = config.get('outputFolder', 'CodeFlattened_Output');
            const excludePatterns = config.get('excludePatterns', [
                'bin/**', 'obj/**', 'node_modules/**', '**/CodeFlattened_Output/**',
                // Always exclude .env files which typically contain secrets
                '.env', '.env.*', '**/.env', '**/.env.*'
            ]);
            const includePatterns = config.get('includePatterns', []);
            const maxFileSizeBytes = config.get('maxFileSizeBytes', 10 * 1024 * 1024); // 10 MB
            const maxOutputFileSizeBytes = config.get('maxOutputFileSizeBytes', 5 * 1024 * 1024); // 5 MB
            // LLM optimization configuration
            const respectGitignore = config.get('respectGitignore', true);
            const enableSemanticCompression = config.get('enableSemanticCompression', true);
            const enhancedTableOfContents = config.get('enhancedTableOfContents', true);
            const prioritizeImportantFiles = config.get('prioritizeImportantFiles', true);
            // Force visualization level to basic for optimal performance
            const visualizationLevel = 'basic'; // Always use basic regardless of user setting
            // If file is selected, include its path specifically
            const stats = await vscode.workspace.fs.stat(fileUri);
            if (stats.type === vscode.FileType.File) {
                const relativePath = path.relative(workspaceFolder, fileUri.fsPath);
                includePatterns.push(relativePath);
                vscode.window.showInformationMessage(`Added ${relativePath} to include patterns`);
            }
            // Run the flattening process
            const outputFolder = path.join(workspaceFolder, outputFolderName);
            // Create progress notification
            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Flattening Code",
                cancellable: true
            }, async (progress, token) => {
                token.onCancellationRequested(() => {
                    console.log("User canceled the flattening operation");
                });
                progress.report({ increment: 0, message: "Starting..." });
                try {
                    await flattener.flattenWorkspace(workspaceFolder, outputFolder, includePatterns, excludePatterns, maxFileSizeBytes, maxOutputFileSizeBytes, (message, increment) => progress.report({ increment, message }), {
                        respectGitignore,
                        enableSemanticCompression,
                        enhancedTableOfContents,
                        prioritizeImportantFiles,
                        visualizationLevel
                    });
                    vscode.window.showInformationMessage('Code has been flattened successfully!');
                }
                catch (err) {
                    vscode.window.showErrorMessage(`Error flattening code: ${err.message}`);
                }
            });
        }
        catch (err) {
            vscode.window.showErrorMessage(`Error: ${err.message}`);
        }
    });
    context.subscriptions.push(contextMenuDisposable);
    // Register the flatten code command
    const disposable = vscode.commands.registerCommand('code-flattener.flattenCode', async () => {
        try {
            // Get workspace folder
            if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
                vscode.window.showErrorMessage('No workspace folder is open. Please open a project first.');
                return;
            }
            const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
            // Get configuration
            const config = vscode.workspace.getConfiguration('codeFlattener');
            const outputFolderName = config.get('outputFolder', 'CodeFlattened');
            const excludePatterns = config.get('excludePatterns', [
                'bin/**', 'obj/**', 'node_modules/**', '**/CodeFlattened/**',
                // Always exclude .env files which typically contain secrets
                '.env', '.env.*', '**/.env', '**/.env.*'
            ]);
            const includePatterns = config.get('includePatterns', []);
            const maxFileSizeBytes = config.get('maxFileSizeBytes', 10 * 1024 * 1024); // 10 MB
            const maxOutputFileSizeBytes = config.get('maxOutputFileSizeBytes', 5 * 1024 * 1024); // 5 MB
            // LLM optimization configuration
            const respectGitignore = config.get('respectGitignore', true);
            const enableSemanticCompression = config.get('enableSemanticCompression', true);
            const enhancedTableOfContents = config.get('enhancedTableOfContents', true);
            const prioritizeImportantFiles = config.get('prioritizeImportantFiles', true);
            // Force visualization level to basic for optimal performance
            const visualizationLevel = 'basic'; // Always use basic regardless of user setting
            // Ask the user if they want to specify any additional files to exclude
            const shouldAskForExclusions = config.get('promptForAdditionalExclusions', true);
            if (shouldAskForExclusions) {
                const additionalExcludesInput = await vscode.window.showInputBox({
                    prompt: 'Enter additional files/patterns to exclude (comma-separated, leave empty for none)',
                    placeHolder: 'e.g., secrets.json, **/*.log, test/fixtures/**'
                });
                if (additionalExcludesInput) {
                    // Split by commas and trim each pattern
                    const additionalExcludes = additionalExcludesInput
                        .split(',')
                        .map(pattern => pattern.trim())
                        .filter(pattern => pattern.length > 0);
                    if (additionalExcludes.length > 0) {
                        excludePatterns.push(...additionalExcludes);
                        console.log(`Added ${additionalExcludes.length} additional exclusion patterns from user input`);
                    }
                }
            }
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
                title: "Flattening Code",
                cancellable: true
            }, async (progress, token) => {
                token.onCancellationRequested(() => {
                    console.log("User canceled the flattening operation");
                });
                progress.report({ increment: 0, message: "Starting..." });
                try {
                    await flattener.flattenWorkspace(workspaceFolder, outputFolder, includePatterns, excludePatterns, maxFileSizeBytes, maxOutputFileSizeBytes, (message, increment) => progress.report({ increment, message }), {
                        respectGitignore,
                        enableSemanticCompression,
                        enhancedTableOfContents,
                        prioritizeImportantFiles,
                        visualizationLevel
                    });
                    vscode.window.showInformationMessage('Code has been flattened successfully!');
                }
                catch (err) {
                    vscode.window.showErrorMessage(`Error flattening code: ${err.message}`);
                }
            });
        }
        catch (err) {
            vscode.window.showErrorMessage(`Error: ${err.message}`);
        }
    });
    context.subscriptions.push(disposable);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map