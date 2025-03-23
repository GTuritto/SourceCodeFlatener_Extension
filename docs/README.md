# CodeFlattener Documentation

This directory contains documentation for the CodeFlattener extension.

## Contents

- [Development Guide](./DEVELOPMENT.md) - Information for developers contributing to the extension
- [Publishing Guide](./PUBLISHING.md) - Instructions for publishing the extension to the VS Code Marketplace

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
