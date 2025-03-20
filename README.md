# Source Code Flattener VSCode Extension

This extension flattens source code files in a project into a single or multiple markdown files in a dedicated folder, making it easy for AI assistants and LLMs to access and understand the codebase.

## Features

- Flattens source code from your workspace into a single markdown file (or multiple if size exceeds limits)
- Automatically creates a `CodeFlattened` folder (configurable) in your project root
- Provides a directory structure overview
- Includes full source code content of each file
- Ignores binary files, build directories, and other configurable patterns
- Tracks file sizes and estimated token counts
- Progress indicator during processing

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

1. A summary section with file counts and size information
2. A directory structure visualization
3. The content of each source file

Large output files are automatically split into multiple parts to avoid token limits when used with AI tools.

## Credits

Based on the shell script from [GTuritto/SourceCodeFlatener](https://github.com/GTuritto/SourceCodeFlatener).
