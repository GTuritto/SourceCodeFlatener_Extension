import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import { CodeFlattener } from './codeFlattener';

export function activate(context: vscode.ExtensionContext) {
    console.log('Source Code Flattener extension is now active');

    const flattener = new CodeFlattener();

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
            const outputFolderName = config.get<string>('outputFolder', 'CodeFlattened');
            const excludePatterns = config.get<string[]>('excludePatterns', ['bin/**', 'obj/**', 'node_modules/**', '**/CodeFlattened/**']);
            const includePatterns = config.get<string[]>('includePatterns', []);
            const maxFileSizeBytes = config.get<number>('maxFileSizeBytes', 10 * 1024 * 1024); // 10 MB
            const maxOutputFileSizeBytes = config.get<number>('maxOutputFileSizeBytes', 5 * 1024 * 1024); // 5 MB

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
                    await flattener.flattenWorkspace(
                        workspaceFolder,
                        outputFolder,
                        includePatterns,
                        excludePatterns,
                        maxFileSizeBytes,
                        maxOutputFileSizeBytes,
                        (message: string, increment: number) => progress.report({ increment, message })
                    );

                    vscode.window.showInformationMessage('Source code has been flattened successfully!');
                } catch (err: any) {
                    vscode.window.showErrorMessage(`Error flattening source code: ${err.message}`);
                }
            });
        } catch (err: any) {
            vscode.window.showErrorMessage(`Error: ${err.message}`);
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
