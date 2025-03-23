import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import { CodeFlattener } from './codeFlattener';

export function activate(context: vscode.ExtensionContext) {
    console.log('CodeFlattener extension is now active');

    // Remove any legacy settings from VS Code's cache
    const legacySettings = [
        'codeFlattener.enableSemanticCompression',
        'codeFlattener.enhancedTableOfContents',
        'codeFlattener.excludePatterns',
        'codeFlattener.includePatterns',
        'codeFlattener.promptForAdditionalExclusions',
        'codeFlattener.respectGitignore',
        'codeFlattener.visualizationLevel'
    ];

    // Force-migrate users from old settings to new simplified settings
    const config = vscode.workspace.getConfiguration('codeFlattener');
    legacySettings.forEach(setting => {
        const key = setting.replace('codeFlattener.', '');
        // Reset any legacy settings to undefined to remove them from user settings.json
        config.update(key, undefined, vscode.ConfigurationTarget.Global);
        config.update(key, undefined, vscode.ConfigurationTarget.Workspace);
    });

    const flattener = new CodeFlattener();
    
    // Register Explorer context menu command
    const contextMenuDisposable = vscode.commands.registerCommand('code-flattener.flattenFromExplorer', async (fileUri: vscode.Uri) => {
        try {
            // Get workspace folder containing the selected file
            if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
                vscode.window.showErrorMessage('No workspace folder is open. Please open a project first.');
                return;
            }
            
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri)?.uri.fsPath || vscode.workspace.workspaceFolders[0].uri.fsPath;
            
            // Get configuration
            const config = vscode.workspace.getConfiguration('codeFlattener');
            const outputFolderName = config.get<string>('outputFolder', 'CodeFlattened_Output');
            const maxFileSizeBytes = config.get<number>('maxFileSizeBytes', 10 * 1024 * 1024); // 10 MB
            const maxOutputFileSizeBytes = config.get<number>('maxOutputFileSizeBytes', 5 * 1024 * 1024); // 5 MB
            const prioritizeImportantFiles = config.get<boolean>('prioritizeImportantFiles', true);
            const addCodeRelationshipDiagrams = config.get<boolean>('addCodeRelationshipDiagrams', true);
            const minifyOutput = config.get<boolean>('minifyOutput', true); // New setting for LLM optimization
            
            // Default exclude patterns for security and performance
            const excludePatterns = [
                'bin/**', 'obj/**', 'node_modules/**', '**/CodeFlattened_Output/**',
                // Always exclude .env files which typically contain secrets
                '.env', '.env.*', '**/.env', '**/.env.*'
            ];
            const includePatterns: string[] = [];
            
            // Always use gitignore and simplify the settings
            const respectGitignore = true;
            const enableSemanticCompression = false;
            const enhancedTableOfContents = true;
            // Use visualization based on the addCodeRelationshipDiagrams setting
            const visualizationLevel = addCodeRelationshipDiagrams ? 'medium' : 'none';
            
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
                    await flattener.flattenWorkspace(
                        workspaceFolder,
                        outputFolder,
                        includePatterns,
                        excludePatterns,
                        maxFileSizeBytes,
                        maxOutputFileSizeBytes,
                        (message: string, increment: number) => progress.report({ increment, message }),
                        {
                            respectGitignore,
                            enableSemanticCompression,
                            enhancedTableOfContents,
                            prioritizeImportantFiles,
                            visualizationLevel,
                            minifyOutput
                        }
                    );

                    vscode.window.showInformationMessage('Code has been flattened successfully!');
                } catch (err: any) {
                    vscode.window.showErrorMessage(`Error flattening code: ${err.message}`);
                }
            });
        } catch (err: any) {
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
            const outputFolderName = config.get<string>('outputFolder', 'CodeFlattened_Output');
            const maxFileSizeBytes = config.get<number>('maxFileSizeBytes', 10 * 1024 * 1024); // 10 MB
            const maxOutputFileSizeBytes = config.get<number>('maxOutputFileSizeBytes', 5 * 1024 * 1024); // 5 MB
            const prioritizeImportantFiles = config.get<boolean>('prioritizeImportantFiles', true);
            const addCodeRelationshipDiagrams = config.get<boolean>('addCodeRelationshipDiagrams', true);
            const minifyOutput = config.get<boolean>('minifyOutput', true); // New setting for LLM optimization
            
            // Default exclude patterns for security and performance
            const excludePatterns = [
                'bin/**', 'obj/**', 'node_modules/**', '**/CodeFlattened_Output/**',
                // Always exclude .env files which typically contain secrets
                '.env', '.env.*', '**/.env', '**/.env.*'
            ];
            const includePatterns: string[] = [];
            
            // Always use gitignore and simplify the settings
            const respectGitignore = true;
            const enableSemanticCompression = false;
            const enhancedTableOfContents = true;
            // Use visualization based on the addCodeRelationshipDiagrams setting
            const visualizationLevel = addCodeRelationshipDiagrams ? 'medium' : 'none';
            
            // Always ask the user if they want to specify any additional files to exclude
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
                    await flattener.flattenWorkspace(
                        workspaceFolder,
                        outputFolder,
                        includePatterns,
                        excludePatterns,
                        maxFileSizeBytes,
                        maxOutputFileSizeBytes,
                        (message: string, increment: number) => progress.report({ increment, message }),
                        {
                            respectGitignore,
                            enableSemanticCompression,
                            enhancedTableOfContents,
                            prioritizeImportantFiles,
                            visualizationLevel,
                            minifyOutput
                        }
                    );

                    vscode.window.showInformationMessage('Code has been flattened successfully!');
                } catch (err: any) {
                    vscode.window.showErrorMessage(`Error flattening code: ${err.message}`);
                }
            });
        } catch (err: any) {
            vscode.window.showErrorMessage(`Error: ${err.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
