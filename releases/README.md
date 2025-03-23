# CodeFlattener Extension Releases

This directory contains the packaged VSIX files for the CodeFlattener extension.

## Latest Release

The `code-flattener-latest.vsix` symlink always points to the most recent release version.

## Installation

You can install the extension directly from these VSIX files in:

- VS Code: `code --install-extension code-flattener-X.X.X.vsix`
- Cursor: `cursor --install-extension code-flattener-X.X.X.vsix`
- Windsurf: `windsurf --install-extension code-flattener-X.X.X.vsix`

Or by opening the VSIX file with any of these applications.

## Version History

- **v1.5.5** - Updated extension name to "CodeFlattener" and improved VS Code compatibility (v1.86.0+)
- **v1.5.4** - Added LLM optimization features including .gitignore support and enhanced file exclusion patterns
- **v1.5.3** - Added comprehensive code relationship visualization with Mermaid diagrams

## Building New Releases

To build a new release, run the build script from the project root:

```bash
./scripts/build.sh
```

This will compile the extension and place the VSIX file in this directory.
