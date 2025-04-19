# CodeFlattener: Source Code to Markdown Transformer

[![Version](https://img.shields.io/badge/version-1.6.1-green.svg)](https://github.com/GTuritto/SourceCodeFlatener_Extension/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/GTuritto/SourceCodeFlatener_Extension/blob/main/LICENSE)
[![VS Code Marketplace](https://img.shields.io/badge/VS%20Code-Marketplace-red.svg)](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener)

> **Convert multi-file projects into structured single documents for AI tools, code reviews, and documentation**

## Unlock the Full Potential of Your Codebase with One Click

### A Practical Solution for AI-Assisted Development, Code Reviews, and Project Sharing

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Latest Improvements](#latest-improvements-v161)
- [Settings](#streamlined-settings)
- [How to Use](#usage)
- [AI Assistant Integration](#perfect-for-ai-assistants)
- [Supported Languages](#supported-languages)
- [Benefits](#key-benefits)
- [Use Cases](#use-cases)
- [Detailed Usage Guide](#how-to-use-codeflattener)
- [Get Started](#get-started-today)

## Overview

CodeFlattener transforms your multi-file project into a structured, dependency-aware markdown document. It solves common challenges with limited context in AI assistants and disjointed code reviews by delivering your codebase as a single, organized document that preserves relationships between files. Perfect for LLMs like ChatGPT, Claude, and Copilot, it helps AI tools understand your entire code structure.

## Key Features

- **Consolidated Output**: Creates a single comprehensive file (split only if necessary for size)
- **Dependency Tracking**: Automatically detects and visualizes dependencies between files
- **Mermaid Diagrams**: Optional visual diagrams for clearer understanding of code relationships
- **Broad Language Support**: Works with 20+ programming languages and various file formats
- **Plain Text Processing**: All code is treated as plain text for maximum compatibility with LLMs
- **Enhanced Security**: Automatically excludes sensitive files and information
- **Gitignore Support**: Respects your project's .gitignore patterns
- **Flattenignore Support** (v1.6.1): Exclude specific files and directories via .flattenignore
- **Important Files First**: Prioritizes key files like configuration and entry points
- **Cross-Platform**: Works seamlessly on Windows, macOS, and Linux
- **Explorer Integration**: Right-click in the file explorer to flatten specific directories

## Latest Improvements (v1.6.1)

### Ultra-Compact Mode

- **Maximum Token Efficiency**: New compression options to create extremely compact output files
- **Customizable Compression**: Three intensity levels (minimal, moderate, aggressive) to match your needs
- **Smart Processing**: Intelligent algorithms that preserve code semantics while reducing size
- **Token Optimization**: Can reduce token usage by 30-50% for more efficient LLM interactions

### Git Change Detection for LLMs

- **Smart Code Focus**: Automatically highlights recently modified files to focus LLM attention on actively developed code
- **Configurable Highlighting**: Choose between emoji (🔄), text, or markdown highlighting styles
- **Flexible History**: Set how many days back to consider changes (1-7+) to match your development cycle
- **Priority Boosting**: Option to move changed files to the top of the output for maximum token efficiency

### Other Enhancements

- **Flattenignore Support**: Added `.flattenignore` files to exclude specific files/directories from output
- **Improved Error Handling**: User-friendly messages instead of console errors
- **Enhanced VS Code Integration**: Dedicated logging output channel

## Streamlined Settings

CodeFlattener features a simplified settings interface, focusing on what matters most:

| Setting | Description | Default |
|---------|-------------|--------|
| **Output Folder** | Where your flattened code will be saved | "CodeFlattened_Output" |
| **Max File Size** | Control the maximum size of files to process | 10MB |
| **Max Output Size** | Set the maximum size before splitting output files | 5MB |
| **Prioritize Important Files** | List the most critical files first for better context | Enabled |
| **Add Code Relationship Diagrams** | Include Mermaid visualizations of code structure | Enabled |
| **Respect Flattenignore** | Enable or disable .flattenignore file support | Enabled |
| **Ultra-Compact Mode** | Apply token optimization compression | Minimal |
| **Git Change Detection** | Highlight recently modified files | Emoji Style |

## Usage

1. Open your project in VS Code
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS)
3. Type "Flatten Code" and select the command
4. Review the generated markdown file in the output folder

*Tip: You can also right-click on a folder in the Explorer and select "Flatten Code" from the context menu!*

## Perfect for AI Assistants

CodeFlattener is optimized for use with AI coding assistants like ChatGPT, Claude, and GitHub Copilot. The flattened output provides maximum context while respecting token limits, helping AI tools understand your entire project structure.

### LLM Optimization Features

- **Git Change Detection** - Guide AI focus to recently modified files with visual markers
- **Priority File Ordering** - Present the most important code first for better token efficiency
- **Relationship Visualization** - Help AI understand code structure with Mermaid diagrams
- **Smart Filtering** - Remove irrelevant files via .gitignore and .flattenignore support

The result: AI assistants that spend less time figuring out code structure and more time solving your actual coding challenges.

## Supported Languages

JavaScript, TypeScript, Python, Java, C#, C/C++, Go, Rust, SQL, Kotlin, Swift, PHP, Ruby, Markdown, Bash, PowerShell, Dart, R, HTML, CSS, XML, JSON, YML, TOML, Docker, and many more.

## Key Benefits

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
6. Open the `CodeFlattened_Output` folder (or your custom output folder) to view the generated markdown files

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
   - Change the output folder name (default: "CodeFlattened_Output")
   - Adjust maximum file size limits (default: 10MB)
   - Set output file size for splitting large codebases (default: 5MB)
   - Enable/disable prioritization of important files (default: enabled)
   - Enable/disable code relationship diagrams (default: enabled)

---

## Get Started Today

Install CodeFlattener from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener) and transform how you work with code and AI tools.

**If this extension helps your development workflow, please [leave a review](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener&ssr=false#review-details)!**

### Useful Links

- [GitHub Repository](https://github.com/GTuritto/SourceCodeFlatener_Extension)
- [Report Issues](https://github.com/GTuritto/SourceCodeFlatener_Extension/issues)
- [Rate & Review](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener&ssr=false#review-details)
- [Q&A Forum](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener&ssr=false#qna)

**Contact**: <giuseppe@turitto.net> (limited support)

**Keywords**: code flattener, source code, AI assistant, LLM optimization, ChatGPT, Claude, token optimization, code dependency, project visualization, code relationship diagram, code structure, code documentation, code review, VS Code extension, Mermaid diagrams, code compression, git integration
