import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { getMergedInterpreters, substituteVariables } from "./config";
import { InterpreterConfigWithSource, ConfigurationSource } from "./types";

/**
 * Shows a Quick Pick UI to select a favorite Python interpreter
 * and sets it as the active interpreter for the workspace
 */
export async function selectInterpreter(): Promise<void> {
  // Get merged list of interpreters
  const interpreters = getMergedInterpreters();

  if (interpreters.length === 0) {
    const action = await vscode.window.showInformationMessage(
      "No favorite Python interpreters configured. Would you like to open settings?",
      "Open Settings"
    );

    if (action === "Open Settings") {
      await vscode.commands.executeCommand(
        "workbench.action.openSettings",
        "pythonInterpreterFavorites.interpreters"
      );
    }
    return;
  }

  // Create Quick Pick items
  const items: vscode.QuickPickItem[] = interpreters.map((interp) => {
    const resolvedPath = substituteVariables(interp.path);
    const exists = fs.existsSync(resolvedPath);
    const sourceLabel =
      interp.source === ConfigurationSource.Workspace
        ? "(workspace)"
        : "(user)";

    return {
      label: interp.label,
      description: resolvedPath,
      detail: exists ? sourceLabel : `${sourceLabel} ⚠️ Path not found`,
      // Store the original path in the item for later use
      path: interp.path,
    } as vscode.QuickPickItem & { path: string };
  });

  // Show Quick Pick
  const selected = (await vscode.window.showQuickPick(items, {
    placeHolder: "Select a Python interpreter",
    matchOnDescription: true,
  })) as (vscode.QuickPickItem & { path: string }) | undefined;

  if (!selected) {
    return; // User cancelled
  }

  // Set the selected interpreter
  await setInterpreter(selected.path);
}

/**
 * Sets the Python interpreter for the current workspace
 */
async function setInterpreter(interpreterPath: string): Promise<void> {
  const resolvedPath = substituteVariables(interpreterPath);

  // Validate the path exists
  if (!fs.existsSync(resolvedPath)) {
    const action = await vscode.window.showWarningMessage(
      `The interpreter path does not exist: ${resolvedPath}`,
      "Set Anyway",
      "Cancel"
    );

    if (action !== "Set Anyway") {
      return;
    }
  }

  try {
    // Get the Python extension API
    const pythonExtension = vscode.extensions.getExtension("ms-python.python");

    if (!pythonExtension) {
      vscode.window.showErrorMessage(
        "Python extension is not installed. Please install it to use this feature."
      );
      return;
    }

    // Ensure the Python extension is activated
    if (!pythonExtension.isActive) {
      await pythonExtension.activate();
    }

    // Update the default interpreter path setting
    await vscode.workspace
      .getConfiguration("python")
      .update(
        "defaultInterpreterPath",
        resolvedPath,
        vscode.ConfigurationTarget.Workspace
      );

    // Use the Python extension's API to set the interpreter
    // The API provides an `environments` namespace with methods to update the interpreter
    const pythonApi = pythonExtension.exports;

    if (pythonApi && pythonApi.environments) {
      // Try to use the official API if available
      try {
        await pythonApi.environments.updateActiveEnvironmentPath(resolvedPath);
      } catch (apiError) {
        console.warn("Failed to use Python API directly:", apiError);
      }
    }

    // Additionally trigger the "python.triggerEnvSelection" command which
    // forces the Python extension to refresh its interpreter without showing UI
    try {
      await vscode.commands.executeCommand("python.triggerEnvSelection");
    } catch (cmdError) {
      // Command might not exist in all versions, that's okay
      console.warn("python.triggerEnvSelection not available:", cmdError);
    }

    vscode.window.showInformationMessage(
      `Python interpreter set to: ${resolvedPath}`
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to set Python interpreter: ${error}`
    );
  }
}
