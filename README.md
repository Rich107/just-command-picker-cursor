# Just Runner

A VS Code/Cursor extension that provides a fuzzy-searchable quick picker for running [Just](https://github.com/casey/just) recipes with persistent terminal support.


https://github.com/user-attachments/assets/a14ed76a-2ee7-433d-a5bc-b0b03e77c807




## Features

- 🔍 **Fuzzy search** through all available Just recipes
- 📁 **Multi-file support** - automatically discovers recipes from both `Justfile` and `*.just` files
- 🔄 **Persistent terminals** - reuses terminal windows for each recipe
- ⌨️ **Keyboard shortcut** - `Ctrl+Shift+J` (or `Cmd+Shift+J` on Mac)
- 📝 **Recipe descriptions** - displays descriptions from Just recipe comments

## Requirements

- [Just](https://github.com/casey/just) must be installed and available in your PATH
- A `Justfile` in your workspace root

## Usage

1. Open the command palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "Just: Run Recipe" or use the keyboard shortcut `Ctrl+Shift+J` / `Cmd+Shift+J`
3. Select a recipe from the fuzzy-searchable list
4. The recipe runs in a persistent terminal that can be reused

When you run the same recipe again, it will reuse the existing terminal window instead of creating a new one.

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- VS Code or Cursor

### Install:
1. Download the .vsix file for the extension
2. Open the Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
3. Type "Install from VSIX" and select it
4. Browse to and select the .vsix file

### Local Development Steps

1. **Clone and setup:**
   ```bash
   cd cursor-just-runner
   npm install
   ```

2. **Compile TypeScript:**
   ```bash
   npm run compile
   ```
   
   Or watch for changes:
   ```bash
   npm run watch
   ```

3. **Test the extension locally:**
   - Open the `cursor-just-runner` folder in VS Code/Cursor
   - Press `F5` to open a new Extension Development Host window
   - In the new window, open a folder with a Justfile
   - Press `Ctrl+Shift+J` or run the command "Just: Run Recipe"

4. **Debug:**
   - Set breakpoints in `src/extension.ts`
   - Press `F5` to start debugging
   - The extension will reload when you make changes (if using watch mode)

### Project Structure

```
cursor-just-runner/
├── src/
│   └── extension.ts      # Main extension code
├── out/                  # Compiled JavaScript (generated)
├── package.json          # Extension manifest
├── tsconfig.json         # TypeScript config
└── README.md            # This file
```

## Publishing the Extension

### Option 1: Publish to VS Code Marketplace (Official)

1. **Create a publisher account:**
   - Go to https://marketplace.visualstudio.com/manage
   - Sign in with your Microsoft account
   - Create a new publisher

2. **Update package.json:**
   - Change `"publisher": "your-publisher-name"` to your actual publisher ID
   - Update version, description, author, etc.

3. **Install vsce (VS Code Extension Manager):**
   ```bash
   npm install -g @vscode/vsce
   ```

4. **Package the extension:**
   ```bash
   npm run package
   ```
   This creates a `.vsix` file.

5. **Publish:**
   ```bash
   vsce publish
   ```
   
   Or login first:
   ```bash
   vsce login <your-publisher-name>
   vsce publish
   ```

### Option 2: Install Locally (Team Distribution)

1. **Package the extension:**
   ```bash
   npm run package
   ```

2. **Share the `.vsix` file** with your team

3. **Team members install it:**
   - Open VS Code/Cursor
   - Go to Extensions view (`Ctrl+Shift+X`)
   - Click the "..." menu at the top
   - Select "Install from VSIX..."
   - Choose the `.vsix` file

### Option 3: Private Registry (Enterprise)

For enterprise teams, you can host a private extension registry:

1. **Set up a private marketplace** using:
   - Azure DevOps (has built-in private marketplace)
   - GitHub Packages
   - Your own server

2. **Configure VS Code to use private registry:**
   ```json
   // settings.json
   {
     "extensions.gallery": {
       "serviceUrl": "https://your-private-registry.com"
     }
   }
   ```

### Publishing Best Practices

1. **Versioning:** Follow semantic versioning (MAJOR.MINOR.PATCH)
   ```bash
   vsce publish major  # 1.0.0 -> 2.0.0
   vsce publish minor  # 1.0.0 -> 1.1.0
   vsce publish patch  # 1.0.0 -> 1.0.1
   ```

2. **Add an icon:** Create a 128x128 PNG icon
   ```json
   // package.json
   {
     "icon": "icon.png"
   }
   ```

3. **Add a repository link:**
   ```json
   {
     "repository": {
       "type": "git",
       "url": "https://github.com/your-org/just-runner"
     }
   }
   ```

4. **Test before publishing:**
   - Install the `.vsix` locally
   - Test all features
   - Check on different OS (Windows, Mac, Linux)

## Configuration

Currently, the extension works out of the box with no configuration needed. Future versions may add:

- Custom keybindings
- Terminal behavior options
- Just executable path

## Troubleshooting

**"Just is not installed or not in PATH"**
- Install Just: https://github.com/casey/just#installation
- Make sure `just --version` works in your terminal

**"No recipes found"**
- Make sure you have a `Justfile` in your workspace root
- Check that the file is named correctly (case-sensitive on Linux/Mac)

**Terminal not reusing**
- Close existing terminals manually and try again
- Restart VS Code/Cursor

## License

MIT

## Credits

Inspired by the Neovim Telescope Just picker implementation.
# just-command-picker-cursor
