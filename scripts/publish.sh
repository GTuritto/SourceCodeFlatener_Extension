#!/bin/bash
# Script to publish the extension to VS Code Marketplace

# Check if the Personal Access Token is provided
if [ -z "$VSCE_PAT" ]; then
  echo "Error: VSCE_PAT environment variable is not set."
  echo "You need to set your Personal Access Token to publish to the marketplace."
  echo "Example: VSCE_PAT=your_token_here ./scripts/publish.sh"
  exit 1
fi

# Ensure vsce is installed
if ! command -v vsce &> /dev/null; then
  echo "Installing vsce..."
  npm install -g @vscode/vsce
fi

# Get the version from package.json
VERSION=$(node -p "require('./package.json').version")
echo "Publishing version $VERSION to VS Code Marketplace..."

# Run vsce publish
vsce publish -p $VSCE_PAT

# If successful, update the symlink in the releases folder
if [ $? -eq 0 ]; then
  echo "Publishing successful!"
  
  # Make sure the VSIX exists in the releases folder
  if [ ! -f "releases/source-code-flattener-$VERSION.vsix" ]; then
    echo "Moving VSIX to releases folder..."
    mkdir -p releases
    mv source-code-flattener-$VERSION.vsix releases/
  fi
  
  # Update the symlink
  echo "Updating latest symlink..."
  cd releases
  ln -sf source-code-flattener-$VERSION.vsix source-code-flattener-latest.vsix
  cd ..
  
  echo "Done! Version $VERSION is now published and available as the latest version."
else
  echo "Publishing failed. Please check the error messages above."
  exit 1
fi
