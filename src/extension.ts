import * as vscode from 'vscode';
import { execSync } from 'child_process';
import * as path from 'path';

interface JustRecipe {
  name: string;
  description: string;
  justfile?: string; // For recipes from .just files
}

interface QuickPickRecipe extends vscode.QuickPickItem {
  recipe: JustRecipe;
}

// Store terminal instances for reuse
const terminalMap = new Map<string, vscode.Terminal>();

export function activate(context: vscode.ExtensionContext) {
  console.log('Just Runner extension is now active');

  // Register the command
  const disposable = vscode.commands.registerCommand(
    'just-runner.pickRecipe',
    async () => {
      await pickAndRunRecipe();
    }
  );

  context.subscriptions.push(disposable);

  // Clean up terminals when they are closed
  vscode.window.onDidCloseTerminal((terminal) => {
    for (const [key, term] of terminalMap.entries()) {
      if (term === terminal) {
        terminalMap.delete(key);
        break;
      }
    }
  });
}

async function pickAndRunRecipe() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  if (!workspaceFolder) {
    vscode.window.showErrorMessage('No workspace folder open');
    return;
  }

  const cwd = workspaceFolder.uri.fsPath;

  try {
    // Check if just is installed
    execSync('just --version', { cwd, stdio: 'pipe' });
  } catch (error) {
    vscode.window.showErrorMessage(
      'Just is not installed or not in PATH. Install it from https://github.com/casey/just'
    );
    return;
  }

  const recipes = await getAllRecipes(cwd);

  if (recipes.length === 0) {
    vscode.window.showWarningMessage(
      'No recipes found. Make sure a Justfile exists in the workspace.'
    );
    return;
  }

  // Create quick pick items
  const quickPickItems: QuickPickRecipe[] = recipes.map((recipe) => {
    const fileIndicator = recipe.justfile ? ` (${recipe.justfile})` : '';
    return {
      label: recipe.name,
      description: recipe.description || '',
      detail: fileIndicator,
      recipe,
    };
  });

  // Show quick pick with fuzzy search
  const selected = await vscode.window.showQuickPick(quickPickItems, {
    placeHolder: 'Select a Just recipe to run',
    matchOnDescription: true,
    matchOnDetail: true,
  });

  if (selected) {
    await runRecipe(selected.recipe, cwd);
  }
}

async function getAllRecipes(cwd: string): Promise<JustRecipe[]> {
  const allRecipes: JustRecipe[] = [];

  // Get recipes from main Justfile
  const mainRecipes = parseJustList(cwd);
  allRecipes.push(...mainRecipes);

  // Get recipes from .just files
  try {
    const fs = require('fs');
    const files = fs.readdirSync(cwd);
    const justFiles = files.filter((file: string) => file.endsWith('.just'));

    for (const file of justFiles) {
      const justfilePath = path.join(cwd, file);
      const recipes = parseJustList(cwd, justfilePath);
      const filename = path.basename(file, '.just');

      // Add file prefix to recipe names
      recipes.forEach((recipe) => {
        recipe.name = `${filename}::${recipe.name}`;
        recipe.justfile = file;
      });

      allRecipes.push(...recipes);
    }
  } catch (error) {
    console.error('Error reading .just files:', error);
  }

  return allRecipes;
}

function parseJustList(
  cwd: string,
  justfilePath?: string
): JustRecipe[] {
  const recipes: JustRecipe[] = [];

  try {
    const justfileArg = justfilePath ? `--justfile "${justfilePath}"` : '';
    const cmd = `just ${justfileArg} --list --unsorted --list-heading '' --list-prefix '' 2>/dev/null`;

    const output = execSync(cmd, {
      cwd,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });

    // Parse each line
    const lines = output.split('\n').filter((line) => line.trim() !== '');

    for (const line of lines) {
      // Parse recipe line: "recipe-name      # Description" or just "recipe-name"
      const match = line.match(/^([\w-_]+)\s+#\s*(.+)$/);

      if (match) {
        recipes.push({
          name: match[1].trim(),
          description: match[2].trim(),
        });
      } else {
        // Try without description
        const nameMatch = line.match(/^([\w-_]+)/);
        if (nameMatch) {
          recipes.push({
            name: nameMatch[1].trim(),
            description: '',
          });
        }
      }
    }
  } catch (error) {
    console.error('Error parsing just list:', error);
  }

  return recipes;
}

async function runRecipe(recipe: JustRecipe, cwd: string) {
  // Parse recipe name if it's from a .just file
  let justCmd = 'just';
  let recipeName = recipe.name;
  let terminalName = `just-${recipe.name}`;

  if (recipe.name.includes('::')) {
    const [filename, name] = recipe.name.split('::');
    justCmd = `just --justfile ${filename}.just`;
    recipeName = name;
    terminalName = `just-${filename}-${name}`;
  }

  // Check if terminal already exists
  let terminal = terminalMap.get(terminalName);

  if (terminal) {
    // Reuse existing terminal
    terminal.show();
    // Send Ctrl+C to interrupt any running command, then run the new command
    terminal.sendText('\x03'); // Ctrl+C
    setTimeout(() => {
      terminal!.sendText(`clear && ${justCmd} ${recipeName}`);
    }, 100);

    vscode.window.showInformationMessage(
      `Reusing terminal '${terminalName}'`
    );
  } else {
    // Create new terminal
    terminal = vscode.window.createTerminal({
      name: terminalName,
      cwd,
    });

    terminalMap.set(terminalName, terminal);
    terminal.show();

    // Run the command
    terminal.sendText(`${justCmd} ${recipeName}`);

    vscode.window.showInformationMessage(
      `Created new terminal '${terminalName}'`
    );
  }
}

export function deactivate() {
  // Clean up terminals
  terminalMap.clear();
}
