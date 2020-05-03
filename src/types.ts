export enum Commands {
  npm = "npm",
  yarn = "yarn",
}
export interface CommandResult {
  success: boolean;
  exitCode: number;
}

export interface Configuration {
  input: string[];
  output: string[];
  command: Commands;
}

export interface Hashes {
  input: string;
  output: string;
}

export interface Files {
  input: string[];
  output: string[];
}

export interface SavedData {
  hashes: Hashes;
  files: Files;
}

export interface SaveOptions {
  debug: boolean;
  script: string;
}

export interface LoadOptions {
  script: string;
}

export interface CommandOptions {
  script: string;
  debug: boolean;
}
