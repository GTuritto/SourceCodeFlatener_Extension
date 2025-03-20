# Source Code Flattener VSCode Extension

[![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)](https://github.com/GTuritto/SourceCodeFlatener_Extension/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/GTuritto/SourceCodeFlatener_Extension/blob/main/LICENSE)
[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue.svg)](https://marketplace.visualstudio.com/items?itemName=GTuritto.source-code-flattener)

> **⬇️ [Download Extension](https://github.com/GTuritto/SourceCodeFlatener_Extension/raw/main/source-code-flattener-1.0.1.vsix)**
>
> One-click download and install! See [installation instructions](#direct-download-easiest-method).

This extension flattens source code files in a project into a single or multiple markdown files in a dedicated folder, making it easy for AI assistants and LLMs to access and understand the codebase.

## Features

- Flattens source code from your workspace into a single markdown file (or multiple if size exceeds limits)
- Automatically creates a `CodeFlattened` folder (configurable) in your project root
- Provides a directory structure overview and comprehensive file listing
- Includes full source code content of each file with proper formatting
- Intelligently processes and formats markdown files for better readability
- Ignores binary files, build directories, and other configurable patterns
- Supports a wide range of file types including code, config, documentation, and more
- Tracks file sizes and estimated token counts with human-readable formatting
- Detailed progress indicators with status updates during processing
- Parallel file processing for improved performance on large codebases
- Robust error handling to continue processing despite individual file failures

## Installation

### Direct Download (Easiest Method)

1. Download the VSIX file from our GitHub repository: [Download source-code-flattener-1.0.1.vsix](https://github.com/GTuritto/SourceCodeFlatener_Extension/raw/main/source-code-flattener-1.0.1.vsix)

2. Install it in VS Code:
   - Open VS Code
   - Go to Extensions view (Ctrl+Shift+X or Cmd+Shift+X on macOS)
   - Click on the three dots (...) in the top-right corner
   - Select "Install from VSIX..."
   - Choose the downloaded VSIX file

Or use this command after downloading:

```bash
code --install-extension source-code-flattener-1.0.1.vsix
```

### Quick Install from GitHub

```bash
# One-command installation
git clone https://github.com/GTuritto/SourceCodeFlatener_Extension.git && \
cd SourceCodeFlatener_Extension && \
npm install && \
code --install-extension .
```

### From VS Code Marketplace

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X on macOS)
3. Search for "Source Code Flattener"
4. Click Install

### Manual Installation from GitHub

1. Clone the repository:

   ```bash
   git clone https://github.com/GTuritto/SourceCodeFlatener_Extension.git
   ```

2. Install the dependencies:

   ```bash
   cd SourceCodeFlatener_Extension
   npm install
   ```

3. Install the extension locally:

   ```bash
   code --install-extension .
   ```

   Note: The compiled files are already included in the repository, so you don't need to compile anything yourself!

## Usage

1. Open your project folder in VSCode
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) to open the command palette
3. Type "Flatten Source Code" and select the command
4. The extension will process your project and create flattened source files in the output folder

## Extension Settings

This extension contributes the following settings:

- `sourceCodeFlattener.outputFolder`: Name of the folder where flattened source code will be saved (default: "CodeFlattened")
- `sourceCodeFlattener.excludePatterns`: Patterns to exclude from processing in glob format (default: bin/\**, obj/\**, node_modules/\**, etc.)
- `sourceCodeFlattener.includePatterns`: Patterns to include in processing in glob format (if empty, all files are processed except excluded ones)
- `sourceCodeFlattener.maxFileSizeBytes`: Maximum file size in bytes for analysis (default: 10MB)
- `sourceCodeFlattener.maxOutputFileSizeBytes`: Maximum output file size in bytes before rotation (default: 5MB)

## How It Works

The extension scans your project directory, ignoring paths that match exclude patterns, and includes files that match appropriate code file extensions. It creates a markdown file that includes:

1. A summary section with file counts, size information, and processing time
2. A directory structure visualization with folders and files
3. The complete content of each source file with proper formatting

Large output files are automatically split into multiple parts to avoid token limits when used with AI tools.

## Performance Optimizations

This extension is optimized for performance and reliability:

- **Parallel Processing**: Files are processed in parallel batches for faster execution
- **Efficient File I/O**: Minimizes disk operations by batching writes and optimizing content handling
- **Smart File Filtering**: Uses efficient glob pattern matching with fast-path optimizations
- **Memory Management**: Handles large files gracefully to avoid memory issues
- **Robust Error Handling**: Continues processing even if individual files have issues
- **Progress Reporting**: Provides detailed progress updates during processing

## Supported File Types

The extension supports a wide range of file types including:

- **Code Files**: `.js`, `.ts`, `.py`, `.java`, `.c`, `.cpp`, `.cs`, `.go`, `.rb`, `.php`, etc.
- **Web Files**: `.html`, `.css`, `.scss`, `.less`, `.svg`, etc.
- **Config Files**: `.json`, `.xml`, `.yaml`, `.yml`, `.toml`, `.ini`, etc.
- **Documentation**: `.md`, `.txt`, `.rst`, etc.
- **Project Files**: `.csproj`, `.vbproj`, `.gradle`, etc.
- **Special Files**: `Dockerfile`, `Makefile`, `.gitignore`, etc.

Binary files and media files are automatically excluded from processing.

## Credits

Based on the shell script from [GTuritto/SourceCodeFlatener](https://github.com/GTuritto/SourceCodeFlatener).
