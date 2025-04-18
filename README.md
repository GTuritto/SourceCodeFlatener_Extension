# Code Flattener

[![Version](https://img.shields.io/badge/version-1.6.2-green.svg)](https://github.com/GTuritto/SourceCodeFlatener_Extension/releases/code-flattener-1.6.2.vsix)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/GTuritto/SourceCodeFlatener_Extension/blob/main/LICENSE)
[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-red.svg)](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener)

## Overview

Code Flattener is a VS Code extension that transforms multi-file projects into structured, dependency-aware markdown documents. It solves common challenges with limited context in AI assistants and disjointed code reviews by delivering codebases as navigable, organized documents that preserve relationships between files.

![Code Flattener Demo](assets/icon/Flattener.png)

## Key Features

- **Consolidated Output**: Creates a single comprehensive file (split only if necessary for size)
- **Dependency Tracking**: Automatically detects and visualizes dependencies between files
- **Mermaid Diagrams**: Adds visual dependency graphs for clearer understanding
- **Git Change Detection**: Highlights recently modified files to focus LLM attention on active code
- **Broad Language Support**: Works with 20+ programming languages and various file formats
- **Syntax Highlighting**: Properly formatted code blocks for enhanced readability
- **Customizable**: Configurable output location, file filtering via .flattenignore, and size limits
- **Performance Optimized**: Uses parallel processing for fast execution on large codebases

## Installation Options

### VS Code Marketplace (Recommended)

Install directly from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener) for automatic updates.

### Direct Download from GitHub

**[⬇️ Download Latest Release (v1.6.0)](https://github.com/GTuritto/SourceCodeFlatener_Extension/raw/main/releases/code-flattener-latest.vsix)**

To install from VSIX:

1. Download the file from the link above
2. Open VS Code
3. Go to Extensions view (Ctrl+Shift+X)
4. Click on the three dots (...) in the top-right corner
5. Select "Install from VSIX..."
6. Choose the downloaded file

## Usage

### Quick Start

1. Open your project folder in VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) to open the command palette
3. Type "Flatten Code" and select the command
4. Wait while the extension processes your files (a progress indicator will be shown)
5. Once complete, a notification will appear with the location of your flattened code
6. Open the `CodeFlattened` folder (or your custom output folder) to view the generated markdown files

### Configuration Options

In VS Code Settings (`Ctrl+,` or `Cmd+,`), search for "Code Flattener" to configure:

- **`codeFlattener.outputFolder`**: Name of the folder where flattened code will be saved (default: "CodeFlattened_Output")
- **`codeFlattener.maxFileSizeBytes`**: Maximum file size in bytes for analysis (default: 10MB)
- **`codeFlattener.maxOutputFileSizeBytes`**: Maximum output file size before rotation (default: 5MB)
- **`codeFlattener.prioritizeImportantFiles`**: Prioritize important files in the output (default: true)
- **`codeFlattener.addCodeRelationshipDiagrams`**: Add Mermaid diagrams showing code relationships (default: true)
- **`codeFlattener.respectFlattenignore`**: Respect .flattenignore files for exclusions (default: true)

#### Ultra-Compact Mode (new in v1.6.1)

- **`codeFlattener.ultraCompactMode`**: Enable extreme minification for maximum token efficiency (default: false)
- **`codeFlattener.compactModeLevel`**: Compression intensity level (default: moderate)
  - `minimal`: Light compression focusing only on comments
  - `moderate`: Balanced compression preserving most structure
  - `aggressive`: Maximum compression for lowest token usage

#### Git Change Detection (new in v1.6.1)

- **`codeFlattener.highlightGitChanges`**: Highlight recently changed files for better LLM focus (default: true)
- **`codeFlattener.gitChangeHighlightStyle`**: Style of highlighting (emoji, text, or markdown) (default: emoji)
- **`codeFlattener.gitChangeHistoryDepth`**: Number of days to look back for changes (default: 1)
- **`codeFlattener.prioritizeGitChanges`**: Boost changed files to top of output (default: true)

## LLM Optimization Features

### Ultra-Compact Mode

The Ultra-Compact Mode generates highly compressed output for the most token-efficient LLM interactions:

- **Extreme Minification**: Aggressively reduces token usage while preserving code semantics
- **Customizable Levels**: Choose from minimal, moderate, or aggressive compression
- **Intelligent Compression**: Smart algorithms detect and condense repetitive patterns
- **Comment Summarization**: Preserves essential documentation while reducing verbosity
- **Size Reduction**: Can reduce output size by 30-50% compared to standard minification

### Git Change Detection

The Git Change Detection feature helps LLMs focus on the most relevant parts of your codebase:

- **Contextual Awareness**: Clearly marks which files you're actively working on
- **Token Efficiency**: When using prioritization, puts changed files first, saving tokens on less relevant code
- **Focus Guidance**: Visual markers help guide LLM attention to code that matters most
- **Configurable Depth**: Look back 1-7+ days to match your development cycle
- **Visual Customization**: Choose from emoji (🔄), text, or markdown highlighting styles

### How It Works

1. Automatically detects if your project uses Git
2. Identifies recently changed files based on your history depth setting
3. Marks these files with your preferred highlighting style
4. Optionally prioritizes changed files at the top of the flattened output

This feature combines perfectly with the Mermaid diagram visualizations, making it easier for AI assistants to understand both your code architecture and your active development focus.

## Supported Languages

Code Flattener works with most popular programming languages and file formats:

- **Programming**: JavaScript, TypeScript, Python, Java, C/C++, C#, Go, Ruby, PHP, Rust, Swift, Kotlin, Dart, and more
- **Web**: HTML, CSS, SCSS, LESS, SVG
- **Configuration**: JSON, YAML, TOML, XML, INI
- **Infrastructure**: Terraform, Docker, Kubernetes
- **Documentation**: Markdown, RST, TXT

## Dependency Detection

The extension automatically detects dependencies between files for all major languages including:

- **JavaScript/TypeScript**: ES6 imports, CommonJS requires, dynamic imports
- **Python**: import statements and from-import statements
- **Java**: package imports
- **C#**: using directives
- **C/C++**: #include statements
- **Go**: import statements
- **And many more**: PHP, Ruby, Rust, Swift, Kotlin, Dart, Elixir, Erlang, etc.

## Troubleshooting

### Command Not Found Error

If you encounter an error that the command `code-flattner.flattenCode` is not found, please note the correct command ID is `code-flattener.flattenCode` (with an 'e' between 't' and 'n').

The recommended way to use the extension is through the Command Palette:

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
2. Type "Flatten Code" (not the full command ID)
3. Select the command from the dropdown

If you're calling the command programmatically, make sure to use the correct ID: `code-flattener.flattenCode`

### Other Common Issues

- **Processing takes too long**: Try excluding non-essential directories using the exclude patterns
- **Output file is too large**: Adjust the `maxOutputFileSizeBytes` setting
- **Missing important files**: Check your include/exclude patterns
- **Memory issues**: Increase the `maxFileSizeBytes` setting for very large codebases

## Development

### Setup

1. Clone the repository:
  
   ```bash
   git clone https://github.com/GTuritto/SourceCodeFlatener_Extension.git
   cd SourceCodeFlatener_Extension
   ```

2. Install dependencies:
  
   ```bash
   npm install
   ```

3. Open in VS Code:
  
   ```bash
   code .
   ```

### Build and Run

- **Compile**: `npm run compile`
- **Watch for changes**: `npm run watch`
- **Lint**: `npm run lint`
- **Test**: `npm run test`

### Debug

1. Press F5 in VS Code to start debugging
2. This will open a new VS Code window with the extension loaded
3. Use the "Flatten Code" command to test the extension

### Packaging

```bash
npx vsce package
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

**⭐ If you find this extension helpful, please consider [leaving a review](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener&ssr=false#review-details)! ⭐**
