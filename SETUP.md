# Quick Setup Guide

## For Your Team (Easiest Method)

### 1. Install the Extension Locally

After I build the extension, share the `.vsix` file with your team:

```bash
# On the developer's machine (you):
cd cursor-just-runner
npm install
npm run package
# This creates just-runner-0.0.1.vsix
```

Share the `.vsix` file via:
- Slack/Teams
- Internal file share
- Git repository (in a `releases/` folder)

### 2. Team Members Install

Each team member:
1. Download the `.vsix` file
2. Open Cursor/VS Code
3. Press `Ctrl+Shift+P` (or `Cmd+Shift+P`)
4. Type "Extensions: Install from VSIX"
5. Select the downloaded `.vsix` file

Done! The extension is now installed.

### 3. Use It

- Press `Ctrl+Shift+J` (or `Cmd+Shift+J` on Mac)
- Or open Command Palette and type "Just: Run Recipe"

---

## For Development

### First Time Setup

```bash
cd cursor-just-runner
npm install
npm run compile
```

### Test the Extension

1. Open this folder in VS Code/Cursor
2. Press `F5` - this opens a new window with the extension loaded
3. In the new window, open a folder with a Justfile
4. Press `Ctrl+Shift+J` to test

### Make Changes

1. Edit `src/extension.ts`
2. The TypeScript will auto-compile if you run:
   ```bash
   npm run watch
   ```
3. Press `Ctrl+R` in the Extension Development Host window to reload

---

## Publishing to Marketplace (Optional)

If you want to publish this publicly:

### One-Time Setup

1. Create a publisher account:
   - Go to https://marketplace.visualstudio.com/manage
   - Sign in with Microsoft account
   - Create a publisher ID (e.g., "your-company")

2. Get a Personal Access Token (PAT):
   - Go to https://dev.azure.com
   - User Settings → Personal Access Tokens
   - Create token with "Marketplace (Manage)" scope
   - Save the token securely!

3. Login with vsce:
   ```bash
   npm install -g @vscode/vsce
   vsce login your-publisher-name
   # Enter your PAT when prompted
   ```

### Update and Publish

1. Update `package.json`:
   - Change `"publisher": "your-publisher-name"` to your actual publisher ID
   - Update version if needed

2. Publish:
   ```bash
   vsce publish
   ```

Or just package and share privately:
```bash
vsce package
# Share the .vsix file
```

---

## Troubleshooting

**TypeScript errors about vscode module:**
```bash
npm install
```
This installs the `@types/vscode` package.

**Extension not loading:**
- Make sure you compiled: `npm run compile`
- Check the `out/` folder exists
- Reload the window: `Ctrl+R`

**Just not found:**
- Install Just: https://github.com/casey/just#installation
- Verify with: `just --version`

**No recipes showing:**
- Make sure you have a `Justfile` in workspace root
- Check file name is exactly "Justfile" or "justfile"
