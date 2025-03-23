# CodeFlattener

[![Version](https://img.shields.io/badge/version-1.5.5-blue.svg)](https://github.com/GTuritto/CodeFlattener/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/GTuritto/CodeFlattener/blob/main/LICENSE)
[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-blue.svg)](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener)

## **Unlock the Full Potential of Your Codebase with One Click**

### **A Practical Solution for AI-Assisted Development, Code Reviews, and Project Sharing**

CodeFlattener transforms your multi-file project into a structured, dependency-aware markdown document. It aims to solve common challenges with limited context in AI assistants and disjointed code reviews by delivering your codebase as a single, organized document that preserves relationships between files.

## Key Features

- **Consolidated Output**: Creates a single comprehensive file (split only if necessary for size)
- **Dependency Tracking**: Automatically detects and visualizes dependencies between files
- **Mermaid Diagrams**: Adds visual dependency graphs for clearer understanding
- **Broad Language Support**: Works with 20+ programming languages and various file formats
- **Syntax Highlighting**: Properly formatted code blocks for enhanced readability
- **Customizable**: Configurable output location, file filtering, and size limits
- **Performance Optimized**: Uses parallel processing for fast execution on large codebases

## How to Use CodeFlattener

### Quick Start

1. Open your project folder in VSCode
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) to open the command palette
3. Type "Flatten Code" and select the command
4. Wait while the extension processes your files (a progress indicator will be shown)
5. Once complete, a notification will appear with the location of your flattened code
6. Open the `CodeFlattened` folder (or your custom output folder) to view the generated markdown files

### Viewing the Results

The extension generates comprehensive markdown files that include:

- A summary section with file counts and statistics
- A directory structure visualization to help navigate your project
- For each file, a list of its dependencies and complete code
- A Mermaid dependency diagram to visualize file relationships

### Customizing the Output

1. Go to VS Code Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "CodeFlattener"
3. Modify any of the following settings:
   - Change the output folder name
   - Exclude specific file patterns
   - Include only specific file patterns
   - Adjust maximum file size limits
   - Set output file size for splitting large codebases

## Extension Settings

- **codeFlattener.outputFolder**: Name of the folder where flattened code will be saved (default: "CodeFlattened")
- **codeFlattener.excludePatterns**: Patterns to exclude from processing in glob format
- **codeFlattener.includePatterns**: Patterns to include in processing in glob format
- **codeFlattener.maxFileSizeBytes**: Maximum file size in bytes for analysis (default: 10MB)
- **codeFlattener.maxOutputFileSizeBytes**: Maximum output file size before rotation (default: 5MB)

## Supported Languages

CodeFlattener works with most popular programming languages and file formats:

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

This helps AI models understand file relationships in your codebase, improving context-aware code generation.

## Performance Optimizations

- **Parallel Processing**: Files are processed in parallel batches for faster execution
- **Efficient File I/O**: Minimizes disk operations by batching writes
- **Smart File Filtering**: Uses efficient glob pattern matching
- **Memory Management**: Handles large files gracefully to avoid memory issues
- **Robust Error Handling**: Continues processing despite individual file failures

## How CodeFlattener Can Help You

- **Enhance AI Coding Assistants**: Feed your codebase to AI tools with better context preservation
- **Streamline Code Reviews**: Share navigable code snapshots with clear dependencies
- **Simplify Documentation**: Generate dependency-aware documentation for onboarding
- **Explore New Codebases**: Flatten unfamiliar projects to understand architecture more clearly

## Troubleshooting

- **Processing takes too long**: Try excluding non-essential directories using the exclude patterns
- **Output file is too large**: Adjust the `maxOutputFileSizeBytes` setting
- **Missing important files**: Check your include/exclude patterns
- **Memory issues**: Increase the `maxFileSizeBytes` setting for very large codebases

---

## Installation Options

### VS Code Marketplace (Recommended)

Install directly from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener) for automatic updates.

### Direct Download from GitHub

**[⬇️ Download Latest Release (v1.5.5)](https://github.com/GTuritto/CodeFlattener/raw/main/releases/code-flattener-1.5.5.vsix)**

To install from VSIX:

1. Download the file from the link above
2. Open VS Code
3. Go to Extensions view (Ctrl+Shift+X)
4. Click on the three dots (...) in the top-right corner
5. Select "Install from VSIX..."
6. Choose the downloaded file

### Manual Installation from GitHub

1. Clone the repository:

   ```bash
   git clone https://github.com/GTuritto/CodeFlattener.git
   ```

2. Install dependencies:

   ```bash
   cd SourceCodeFlatener_Extension
   npm install
   ```

3. Install the extension:

   ```bash
   code --install-extension .
   ```

---

**⭐ If you find this extension helpful, please consider [leaving a review](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener&ssr=false#review-details)! ⭐**

**[Submit Feedback](https://codeflattener.canny.io/) | [Rate & Review](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener&ssr=false#review-details) | [GitHub Repository](https://github.com/GTuritto/CodeFlattener) | Contact: [giuseppe@turitto.net](mailto:giuseppe@turitto.net) (limited support)**
