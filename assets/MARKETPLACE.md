# CodeFlattener

[![Version](https://img.shields.io/badge/version-1.6.0-green.svg)](https://github.com/GTuritto/SourceCodeFlatener_Extension/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/GTuritto/SourceCodeFlatener_Extension/blob/main/LICENSE)

## Unlock the Full Potential of Your Codebase with One Click

### A Practical Solution for AI-Assisted Development, Code Reviews, and Project Sharing

CodeFlattener transforms your multi-file project into a structured, dependency-aware markdown document. It solves common challenges with limited context in AI assistants and disjointed code reviews by delivering your codebase as a single, organized document that preserves relationships between files.

## Key Features

- **Consolidated Output**: Creates a single comprehensive file (split only if necessary for size)
- **Dependency Tracking**: Automatically detects and visualizes dependencies between files
- **Mermaid Diagrams**: Adds visual dependency graphs for clearer understanding
- **Broad Language Support**: Works with 20+ programming languages and various file formats
- **Syntax Highlighting**: Properly formatted code blocks for enhanced readability
- **Customizable**: Configurable output location, file filtering, and size limits
- **Performance Optimized**: Uses parallel processing for fast execution on large codebases

## Why Use CodeFlattener?

- **Break AI Context Barriers**: Feed your entire codebase to ChatGPT, Claude, or other AI tools with full context preservation
- **Super-Charge Code Reviews**: Share navigable code snapshots with clear dependencies and relationships
- **Document Architecture Instantly**: Generate project documentation that actually shows how files connect
- **Understand New Codebases**: Flatten unfamiliar projects to grasp their structure in minutes, not days

## Use Cases

### For AI Development

**Before**: *"Sorry, I don't have enough context about your codebase to help with that."*  
**After**: *AI provides precise, context-aware suggestions across your entire project*

### For Code Reviews

**Before**: *Switching between multiple files, losing track of dependencies*  
**After**: *A single document with clear visualization of how components interact*

### For Documentation

**Before**: *Outdated or non-existent project documentation*  
**After**: *Up-to-date architectural overview generated in seconds*

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

---

**If you find this extension helpful, please [leave a review](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener&ssr=false#review-details)!**

[VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener) | [Rate & Review](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener&ssr=false#review-details) | [Q&A](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener&ssr=false#qna) | **Contact: <giuseppe@turitto.net> (limited support)**
