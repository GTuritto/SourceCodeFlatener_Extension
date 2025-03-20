# Publishing to VS Code Marketplace

This document explains how to publish the Source Code Flattener extension to the VS Code marketplace.

## Prerequisites

1. You need a Microsoft account or Azure DevOps account
2. You need to create a Personal Access Token (PAT) with the appropriate scopes
3. Install the vsce tool globally: `npm install -g @vscode/vsce`

## Steps to Publish

1. Make sure all your changes are committed to git
2. Update the version in `package.json` if needed
3. Run `vsce package` to create a VSIX file
4. Login to the marketplace: `vsce login GTuritto`
5. Publish the extension: `vsce publish`

Alternatively, you can publish directly without creating a VSIX file:

```bash
vsce publish
```

## Publishing a New Version

To publish a new version:

1. Update the version number in `package.json`
2. Add changes to `CHANGELOG.md`
3. Run `vsce publish`

## Unpublishing

If needed, you can unpublish the extension:

```bash
vsce unpublish GTuritto.source-code-flattener
```

## Marketplace Visibility

After publishing, your extension will be available at:
[https://marketplace.visualstudio.com/items?itemName=GTuritto.source-code-flattener](https://marketplace.visualstudio.com/items?itemName=GTuritto.source-code-flattener)

## Testing the Extension Locally

To test the extension before publishing:

1. Run `vsce package` to create a VSIX file
2. In VS Code, go to Extensions view
3. Click "..." at the top-right of the Extensions view
4. Select "Install from VSIX..." and choose the file you created
