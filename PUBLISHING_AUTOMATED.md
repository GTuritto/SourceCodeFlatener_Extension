# Automated Publishing to VS Code Marketplace

This document explains how to set up and use the automated publishing process for the Source Code Flattener extension.

## Prerequisites

1. **Visual Studio Marketplace Publisher**: You need to be registered as a publisher on the [VS Code Marketplace](https://marketplace.visualstudio.com/vscode).

2. **Personal Access Token (PAT)**: You need a PAT with publishing rights.

## Getting a Personal Access Token (PAT)

1. Go to [Azure DevOps Personal Access Tokens](https://dev.azure.com/your-organization/_usersSettings/tokens)
2. Click on "New Token"
3. Name your token (e.g., "VSCE Publishing")
4. Select "Custom defined" for Scopes
5. Check "Marketplace > Manage"
6. Set the expiration as needed
7. Click "Create"
8. **Save the token securely** - you won't be able to see it again!

## Setting Up GitHub Actions

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Name: `VSCE_PAT`
5. Value: The Personal Access Token you created
6. Click "Add secret"

## Automated Publishing

With the setup complete, you have two ways to publish:

### 1. Creating a GitHub Release

When you create a new release on GitHub:

1. Go to your repository on GitHub
2. Click on "Releases" > "Create a new release"
3. Create a tag matching your version (e.g., "v1.5.0")
4. Add release notes
5. Click "Publish release"

The GitHub Actions workflow will automatically:
- Build the extension
- Publish it to the marketplace
- Update the releases folder and symlinks

### 2. Manual Trigger

You can also manually trigger the workflow:

1. Go to your repository on GitHub
2. Click on "Actions" > "Publish Extension"
3. Click "Run workflow" > "Run workflow"

## Publishing Locally

If you prefer to publish manually from your local machine:

```bash
# Set your PAT as an environment variable
export VSCE_PAT=your_token_here

# Run the publish script
./scripts/publish.sh
```

## Troubleshooting

- **Authentication Failures**: Ensure your PAT is correct and hasn't expired
- **Version Conflicts**: Make sure you've updated the version in package.json
- **Workflow Failures**: Check the GitHub Actions logs for details
