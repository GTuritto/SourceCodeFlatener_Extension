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
exports.CodeFlattener = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const glob = __importStar(require("glob"));
const util_1 = require("util");
// Promisified filesystem functions for cleaner async code
const writeFile = (0, util_1.promisify)(fs.writeFile);
const readFile = (0, util_1.promisify)(fs.readFile);
const mkdir = (0, util_1.promisify)(fs.mkdir);
const stat = (0, util_1.promisify)(fs.stat);
const globPromise = (0, util_1.promisify)(glob.glob);
// File size constants (in bytes)
const KB = 1024;
const MB = 1024 * KB;
class CodeFlattener {
    constructor() {
        this.filePart = 1;
        this.currentOutputFile = '';
        this.baseOutputFileName = '';
        this.outputFileExtension = '';
        this.outputFileDirectory = '';
        this.projectName = '';
    }
    /**
     * Flatten the entire workspace
     * @param workspacePath Path to the workspace/folder to flatten
     * @param outputFolderPath Path where flattened output should be saved
     * @param includePatterns Array of glob patterns to include
     * @param excludePatterns Array of glob patterns to exclude
     * @param maxFileSizeBytes Maximum size of files to process
     * @param maxOutputFileSizeBytes Maximum size for output files before splitting
     * @param progressCallback Callback function to report progress
     */
    async flattenWorkspace(workspacePath, outputFolderPath, includePatterns, excludePatterns, maxFileSizeBytes, maxOutputFileSizeBytes, progressCallback) {
        try {
            // Validate input parameters
            if (!workspacePath)
                throw new Error('Workspace path is required');
            if (!outputFolderPath)
                throw new Error('Output folder path is required');
            if (maxFileSizeBytes <= 0)
                throw new Error('Max file size must be positive');
            if (maxOutputFileSizeBytes <= 0)
                throw new Error('Max output file size must be positive');
            progressCallback(`Starting flattening process...`, 0.01);
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
            const startTime = new Date();
            const header = `# Project Digest: ${this.projectName}
Generated on: ${startTime.toString()}
Source: ${workspacePath}
Project Directory: ${workspacePath}

`;
            await writeFile(this.currentOutputFile, header);
            progressCallback(`Scanning directory structure...`, 0.05);
            // Process directory structure
            await this.writeLineToOutput("# Directory Structure", maxOutputFileSizeBytes);
            await this.processDirectory(workspacePath, "", workspacePath, includePatterns, excludePatterns, maxOutputFileSizeBytes);
            progressCallback(`Scanning for files to process...`, 0.1);
            // Process file contents
            await this.writeLineToOutput("\n# Files Content", maxOutputFileSizeBytes);
            // Get all files in the workspace - use more efficient approach
            let files = [];
            try {
                if (includePatterns.length > 0) {
                    // Process include patterns in parallel
                    const matchPromises = includePatterns.map(pattern => globPromise(pattern, {
                        cwd: workspacePath,
                        absolute: true,
                        nodir: true,
                        ignore: excludePatterns, // Use built-in exclude pattern support
                        silent: true // Skip permission errors
                    }));
                    const matchResults = await Promise.all(matchPromises);
                    files = Array.from(new Set(matchResults.flat())); // Remove duplicates
                }
                else {
                    // Otherwise, get all files (except excluded ones)
                    files = await this.getAllFiles(workspacePath);
                    progressCallback(`Found ${files.length} files in workspace`, 0.15);
                }
                // Filter files based on exclude patterns (as a backup, glob's ignore might miss some)
                files = files.filter(file => {
                    const relativePath = path.relative(workspacePath, file);
                    return !this.shouldIgnore(relativePath, includePatterns, excludePatterns);
                });
                progressCallback(`Filtered to ${files.length} relevant files`, 0.2);
            }
            catch (scanErr) {
                console.error('Error scanning for files:', scanErr);
                progressCallback(`Error scanning for files: ${scanErr.message}`, 0.2);
                // Continue with any files we might have found
            }
            // Process each file
            let fileCount = 0;
            let totalBytes = 0;
            let processedCount = 0;
            let skippedCount = 0;
            const totalFiles = files.length;
            // Process in small batches to avoid overwhelming the system
            const BATCH_SIZE = 10;
            for (let i = 0; i < files.length; i += BATCH_SIZE) {
                const batch = files.slice(i, i + BATCH_SIZE);
                // Process batch in parallel but with controlled concurrency
                await Promise.all(batch.map(async (file) => {
                    try {
                        const relativePath = path.relative(workspacePath, file);
                        try {
                            const fileStats = await stat(file);
                            // Skip files that are too large
                            if (fileStats.size > maxFileSizeBytes) {
                                progressCallback(`Skipping large file: ${relativePath} (${(fileStats.size / MB).toFixed(1)} MB)`, 0);
                                skippedCount++;
                                return;
                            }
                            if (this.isProcessableFile(file)) {
                                fileCount++;
                                totalBytes += fileStats.size;
                                await this.processFileContents(file, workspacePath, maxOutputFileSizeBytes);
                            }
                            else {
                                skippedCount++;
                            }
                        }
                        catch (statErr) {
                            console.error(`Error getting stats for file ${file}:`, statErr);
                            skippedCount++;
                        }
                    }
                    catch (fileErr) {
                        console.error(`Error processing file ${file}:`, fileErr);
                        skippedCount++;
                    }
                }));
                processedCount += batch.length;
                const progress = Math.min(0.2 + 0.7 * (processedCount / totalFiles), 0.9);
                progressCallback(`Processed: ${processedCount}/${totalFiles} files (${skippedCount} skipped)`, progress);
            }
            progressCallback(`Counting directories...`, 0.95);
            // Count directories
            const dirCount = await this.countDirectories(workspacePath);
            // Generate summary
            const endTime = new Date();
            const duration = (endTime.getTime() - startTime.getTime()) / 1000; // in seconds
            const summary = this.generateSummary(fileCount, dirCount, totalBytes, duration);
            progressCallback(`Finalizing output...`, 0.98);
            // Prepend summary to the first output file
            const firstOutputFilePath = path.join(this.outputFileDirectory, `${this.baseOutputFileName}${this.outputFileExtension}`);
            try {
                const content = await readFile(firstOutputFilePath, 'utf8');
                await writeFile(firstOutputFilePath, summary + content);
            }
            catch (readErr) {
                console.error('Error updating summary in output file:', readErr);
                // Try to write the summary on its own if we can't read the original file
                await writeFile(firstOutputFilePath, summary);
            }
            progressCallback(`Completed flattening source code`, 1.0);
        }
        catch (err) {
            console.error('Error in flattenWorkspace:', err);
            progressCallback(`Error: ${err.message}`, 1.0);
            throw err;
        }
    }
    /**
     * Determines if a file should be ignored based on its path and patterns
     */
    shouldIgnore(relativePath, includePatterns, excludePatterns) {
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
     * More robust glob pattern matching
     * @param filePath The path to check against the pattern
     * @param pattern The glob pattern
     * @returns Whether the path matches the pattern
     */
    matchGlobPattern(filePath, pattern) {
        // Use minimatch-like logic with a more robust implementation
        // Normalize paths to use forward slashes for consistency
        const normalizedPath = filePath.replace(/\\/g, '/');
        const normalizedPattern = pattern.replace(/\\/g, '/');
        // Fast path: exact match
        if (normalizedPath === normalizedPattern) {
            return true;
        }
        // Fast path: simple * at the end (common case)
        if (normalizedPattern.endsWith('/*') && normalizedPath.startsWith(normalizedPattern.slice(0, -1))) {
            return normalizedPath.indexOf('/', normalizedPattern.length - 1) === -1;
        }
        // Fast path: simple ** at the end (common case)
        if (normalizedPattern.endsWith('/**') && normalizedPath.startsWith(normalizedPattern.slice(0, -2))) {
            return true;
        }
        // Convert glob pattern to regex
        let regexPattern = normalizedPattern
            .replace(/\./g, '\\.') // Escape dots
            .replace(/\*\*/g, '{{GLOBSTAR}}') // Temp replace ** for later
            .replace(/\*/g, '[^/]*') // Replace * with regex for non-path parts
            .replace(/\?/g, '[^/]') // Replace ? with regex for single char
            .replace(/{{GLOBSTAR}}/g, '.*') // Replace ** with regex for any characters
            .replace(/\[([^\]]+)\]/g, match => {
            // Handle character classes [abc] and negated classes [!abc]
            if (match.startsWith('[!')) {
                return `[^${match.slice(2, -1)}]`;
            }
            return match;
        });
        // Ensure we match the entire string
        const regex = new RegExp(`^${regexPattern}$`, 'i'); // case-insensitive matching for Windows compatibility
        return regex.test(normalizedPath);
    }
    /**
     * Get all files in a directory recursively
     */
    async getAllFiles(dir) {
        const entries = await fs.promises.readdir(dir, { withFileTypes: true });
        const files = await Promise.all(entries.map(async (entry) => {
            const fullPath = path.join(dir, entry.name);
            return entry.isDirectory() ? this.getAllFiles(fullPath) : [fullPath];
        }));
        return files.flat();
    }
    /**
     * Recursively process a directory
     */
    async processDirectory(currentDir, indent, projectDir, includePatterns, excludePatterns, maxOutputFileSizeBytes) {
        const relativePath = path.relative(projectDir, currentDir);
        if (relativePath === '') {
            await this.writeLineToOutput("[DIR] .", maxOutputFileSizeBytes);
        }
        else {
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
                }
                else {
                    // Only process certain file types
                    if (this.isProcessableFile(itemPath)) {
                        await this.writeLineToOutput(`${indent}  [FILE] ${entry.name}`, maxOutputFileSizeBytes);
                    }
                }
            }
        }
        catch (err) {
            console.error(`Error processing directory ${currentDir}:`, err);
        }
    }
    /**
     * Check if a file is of a processable type
     * @param filePath Path to the file to check
     * @returns True if the file should be processed, false otherwise
     */
    isProcessableFile(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const fileName = path.basename(filePath).toLowerCase();
        // Special handling for known file types without extensions
        if (['dockerfile', 'makefile', 'jenkinsfile', 'vagrantfile', '.gitignore', '.dockerignore', '.env'].includes(fileName)) {
            return true;
        }
        // Skip binary files and very large files by extension
        const binaryExts = [
            // Binaries and executables
            '.exe', '.dll', '.so', '.dylib', '.bin', '.o', '.obj',
            // Media files
            '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.ico', '.mp3', '.mp4', '.avi', '.mov',
            // Compressed files
            '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2',
            // Database files
            '.db', '.sqlite', '.mdb'
        ];
        if (binaryExts.includes(ext)) {
            return false;
        }
        // List of extensions to process
        const allowedExts = [
            // Code files
            '.ps1', '.cs', '.sln', '.py', '.js', '.ts', '.jsx', '.tsx', '.java', '.c', '.cpp', '.h', '.hpp',
            '.go', '.rs', '.rb', '.php', '.swift', '.kt', '.pl', '.sh', '.bash',
            // Web files
            '.html', '.htm', '.css', '.scss', '.less', '.svg',
            // Config and data files
            '.json', '.xml', '.yaml', '.yml', '.toml', '.ini', '.conf', '.config', '.lock',
            // Documentation
            '.md', '.txt', '.rst', '.adoc', '.tex', '.texi',
            // Project files
            '.csproj', '.vbproj', '.vcxproj', '.fsproj', '.gradle', '.pom', '.cargo', '.project', '.pbxproj',
            // Containerization
            '.Dockerfile', '.docker-compose', '.kube', '.tf', '.tfvars'
        ];
        return allowedExts.includes(ext) || ext === '';
    }
    /**
     * Detect dependencies in code files based on import statements
     * @param content File content to analyze
     * @param filePath Path to the file being analyzed
     * @returns Array of detected dependencies
     */
    detectDependencies(content, filePath) {
        const dependencies = [];
        const ext = path.extname(filePath).toLowerCase();
        const fileName = path.basename(filePath);
        // Handle different file types differently
        if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
            // JavaScript/TypeScript imports
            const importRegexes = [
                /import\s+.*?from\s+['"]([^'"]+)['"];?/g, // ES6 imports
                /import\s*\(['"]([^'"]+)['"]\);?/g, // Dynamic imports
                /require\s*\(['"]([^'"]+)['"]\);?/g, // CommonJS require
                /import\s+['"]([^'"]+)['"];?/g // Side-effect imports
            ];
            for (const regex of importRegexes) {
                let match;
                while ((match = regex.exec(content)) !== null) {
                    if (match[1] && !dependencies.includes(match[1])) {
                        dependencies.push(match[1]);
                    }
                }
            }
        }
        else if (['.py'].includes(ext)) {
            // Python imports
            const importRegexes = [
                /import\s+([\w\d_.]+)/g, // import x
                /from\s+([\w\d_.]+)\s+import/g // from x import y
            ];
            for (const regex of importRegexes) {
                let match;
                while ((match = regex.exec(content)) !== null) {
                    if (match[1] && !dependencies.includes(match[1])) {
                        dependencies.push(match[1]);
                    }
                }
            }
        }
        else if (['.java'].includes(ext)) {
            // Java imports
            const importRegex = /import\s+([\w\d_.]+)(?:\.[*])?;/g;
            let match;
            while ((match = importRegex.exec(content)) !== null) {
                if (match[1] && !dependencies.includes(match[1])) {
                    dependencies.push(match[1]);
                }
            }
        }
        else if (['.cs'].includes(ext)) {
            // C# imports
            const importRegex = /using\s+([\w\d_.]+);/g;
            let match;
            while ((match = importRegex.exec(content)) !== null) {
                if (match[1] && !dependencies.includes(match[1])) {
                    dependencies.push(match[1]);
                }
            }
        }
        else if (['.cpp', '.hpp', '.c', '.h'].includes(ext)) {
            // C/C++ includes
            const importRegex = /#include\s+[<"]([^>"]+)[>"]|#include\s+['"]([^'"]+)['"];?/g;
            let match;
            while ((match = importRegex.exec(content)) !== null) {
                const dep = match[1] || match[2];
                if (dep && !dependencies.includes(dep)) {
                    dependencies.push(dep);
                }
            }
        }
        else if (['.go'].includes(ext)) {
            // Go imports
            const importRegex = /import\s+\(([\s\S]*?)\)/g;
            const singleImportRegex = /import\s+[^\(].*?['"]([^'"]+)['"];?/g;
            // Extract multi-line imports
            let match;
            while ((match = importRegex.exec(content)) !== null) {
                const importBlock = match[1];
                const packageRegex = /['"]([^'"]+)['"];?/g;
                let packageMatch;
                while ((packageMatch = packageRegex.exec(importBlock)) !== null) {
                    if (packageMatch[1] && !dependencies.includes(packageMatch[1])) {
                        dependencies.push(packageMatch[1]);
                    }
                }
            }
            // Extract single-line imports
            let singleMatch;
            while ((singleMatch = singleImportRegex.exec(content)) !== null) {
                if (singleMatch[1] && !dependencies.includes(singleMatch[1])) {
                    dependencies.push(singleMatch[1]);
                }
            }
        }
        else if (['.php'].includes(ext)) {
            // PHP includes
            const importRegexes = [
                /require(_once)?\s+['"]([^'"]+)['"];?/g,
                /include(_once)?\s+['"]([^'"]+)['"];?/g,
                /use\s+([\w\\]+)(?:\\[\w]+)?;/g
            ];
            for (const regex of importRegexes) {
                let match;
                while ((match = regex.exec(content)) !== null) {
                    const dep = match[2] || match[1]; // require/include have the path in group 2, use statements in group 1
                    if (dep && !dependencies.includes(dep)) {
                        dependencies.push(dep);
                    }
                }
            }
        }
        else if (['.rb'].includes(ext)) {
            // Ruby requires
            const importRegexes = [
                /require\s+['"]([^'"]+)['"];?/g,
                /require_relative\s+['"]([^'"]+)['"];?/g,
                /load\s+['"]([^'"]+)['"];?/g
            ];
            for (const regex of importRegexes) {
                let match;
                while ((match = regex.exec(content)) !== null) {
                    if (match[1] && !dependencies.includes(match[1])) {
                        dependencies.push(match[1]);
                    }
                }
            }
        }
        else if (['.rs'].includes(ext)) {
            // Rust imports
            const importRegexes = [
                /use\s+([\w:]+)(?:::[{][\w\s:,]*[}]|::[\w]+)?;/g,
                /extern\s+crate\s+([\w]+);/g
            ];
            for (const regex of importRegexes) {
                let match;
                while ((match = regex.exec(content)) !== null) {
                    if (match[1] && !dependencies.includes(match[1])) {
                        dependencies.push(match[1]);
                    }
                }
            }
        }
        else if (['.html', '.htm'].includes(ext)) {
            // HTML dependencies (scripts, stylesheets, etc.)
            const importRegexes = [
                /<script\s+.*?src=['"]([^'"]+)['"].*?>(?:<\/script>)?/g,
                /<link\s+.*?href=['"]([^'"]+)['"].*?rel=['"]stylesheet['"].*?>/g,
                /<link\s+.*?rel=['"]stylesheet['"].*?href=['"]([^'"]+)['"].*?>/g,
                /<img\s+.*?src=['"]([^'"]+)['"].*?>/g
            ];
            for (const regex of importRegexes) {
                let match;
                while ((match = regex.exec(content)) !== null) {
                    if (match[1] && !dependencies.includes(match[1])) {
                        dependencies.push(match[1]);
                    }
                }
            }
        }
        else if (['.scss', '.less', '.css'].includes(ext)) {
            // CSS imports
            const importRegexes = [
                /@import\s+['"]([^'"]+)['"];?/g,
                /@use\s+['"]([^'"]+)['"];?/g,
                /url\(['"]?([^'"\)]+)['"]?\)/g
            ];
            for (const regex of importRegexes) {
                let match;
                while ((match = regex.exec(content)) !== null) {
                    if (match[1] && !dependencies.includes(match[1])) {
                        dependencies.push(match[1]);
                    }
                }
            }
        }
        return dependencies;
    }
    /**
     * Format detected dependencies as markdown
     * @param dependencies Array of detected dependencies
     * @returns Formatted markdown string
     */
    formatDependencies(dependencies) {
        if (dependencies.length === 0) {
            return "";
        }
        let result = "### Dependencies\n\n";
        for (const dep of dependencies) {
            result += `- \`${dep}\`\n`;
        }
        return result + "\n";
    }
    /**
     * Process the contents of a file
     * @param filepath Path to the file to process
     * @param projectDir Base project directory path
     * @param maxOutputFileSizeBytes Maximum size for output file before rotation
     */
    async processFileContents(filepath, projectDir, maxOutputFileSizeBytes) {
        try {
            const relativePath = path.relative(projectDir, filepath);
            if (!this.isProcessableFile(filepath)) {
                return;
            }
            // Prepare header content
            let output = "\n## " + relativePath + "\n\n";
            try {
                // Read file with error handling
                const content = await readFile(filepath, 'utf8');
                // Detect dependencies in the file
                const dependencies = this.detectDependencies(content, filepath);
                // Add dependency information if any were found
                if (dependencies.length > 0) {
                    output += this.formatDependencies(dependencies);
                }
                // Process content based on file type
                if (filepath.endsWith('.md')) {
                    // Strip markdown formatting
                    output += this.stripMarkdown(content);
                }
                else {
                    output += "```" + path.extname(filepath).substring(1) + "\n" + content + "\n```\n";
                }
                // Write in a single operation rather than line by line
                await this.writeBlockToOutput(output, maxOutputFileSizeBytes);
            }
            catch (readErr) {
                // Handle specific read errors
                if (readErr.code === 'ENOENT') {
                    console.error(`File not found: ${filepath}`);
                    await this.writeLineToOutput(`[Error: File not found]`, maxOutputFileSizeBytes);
                }
                else if (readErr.code === 'EACCES') {
                    console.error(`Permission denied for file: ${filepath}`);
                    await this.writeLineToOutput(`[Error: Permission denied]`, maxOutputFileSizeBytes);
                }
                else {
                    console.error(`Error reading file ${filepath}:`, readErr);
                    await this.writeLineToOutput(`[Error: Could not read file]`, maxOutputFileSizeBytes);
                }
            }
        }
        catch (err) {
            console.error(`Error processing file contents for ${filepath}:`, err);
        }
    }
    /**
     * Strip markdown formatting from content or transform it to plain text
     * @param content The markdown content to strip
     * @returns Plain text version of the content
     */
    stripMarkdown(content) {
        if (!content || content.trim() === '') {
            return '';
        }
        // Handle common markdown syntax
        let result = content;
        // Replace horizontal rules with line breaks
        result = result.replace(/^(---|___|\*\*\*)(\s*)?$/gm, '\n---\n');
        // Replace headers with plain text, but keep the content prominent
        result = result.replace(/^(#{1,6})\s+(.+)$/gm, (_, hashtags, title) => {
            const prefix = '\n' + '='.repeat(hashtags.length) + ' ';
            const suffix = ' ' + '='.repeat(hashtags.length) + '\n';
            return `${prefix}${title}${suffix}`;
        });
        // Remove bold: **text** or __text__
        result = result.replace(/\*\*([^*]+)\*\*/g, '$1');
        result = result.replace(/__([^_]+)__/g, '$1');
        // Remove italic: *text* or _text_
        result = result.replace(/\*([^*]+)\*/g, '$1');
        result = result.replace(/_([^_]+)_/g, '$1');
        // Replace blockquotes with indented text
        result = result.replace(/^>\s*(.*)$/gm, '   $1');
        // Replace lists with plain text
        result = result.replace(/^[\s]*[\*\-\+]\s+(.*)$/gm, '• $1');
        result = result.replace(/^[\s]*\d+\.\s+(.*)$/gm, '• $1');
        // Preserve code blocks but remove markdown syntax
        result = result.replace(/```(?:\w+)?\n([\s\S]*?)```/g, (_, code) => {
            return '\n--- CODE ---\n' + code.trim() + '\n--- END CODE ---\n';
        });
        // Remove inline code: `text`
        result = result.replace(/`([^`]+)`/g, '$1');
        // Replace links: [text](url) with just text
        result = result.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
        // Replace image links: ![alt](url) with [Image: alt]
        result = result.replace(/!\[([^\]]+)\]\([^)]*\)/g, '[Image: $1]');
        // Replace tables with simplified format
        result = result.replace(/\|(.+)\|/g, '$1');
        result = result.replace(/^[\s]*[-:]+[-:\s]*$/gm, '');
        // Remove extra whitespace
        result = result.replace(/\n{3,}/g, '\n\n');
        return result.trim();
    }
    /**
     * Count directories in a path
     */
    async countDirectories(dirPath) {
        let count = 0;
        try {
            const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    count++;
                    count += await this.countDirectories(path.join(dirPath, entry.name));
                }
            }
        }
        catch (err) {
            console.error(`Error counting directories in ${dirPath}:`, err);
        }
        return count;
    }
    /**
     * Generate a summary of the flattening process
     * @param fileCount Number of files processed
     * @param dirCount Number of directories scanned
     * @param totalBytes Total size in bytes
     * @param duration Duration of process in seconds (optional)
     * @returns Formatted summary string
     */
    generateSummary(fileCount, dirCount, totalBytes, duration) {
        const approxTokens = Math.floor(totalBytes / 4);
        // Format sizes in a more readable way
        let sizeStr = `${totalBytes} bytes`;
        if (totalBytes > MB) {
            sizeStr = `${(totalBytes / MB).toFixed(2)} MB (${totalBytes} bytes)`;
        }
        else if (totalBytes > KB) {
            sizeStr = `${(totalBytes / KB).toFixed(2)} KB (${totalBytes} bytes)`;
        }
        // Format duration if provided
        let durationStr = '';
        if (duration !== undefined) {
            if (duration < 60) {
                durationStr = `\nProcessing time: ${duration.toFixed(2)} seconds`;
            }
            else {
                const minutes = Math.floor(duration / 60);
                const seconds = duration % 60;
                durationStr = `\nProcessing time: ${minutes} minutes ${seconds.toFixed(0)} seconds`;
            }
        }
        return `Repository Summary:
Files analyzed: ${fileCount}
Directories scanned: ${dirCount}
Total size: ${sizeStr}
Estimated tokens: ${approxTokens}${durationStr}

`;
    }
    /**
     * Ensure a directory exists
     */
    async ensureDirectory(dirPath) {
        try {
            await mkdir(dirPath, { recursive: true });
        }
        catch (err) {
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }
    }
    /**
     * Write a line to the output file, rotating if necessary
     * @param line The line to write
     * @param maxOutputFileSizeBytes Maximum file size before rotation
     */
    async writeLineToOutput(line, maxOutputFileSizeBytes) {
        // Use the block writer with a newline for consistency
        await this.writeBlockToOutput(line + '\n', maxOutputFileSizeBytes);
    }
    /**
     * Write a block of text, handling file rotation if needed
     * @param block The text block to write
     * @param maxOutputFileSizeBytes Maximum file size before rotation
     */
    async writeBlockToOutput(block, maxOutputFileSizeBytes) {
        // Check current file size before writing
        try {
            const stats = await stat(this.currentOutputFile);
            const currentSize = stats.size;
            const blockSize = Buffer.byteLength(block, 'utf8');
            // If adding this block would exceed max size, rotate the file first
            if (currentSize + blockSize > maxOutputFileSizeBytes) {
                this.filePart++;
                this.currentOutputFile = path.join(this.outputFileDirectory, `${this.baseOutputFileName}_part${this.filePart}${this.outputFileExtension}`);
                const header = `# Project Digest Continued: ${this.projectName}\nGenerated on: ${new Date().toString()}\n\n`;
                await writeFile(this.currentOutputFile, header);
            }
            // Write the entire block at once instead of line by line
            await fs.promises.appendFile(this.currentOutputFile, block);
        }
        catch (err) {
            console.error('Error in writeBlockToOutput:', err);
        }
    }
}
exports.CodeFlattener = CodeFlattener;
//# sourceMappingURL=codeFlattener.js.map