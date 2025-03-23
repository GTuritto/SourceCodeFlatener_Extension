# CodeFlattener Documentation

This directory contains documentation for the CodeFlattener extension.

## Contents

### Project Documentation

Documentation related to the project itself is stored in the `project` directory:

- [Contributing Guide](./project/CONTRIBUTING.md) - Guidelines for contributing to the project
- [Changelog](./project/CHANGELOG.md) - Version history and release notes

The Marketplace description is stored in `assets/marketplace/MARKETPLACE.md` as it relates to the VS Code Marketplace presentation.

## Extension Features

CodeFlattener transforms your codebase into a well-structured, comprehensive markdown document optimized for LLMs and code analysis:

1. **Consolidated Output**: Creates a single comprehensive file (split only if necessary for size)
2. **Dependency Tracking**: Automatically detects and visualizes dependencies between files
3. **Mermaid Diagrams**: Adds visual dependency graphs for clearer understanding including:
   - File Dependency Diagram
   - Class Relationship Diagram
   - Component Interaction Diagram
4. **Broad Language Support**: Works with 20+ programming languages and various file formats
5. **Syntax Highlighting**: Properly formatted code blocks for enhanced readability
6. **Customizable**: Configurable output location, file filtering, and size limits
7. **Performance Optimized**: Uses parallel processing for fast execution on large codebases
8. **LLM Optimization**: Special features for Large Language Models including:
   - .gitignore support
   - Enhanced table of contents
   - Semantic compression
   - Prioritization of important files
