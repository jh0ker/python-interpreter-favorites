import * as vscode from "vscode";
import { selectInterpreter } from "./interpreterManager";

/**
 * Called when the extension is activated
 */
export function activate(context: vscode.ExtensionContext) {
  console.log("Python Interpreter Favorites extension is now active");

  // Register the command to select a favorite interpreter
  const selectInterpreterCommand = vscode.commands.registerCommand(
    "pythonInterpreterFavorites.selectInterpreter",
    async () => {
      try {
        await selectInterpreter();
      } catch (error) {
        vscode.window.showErrorMessage(`Error selecting interpreter: ${error}`);
        console.error("Error in selectInterpreter:", error);
      }
    }
  );

  context.subscriptions.push(selectInterpreterCommand);
}

/**
 * Called when the extension is deactivated
 */
export function deactivate() {}
