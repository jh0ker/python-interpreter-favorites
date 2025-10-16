import * as vscode from "vscode";
import {
  InterpreterConfig,
  InterpreterConfigWithSource,
  ConfigurationSource,
} from "./types";

const CONFIG_SECTION = "pythonInterpreterFavorites";
const CONFIG_KEY = "interpreters";

/**
 * Gets the list of favorite interpreters from user (global) configuration
 */
export function getUserInterpreters(): InterpreterConfig[] {
  const config = vscode.workspace.getConfiguration(CONFIG_SECTION, null);
  const interpreters = config.get<InterpreterConfig[]>(CONFIG_KEY, []);
  return interpreters;
}

/**
 * Gets the list of favorite interpreters from workspace configuration
 */
export function getWorkspaceInterpreters(): InterpreterConfig[] {
  // Get workspace-level configuration (not merged with user config)
  const config = vscode.workspace.getConfiguration(CONFIG_SECTION, null);
  const workspaceConfig = config.inspect<InterpreterConfig[]>(CONFIG_KEY);

  // Return workspace-specific configuration
  return workspaceConfig?.workspaceValue || [];
}

/**
 * Merges user and workspace interpreters, with workspace interpreters taking precedence
 * and appearing first in the list
 */
export function getMergedInterpreters(): InterpreterConfigWithSource[] {
  const userInterpreters = getUserInterpreters();
  const workspaceInterpreters = getWorkspaceInterpreters();

  // Create merged list with source tracking
  const merged: InterpreterConfigWithSource[] = [
    // Workspace interpreters first
    ...workspaceInterpreters.map((interp) => ({
      ...interp,
      source: ConfigurationSource.Workspace,
    })),
    // Then user interpreters
    ...userInterpreters.map((interp) => ({
      ...interp,
      source: ConfigurationSource.User,
    })),
  ];

  // Remove duplicates based on path (workspace takes precedence)
  const uniquePaths = new Set<string>();
  const uniqueInterpreters = merged.filter((interp) => {
    if (uniquePaths.has(interp.path)) {
      return false;
    }
    uniquePaths.add(interp.path);
    return true;
  });

  return uniqueInterpreters;
}

/**
 * Substitutes variables in a path string
 * Currently supports: ${workspaceFolder}
 */
export function substituteVariables(path: string): string {
  let result = path;

  // Substitute ${workspaceFolder}
  if (
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
  ) {
    const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
    result = result.replace(/\$\{workspaceFolder\}/g, workspaceFolder);
  }

  // Substitute ${userHome} / ${env:HOME}
  const userHome = process.env.HOME || process.env.USERPROFILE;
  if (userHome) {
    result = result.replace(/\$\{userHome\}/g, userHome);
    result = result.replace(/\$\{env:HOME\}/g, userHome);
    result = result.replace(/\$\{env:USERPROFILE\}/g, userHome);
  }

  return result;
}
