import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import { promisify } from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);
const globPromise = promisify(glob.glob);

export class CodeFlattener {
    private filePart = 1;
    private currentOutputFile = '';
    private baseOutputFileName = '';
    private outputFileExtension = '';
    private outputFileDirectory = '';
    private projectName = '';

    /**
     * Flatten the entire workspace
     */
    async flattenWorkspace(
        workspacePath: string,
        outputFolderPath: string,
        includePatterns: string[],
        excludePatterns: string[],
        maxFileSizeBytes: number,
        maxOutputFileSizeBytes: number,
        progressCallback: (message: string, increment: number) => void
    ): Promise<void> {
        try {
            // Make sure the output directory exists
            await this.ensureDirectory(outputFolderPath);

            // Set output file variables
            this.projectName = path.basename(workspacePath);
            const outputFilePath = path.join(outputFolderPath, `${this.projectName}_flattened.md`);
            const outputFileName = path.basename(outputFilePath);
            this.baseOutputFileName = path.parse(outputFileName).name;
            this.outputFileExtension = path.parse(outputFileName).ext;
            this.outputFileDirectory = outputFolderPath;
            this.currentOutputFile = outputFilePath;
            this.filePart = 1;

            // Initialize output file with header
            const header = `# Project Digest: ${this.projectName}\nGenerated on: ${new Date().toString()}\nSource: ${workspacePath}\nProject Directory: ${workspacePath}\n\n`;
            await writeFile(this.currentOutputFile, header);

            // Process directory structure
            await this.writeLineToOutput("# Directory Structure", maxOutputFileSizeBytes);
            await this.processDirectory(workspacePath, "", workspacePath, includePatterns, excludePatterns, maxOutputFileSizeBytes);

            // Process file contents
            await this.writeLineToOutput("\n# Files Content", maxOutputFileSizeBytes);

            // Get all files in the workspace
            let files: string[] = [];
            
            if (includePatterns.length > 0) {
                // If include patterns are specified, use them
                for (const pattern of includePatterns) {
                    const matches = await globPromise(pattern, { cwd: workspacePath, absolute: true, nodir: true });
                    files = [...files, ...matches];
                }
            } else {
                // Otherwise, get all files
                files = await this.getAllFiles(workspacePath);
            }

            // Filter files based on exclude patterns
            files = files.filter(file => {
                const relativePath = path.relative(workspacePath, file);
                return !this.shouldIgnore(relativePath, includePatterns, excludePatterns);
            });

            // Process each file
            let fileCount = 0;
            let totalBytes = 0;
            let processedCount = 0;

            for (const file of files) {
                try {
                    const relativePath = path.relative(workspacePath, file);
                    const fileStats = await stat(file);
                    
                    // Skip files that are too large
                    if (fileStats.size > maxFileSizeBytes) {
                        progressCallback(`Skipping large file: ${relativePath}`, 0);
                        continue;
                    }

                    if (this.isProcessableFile(file)) {
                        fileCount++;
                        totalBytes += fileStats.size;
                        
                        await this.processFileContents(file, workspacePath, maxOutputFileSizeBytes);
                        
                        processedCount++;
                        const progressPercent = Math.floor((processedCount / files.length) * 100);
                        progressCallback(`Processed: ${processedCount}/${files.length} files`, progressPercent / 100);
                    }
                } catch (err) {
                    console.error(`Error processing file ${file}:`, err);
                }
            }

            // Count directories
            const dirCount = await this.countDirectories(workspacePath);

            // Generate summary
            const summary = this.generateSummary(fileCount, dirCount, totalBytes);
            
            // Prepend summary to the first output file
            const firstOutputFilePath = path.join(this.outputFileDirectory, `${this.baseOutputFileName}${this.outputFileExtension}`);
            const content = await readFile(firstOutputFilePath, 'utf8');
            await writeFile(firstOutputFilePath, summary + content);

            progressCallback("Completed flattening source code", 100);
            
        } catch (err) {
            console.error('Error in flattenWorkspace:', err);
            throw err;
        }
    }

    /**
     * Determines if a file should be ignored based on its path and patterns
     */
    private shouldIgnore(relativePath: string, includePatterns: string[], excludePatterns: string[]): boolean {
        // If include patterns are specified and path doesn't match any, ignore it
        if (includePatterns.length > 0) {
            let matchFound = false;
            for (const pattern of includePatterns) {
                if (this.matchGlobPattern(relativePath, pattern)) {
                    matchFound = true;
                    break;
                }
            }
            if (!matchFound) {
                return true;
            }
        }

        // Check if path matches any exclude pattern
        for (const pattern of excludePatterns) {
            if (this.matchGlobPattern(relativePath, pattern)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Simple glob pattern matching
     */
    private matchGlobPattern(path: string, pattern: string): boolean {
        // Convert glob pattern to regex
        const regexPattern = pattern
            .replace(/\./g, '\\.')           // Escape dots
            .replace(/\*\*/g, '{{GLOBSTAR}}') // Temp replace ** for later
            .replace(/\*/g, '[^/]*')         // Replace * with regex for non-path parts
            .replace(/\?/g, '[^/]')          // Replace ? with regex for single char
            .replace(/{{GLOBSTAR}}/g, '.*'); // Replace ** with regex for any characters

        const regex = new RegExp(`^${regexPattern}$`);
        return regex.test(path);
    }

    /**
     * Get all files in a directory recursively
     */
    private async getAllFiles(dir: string): Promise<string[]> {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });
        
        const files = await Promise.all(entries.map(async entry => {
            const fullPath = path.join(dir, entry.name);
            return entry.isDirectory() ? this.getAllFiles(fullPath) : [fullPath];
        }));
        
        return files.flat();
    }

    /**
     * Recursively process a directory
     */
    private async processDirectory(
        currentDir: string, 
        indent: string, 
        projectDir: string,
        includePatterns: string[],
        excludePatterns: string[],
        maxOutputFileSizeBytes: number
    ): Promise<void> {
        const relativePath = path.relative(projectDir, currentDir);
        
        if (relativePath === '') {
            await this.writeLineToOutput("[DIR] .", maxOutputFileSizeBytes);
        } else {
            const dirName = path.basename(currentDir);
            await this.writeLineToOutput(`${indent}[DIR] ${dirName}`, maxOutputFileSizeBytes);
        }

        try {
            const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
            
            for (const entry of entries) {
                const itemPath = path.join(currentDir, entry.name);
                const itemRelPath = path.relative(projectDir, itemPath);
                
                // Skip the output file itself
                if (path.basename(itemPath) === path.basename(this.currentOutputFile)) {
                    continue;
                }
                
                // Check if the item should be ignored
                if (this.shouldIgnore(itemRelPath, includePatterns, excludePatterns)) {
                    continue;
                }

                if (entry.isDirectory()) {
                    await this.processDirectory(itemPath, `  ${indent}`, projectDir, includePatterns, excludePatterns, maxOutputFileSizeBytes);
                } else {
                    // Only process certain file types
                    if (this.isProcessableFile(itemPath)) {
                        await this.writeLineToOutput(`${indent}  [FILE] ${entry.name}`, maxOutputFileSizeBytes);
                    }
                }
            }
        } catch (err) {
            console.error(`Error processing directory ${currentDir}:`, err);
        }
    }

    /**
     * Check if a file is of a processable type
     */
    private isProcessableFile(filePath: string): boolean {
        const ext = path.extname(filePath).toLowerCase();
        // List of extensions to process - can be expanded
        const allowedExts = ['.ps1', '.cs', '.sln', '.md', '.txt', '.json', '.xml', '.yaml', '.yml', '.py', '.js', '.ts', '.html', '.css', '.scss', '.less', '.jsx', '.tsx'];
        
        return allowedExts.includes(ext);
    }

    /**
     * Process the contents of a file
     */
    private async processFileContents(
        filepath: string, 
        projectDir: string,
        maxOutputFileSizeBytes: number
    ): Promise<void> {
        try {
            const relativePath = path.relative(projectDir, filepath);
            
            if (!this.isProcessableFile(filepath)) {
                return;
            }
            
            await this.writeLineToOutput("", maxOutputFileSizeBytes);
            await this.writeLineToOutput(`## ${relativePath}`, maxOutputFileSizeBytes);
            
            const content = await readFile(filepath, 'utf8');
            
            if (filepath.endsWith('.md')) {
                // Strip markdown formatting
                const strippedContent = this.stripMarkdown(content);
                await this.writeBlockToOutput(strippedContent, maxOutputFileSizeBytes);
            } else {
                await this.writeBlockToOutput(content, maxOutputFileSizeBytes);
            }
        } catch (err) {
            console.error(`Error processing file contents for ${filepath}:`, err);
        }
    }

    /**
     * Strip markdown formatting from content
     */
    private stripMarkdown(content: string): string {
        // Remove markdown headers
        let result = content.replace(/^#+\s*/gm, '');
        // Remove bold: **text**
        result = result.replace(/\*\*([^*]+)\*\*/g, '$1');
        // Remove italic: *text*
        result = result.replace(/\*([^*]+)\*/g, '$1');
        // Remove underline: _text_
        result = result.replace(/_([^_]+)_/g, '$1');
        // Remove links: [text](url)
        result = result.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
        // Remove code blocks (from ``` to ```)
        result = result.replace(/```[\s\S]*?```/g, '');
        // Remove inline code: `text`
        result = result.replace(/`([^`]+)`/g, '$1');
        
        return result;
    }

    /**
     * Count directories in a path
     */
    private async countDirectories(dirPath: string): Promise<number> {
        let count = 0;
        
        try {
            const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
            
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    count++;
                    count += await this.countDirectories(path.join(dirPath, entry.name));
                }
            }
        } catch (err) {
            console.error(`Error counting directories in ${dirPath}:`, err);
        }
        
        return count;
    }

    /**
     * Generate a summary of the flattening process
     */
    private generateSummary(fileCount: number, dirCount: number, totalBytes: number): string {
        const approxTokens = Math.floor(totalBytes / 4);
        
        return `Repository Summary:
Files analyzed: ${fileCount}
Directories scanned: ${dirCount}
Total size: ${totalBytes} bytes
Estimated tokens: ${approxTokens}

`;
    }

    /**
     * Ensure a directory exists
     */
    private async ensureDirectory(dirPath: string): Promise<void> {
        try {
            await mkdir(dirPath, { recursive: true });
        } catch (err) {
            if ((err as NodeJS.ErrnoException).code !== 'EEXIST') {
                throw err;
            }
        }
    }

    /**
     * Write a line to the output file, rotating if necessary
     */
    private async writeLineToOutput(line: string, maxOutputFileSizeBytes: number): Promise<void> {
        await fs.promises.appendFile(this.currentOutputFile, line + '\n');
        
        try {
            const stats = await stat(this.currentOutputFile);
            if (stats.size > maxOutputFileSizeBytes) {
                this.filePart++;
                this.currentOutputFile = path.join(
                    this.outputFileDirectory, 
                    `${this.baseOutputFileName}_part${this.filePart}${this.outputFileExtension}`
                );
                
                const header = `# Project Digest Continued: ${this.projectName}\nGenerated on: ${new Date().toString()}\n\n`;
                await writeFile(this.currentOutputFile, header);
            }
        } catch (err) {
            console.error('Error in writeLineToOutput:', err);
        }
    }

    /**
     * Write a block of text (line by line)
     */
    private async writeBlockToOutput(block: string, maxOutputFileSizeBytes: number): Promise<void> {
        const lines = block.split('\n');
        for (const line of lines) {
            await this.writeLineToOutput(line, maxOutputFileSizeBytes);
        }
    }
}
