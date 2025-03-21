# Source Code Flattener VSCode Extension

[![Version](https://img.shields.io/badge/version-1.5.0-blue.svg)](https://github.com/GTuritto/SourceCodeFlatener_Extension/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/GTuritto/SourceCodeFlatener_Extension/blob/main/LICENSE)
[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue.svg)](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.source-code-flattener)

## 🎉 Now Available on the VS Code Marketplace

This extension is now available on the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.source-code-flattener). Install it directly from within VS Code for the easiest experience!

> **⬇️ [Download Extension](https://github.com/GTuritto/SourceCodeFlatener_Extension/raw/main/releases/source-code-flattener-latest.vsix)**
>
> One-click download and install! See [installation instructions](#direct-download-easiest-method).

This extension flattens source code files in a project into a single or multiple markdown files in a dedicated folder, making it easy for AI assistants and LLMs to access and understand the codebase.

## Features

- Flattens source code from your workspace into a single markdown file (or multiple if size exceeds limits)
- **EXPANDED: Now supports dependency detection for 20+ languages (see [Dependency Documentation](#dependency-documentation))**
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

1. Download the VSIX file from our GitHub repository: [Download Extension](https://github.com/GTuritto/SourceCodeFlatener_Extension/raw/main/releases/source-code-flattener-latest.vsix)

2. Install it in VS Code:
   - Open VS Code
   - Go to Extensions view (Ctrl+Shift+X or Cmd+Shift+X on macOS)
   - Click on the three dots (...) in the top-right corner
   - Select "Install from VSIX..."
   - Choose the downloaded VSIX file

Or use this command after downloading:

```bash
code --install-extension source-code-flattener-latest.vsix
```

### Quick Install from GitHub

```bash
# One-command installation
git clone https://github.com/GTuritto/SourceCodeFlatener_Extension.git && \
cd SourceCodeFlatener_Extension && \
npm install && \
code --install-extension .
```

### From VS Code Marketplace (Recommended)

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X on macOS)
3. Search for "Source Code Flattener"
4. Click Install

This is the easiest method and ensures you'll receive automatic updates when new versions are released.

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
3. For each file, a list of its dependencies (imports, includes, etc.)
4. The complete content of each source file with proper formatting

Large output files are automatically split into multiple parts to avoid token limits when used with AI tools.

## Dependency Documentation

The extension automatically detects and documents dependencies between files. For each file, it:

1. Analyzes the file content to identify import statements, require calls, or includes
2. Adds a "Dependencies" section at the beginning of each file's documentation
3. Lists all detected dependencies with their paths or module names

Supported languages and import types:

- **JavaScript/TypeScript**: ES6 imports, CommonJS requires, dynamic imports (.js, .jsx, .ts, .tsx, .mjs, .cjs, .mts, .cts)
- **Python**: import statements and from-import statements (.py, .pyi, .pyw)
- **Java**: package imports (.java)
- **C#**: using directives (.cs)
- **C/C++**: #include statements (.cpp, .hpp, .c, .h, .cxx, .cc, .hxx)
- **Go**: import statements (both single and block imports) (.go)
- **PHP**: require/include statements and use declarations (.php, .phtml, .php3, .php4)
- **Ruby**: require and load statements (.rb, .rbw)
- **Rust**: use and extern crate statements (.rs)
- **Swift**: import statements (.swift)
- **Kotlin**: import statements with optional alias (.kt, .kts)
- **Dart**: import and part statements (.dart)
- **Elixir**: alias, import, and require statements (.ex, .exs)
- **Erlang**: -include and -include_lib directives (.erl, .hrl)
- **Terraform**: module, provider, and resource declarations (.tf, .tfvars, .hcl)
- **Docker**: FROM statements in Dockerfiles
- **Kubernetes/Docker Compose**: image references in YAML files
- **SQL**: table references from FROM and JOIN clauses (.sql, .mysql, .pgsql, .sqlite)
- **HTML**: script, link, and img references (.html, .htm)
- **CSS/SCSS/LESS**: @import and url() references (.css, .scss, .less)

This feature makes it easier for AI models to understand the relationships between files in your codebase, improving context-aware code generation and understanding.

## Syntax Highlighting

The extension now provides comprehensive syntax highlighting support for all supported languages, making your flattened code more readable:

- Each code block in the generated markdown file is tagged with the appropriate language identifier
- Syntax highlighting works automatically in VS Code and other markdown viewers that support code blocks
- All file types are mapped to their correct language for highlighting purposes
- Enhanced readability helps both human readers and AI models understand the code structure

The color-coded syntax highlighting makes it much easier to scan through large codebases and helps AI tools better understand the structure and syntax of different programming languages.

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

- **Code Files**: `.js`, `.ts`, `.py`, `.java`, `.c`, `.cpp`, `.cs`, `.go`, `.rb`, `.php`, `.rs`, `.swift`, `.kt`, `.dart`, `.ex`, `.erl`, `.tf`, etc.
- **Web Files**: `.html`, `.css`, `.scss`, `.less`, `.svg`, etc.
- **Config Files**: `.json`, `.xml`, `.yaml`, `.yml`, `.toml`, `.ini`, etc.
- **Documentation**: `.md`, `.txt`, `.rst`, etc.
- **Project Files**: `.csproj`, `.vbproj`, `.gradle`, etc.
- **Special Files**: `Dockerfile`, `Makefile`, `.gitignore`, etc.

Binary files and media files are automatically excluded from processing.

## For Developers

### Versioning System

This project uses a centralized versioning system to maintain consistent version numbers across all files:

- The current version is stored in the `VERSION` file at the root of the project
- An automated script (`update_version.sh`) helps update version numbers across all files

To update the version number:

```bash
./update_version.sh NEW_VERSION
# Example: ./update_version.sh 1.2.0
```

The script will automatically update:

- VERSION file
- package.json
- README.md
- DOWNLOAD.md
- CHANGELOG.md (adds a new version section)

After running the script, you should:

1. Edit the CHANGELOG.md to document your changes
2. Run `npx vsce package` to build the new package
3. Create a new Git tag with `git tag -a vX.Y.Z -m "Version X.Y.Z"`

## Credits

Based on the shell script from [GTuritto/SourceCodeFlatener](https://github.com/GTuritto/SourceCodeFlatener).
