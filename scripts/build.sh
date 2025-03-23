#!/bin/bash
# Build script for the CodeFlattener extension
# This script compiles the TypeScript code and packages the extension for distribution

# Ensure we're in the project root
cd "$(dirname "$0")/.." || exit 1

# Get the version from package.json
VERSION=$(node -p "require('./package.json').version")
echo "Building CodeFlattener v$VERSION..."

# Clean previous build artifacts
echo "Cleaning previous build..."
rm -rf out/

# Compile TypeScript
echo "Compiling TypeScript..."
npm run compile

# Package the extension
echo "Packaging extension as VSIX..."
npx vsce package

# Move the VSIX to the releases folder
echo "Moving VSIX to releases folder..."
mkdir -p releases
mv code-flattener-$VERSION.vsix releases/

# Create/update the 'latest' symlink
echo "Updating 'latest' symlink..."
cd releases
ln -sf code-flattener-$VERSION.vsix code-flattener-latest.vsix
cd ..

echo "Build complete! VSIX file available at:"
echo "  releases/code-flattener-$VERSION.vsix"
echo "  releases/code-flattener-latest.vsix (symlink)"
