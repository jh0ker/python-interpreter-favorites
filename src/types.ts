/**
 * Represents a favorite Python interpreter configuration
 */
export interface InterpreterConfig {
  /** Display name shown in the Quick Pick UI */
  label: string;
  /** Full path to the Python interpreter executable */
  path: string;
}

/**
 * Configuration source for tracking where interpreters came from
 */
export enum ConfigurationSource {
  User = "user",
  Workspace = "workspace",
}

/**
 * Extended interpreter config with source information
 */
export interface InterpreterConfigWithSource extends InterpreterConfig {
  source: ConfigurationSource;
}
