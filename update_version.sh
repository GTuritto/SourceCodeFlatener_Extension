#!/bin/bash

# Script to update version numbers across all project files

# Check if a new version was provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 NEW_VERSION"
    echo "Example: $0 1.2.0"
    exit 1
fi

# Store the new version
NEW_VERSION=$1

# Update the VERSION file
echo $NEW_VERSION > VERSION

# Update package.json using jq if available, otherwise with sed
if command -v jq &> /dev/null; then
    jq ".version = \"$NEW_VERSION\"" package.json > package.json.tmp && mv package.json.tmp package.json
else
    sed -i "" "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"$NEW_VERSION\"/" package.json
fi

# Update version in README.md
sed -i "" "s/version-[0-9]*\.[0-9]*\.[0-9]*-blue/version-$NEW_VERSION-blue/g" README.md
sed -i "" "s/source-code-flattener-[0-9]*\.[0-9]*\.[0-9]*\.vsix/source-code-flattener-$NEW_VERSION.vsix/g" README.md

# Update version in DOWNLOAD.md
sed -i "" "s/(v[0-9]*\.[0-9]*\.[0-9]*)/(v$NEW_VERSION)/g" DOWNLOAD.md
sed -i "" "s/source-code-flattener-[0-9]*\.[0-9]*\.[0-9]*\.vsix/source-code-flattener-$NEW_VERSION.vsix/g" DOWNLOAD.md
sed -i "" "s/What's Included in v[0-9]*\.[0-9]*\.[0-9]*/What's Included in v$NEW_VERSION/g" DOWNLOAD.md

# Update version in CHANGELOG.md
# Add a new version header to the CHANGELOG.md
TODAY=$(date +%Y-%m-%d)
sed -i "" "4i\\
\\
## [$NEW_VERSION] - $TODAY\\
\\
### New Features\\
\\
- Add new features here\\
\\
### Improvements\\
\\
- Add improvements here\\
\\
" CHANGELOG.md

echo "Version updated to $NEW_VERSION in all files."
echo "Don't forget to build the new package with 'npx vsce package'"
echo "And create a new Git tag with 'git tag -a v$NEW_VERSION -m \"Version $NEW_VERSION\"'"
