# Contributing to CodeFlattener

Thank you for your interest in contributing to CodeFlattener! This document provides guidelines and instructions for contributors.

## Getting Started

1. **Fork the repository**: Start by forking the [CodeFlattener repository](https://github.com/GTuritto/CodeFlattener)
2. **Clone your fork**: `git clone https://github.com/YOUR-USERNAME/CodeFlattener.git`
3. **Install dependencies**: `cd CodeFlattener && npm install`

## Development Workflow

### Setting Up Development Environment

1. Open the project in VS Code
2. Run `npm install` to install dependencies
3. Make your changes to the codebase

### Building and Testing

1. Build the extension: `npm run compile` (or use the `scripts/build.sh` script)
2. Test your changes locally by pressing F5 in VS Code to launch the Extension Development Host
3. Run the "Flatten Code" command on a test project to verify functionality

## Project Structure

```bash
CodeFlattener/
├── assets/            - Static assets for the extension
│   ├── images/         - Extension images and icons
│   └── marketplace/    - VS Code marketplace assets
│       └── MARKETPLACE.md - VS Code marketplace description
├── docs/              - Documentation files
│   └── project/       - Project documentation
│       ├── CHANGELOG.md   - Version history
│       └── CONTRIBUTING.md - This file
├── examples/          - Example projects for testing
│   ├── output/        - Sample output files
│   └── simple_project/ - Simple test project
├── releases/          - VSIX release files
├── scripts/           - Build and utility scripts
├── src/               - Source code files
│   ├── codeFlattener.ts - Main flattening logic
│   └── extension.ts   - VS Code extension entry point
├── tests/             - Test files
├── .gitignore         - Git ignore configuration
├── LICENSE            - MIT License
├── README.md          - Main documentation
├── package.json       - Extension metadata
└── tsconfig.json      - TypeScript configuration
```

## Pull Request Process

1. **Branch naming**: Use descriptive names that reflect the change (e.g., `feature/add-language-support`, `fix/dependency-detection-bug`)
2. **Keep changes focused**: Each PR should address a single concern
3. **Write descriptive commit messages**: Explain what the change does and why
4. **Test thoroughly**: Ensure your changes work as expected
5. **Update documentation**: Make sure README, inline comments, and docs are up-to-date
6. **Submit a pull request**: Provide a clear description of the changes

## Code Style Guidelines

- Follow existing TypeScript coding conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Maintain the existing project structure
- Write unit tests for new functionality

## Language Support

When adding support for new languages:
1. Update the `supportedExtensions` array in `codeFlattener.ts`
2. Add regex patterns to detect dependencies in the new language
3. Update the `getHighlightLanguage` method to map file extensions to syntax highlighting language
4. Document the new language support in README.md
5. Add a test case in the examples directory

## Feature Requests and Bug Reports

- Use the [GitHub issue tracker](https://github.com/GTuritto/CodeFlattener/issues) to report bugs or request features
- Provide as much detail as possible, including steps to reproduce issues
- For bugs, include error messages, VS Code version, and operating system information

## License

By contributing to CodeFlattener, you agree that your contributions will be licensed under the project's [MIT License](../../../LICENSE).

---

Thank you for contributing to make CodeFlattener better for everyone!
