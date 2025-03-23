#!/bin/bash
# Build script for the CodeFlattener extension
# This script compiles the TypeScript code, minifies it, and packages the extension for distribution

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

# Minify JavaScript files
echo "Minifying JavaScript..."
for file in out/*.js; do
  echo "  Minifying $file"
  npx terser "$file" --compress --mangle --output "$file.min"
  mv "$file.min" "$file"
done

# Remove map files as they're not needed for production
echo "Removing source maps..."
rm -f out/*.map

# Package the extension with the minified files first
echo "Packaging extension as VSIX..."
npx vsce package

# Create a temporary directory for unpacking and optimizing
echo "Creating optimized build directory..."
BUILD_TMP="build_tmp"
rm -rf "$BUILD_TMP"
mkdir -p "$BUILD_TMP"

# Unpack the VSIX package (it's just a renamed ZIP file)
echo "Unpacking VSIX for optimization..."
unzip -q code-flattener-$VERSION.vsix -d "$BUILD_TMP"

# Remove the original VSIX file
rm code-flattener-$VERSION.vsix

# Remove any unnecessary files from the unpacked extension
echo "Removing unnecessary files..."
rm -rf "$BUILD_TMP/extension/scripts" 2>/dev/null || true
rm -rf "$BUILD_TMP/extension/src" 2>/dev/null || true
rm -rf "$BUILD_TMP/extension/examples" 2>/dev/null || true
rm -rf "$BUILD_TMP/extension/test_project" 2>/dev/null || true
rm -rf "$BUILD_TMP/extension/tests" 2>/dev/null || true
rm -rf "$BUILD_TMP/extension/.github" 2>/dev/null || true
rm -f "$BUILD_TMP/extension/README copy.md" 2>/dev/null || true
rm -f "$BUILD_TMP/extension/pip.md" 2>/dev/null || true
rm -rf "$BUILD_TMP/extension/docs" 2>/dev/null || true
mkdir -p "$BUILD_TMP/extension/docs"
cp docs/CHANGELOG.md "$BUILD_TMP/extension/docs/"

# Keep only the essential node modules
echo "Optimizing node_modules..."
DEPS=("glob" "balanced-match" "brace-expansion" "fs.realpath" "inflight" "inherits" "minimatch" "once" "wrappy")
TEMP_MODULES="node_modules_temp"
mkdir -p "$TEMP_MODULES"

for dep in "${DEPS[@]}"; do
  if [ -d "$BUILD_TMP/extension/node_modules/$dep" ]; then
    mv "$BUILD_TMP/extension/node_modules/$dep" "$TEMP_MODULES/"
  fi
done

rm -rf "$BUILD_TMP/extension/node_modules"
mkdir -p "$BUILD_TMP/extension/node_modules"

for dep in "${DEPS[@]}"; do
  if [ -d "$TEMP_MODULES/$dep" ]; then
    mv "$TEMP_MODULES/$dep" "$BUILD_TMP/extension/node_modules/"
  fi
done

rm -rf "$TEMP_MODULES"

# Repack the VSIX file
echo "Repacking optimized VSIX..."
cd "$BUILD_TMP"
zip -qr ../code-flattener-$VERSION.vsix *
cd ..

# Move the VSIX to the releases folder
echo "Moving VSIX to releases folder..."
mkdir -p releases
mv code-flattener-$VERSION.vsix releases/

# Create/update the 'latest' symlink
echo "Updating 'latest' symlink..."
cd releases
ln -sf code-flattener-$VERSION.vsix code-flattener-latest.vsix
cd ..

# Clean up temp build directory
rm -rf "$BUILD_TMP"

echo "Build complete! Optimized VSIX file available at:"
echo "  releases/code-flattener-$VERSION.vsix"
echo "  releases/code-flattener-latest.vsix (symlink)"
