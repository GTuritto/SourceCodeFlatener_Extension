#!/bin/bash

# Script to update version numbers across all project files based on VERSION file

# Path to the VERSION file
VERSION_FILE="$(dirname "$0")/../VERSION"

# Check if VERSION file exists
if [ ! -f "$VERSION_FILE" ]; then
    echo "Error: VERSION file not found at $VERSION_FILE"
    echo "Please create a VERSION file in the root directory with the current version number."
    exit 1
fi

# Read version from VERSION file
NEW_VERSION=$(cat "$VERSION_FILE" | tr -d '\r\n')

# Validate version format
if ! [[ $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Invalid version format in VERSION file. Expected format: X.Y.Z"
    echo "Current content: $NEW_VERSION"
    exit 1
fi

echo "Using version $NEW_VERSION from VERSION file"

# Update package.json using jq if available, otherwise with sed
if command -v jq &> /dev/null; then
    jq ".version = \"$NEW_VERSION\"" package.json > package.json.tmp && mv package.json.tmp package.json
else
    sed -i "" "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"$NEW_VERSION\"/" package.json
fi

# Update version in README.md
sed -i "" "s/version-[0-9]*\.[0-9]*\.[0-9]*-blue/version-$NEW_VERSION-blue/g" README.md
sed -i "" "s/code-flattener-[0-9]*\.[0-9]*\.[0-9]*\.vsix/code-flattener-$NEW_VERSION.vsix/g" README.md
sed -i "" "s/(v[0-9]*\.[0-9]*\.[0-9]*)/(v$NEW_VERSION)/g" README.md

# Add entry for new version in CHANGELOG.md if it doesn't exist already
if ! grep -q "## \[$NEW_VERSION\]" CHANGELOG.md; then
    CURRENT_DATE=$(date +"%Y-%m-%d")
    sed -i "" "/All notable changes/a\\n## [$NEW_VERSION] - $CURRENT_DATE\n\n### Changes\n\n- Version update\n" CHANGELOG.md
fi
# The existing CHANGELOG.md update is sufficient

echo "Version updated to $NEW_VERSION in all files."
echo ""
echo "Next steps:"
echo "1. Build the extension: ./scripts/build.sh"
echo "2. Create a Git tag: git tag -a v$NEW_VERSION -m 'Version $NEW_VERSION'"
echo "3. Push changes: git push && git push --tags"
echo ""
echo "The build script will automatically place the VSIX file in the releases/ folder."
echo "The packaged extension will be available at: releases/code-flattener-$NEW_VERSION.vsix"

echo ""
echo "NOTE: To update the version, edit the VERSION file in the root directory and run this script again."
