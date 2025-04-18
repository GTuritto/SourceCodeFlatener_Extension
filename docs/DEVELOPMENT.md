# CodeFlattener - Development Guide

This document provides information for developers who want to contribute to or maintain the CodeFlattener extension.

## Versioning System

This project uses a centralized versioning system to maintain consistent version numbers across all files:

- The current version is stored in the `VERSION` file at the root of the project (single source of truth)
- An automated script (`scripts/update_version.sh`) synchronizes this version across all files

To update the version:

1. Edit the `VERSION` file in the root directory with the new version number (format: X.Y.Z)
2. Run the update script to synchronize all files:

```bash
./scripts/update_version.sh
```

The script will automatically update:

- package.json
- README.md
- DOWNLOAD.md

After running the script, you should:

1. Edit the CHANGELOG.md to document your changes
2. Run `npx vsce package` to build the new package

## Building the Extension

To build the extension:

1. Make sure you have Node.js installed
2. Install dependencies:

   ```bash
   npm install
   ```

3. Compile the TypeScript code:

   ```bash
   npm run compile
   ```

4. Package the extension:

   ```bash
   npx vsce package
   ```


This will generate a .vsix file that can be installed in VS Code.

## Testing

To run tests:

```bash
npm test
```

## Publishing

To publish the extension to the VS Code Marketplace:

1. Update the version number using the versioning script
2. Update the changelog
3. Package the extension
4. Use the publish script (requires a personal access token):

   ```bash
   VSCE_PAT=your_token_here ./scripts/publish.sh
   ```

## Feedback Collection

User feedback is collected through [Canny](https://codeflattener.canny.io/). Feature requests and bug reports are managed through this platform.

## Contact

For development-related questions, you may contact [giuseppe@turitto.net](mailto:giuseppe@turitto.net) (limited support).
