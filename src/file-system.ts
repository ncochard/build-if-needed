import * as globby from "globby";
import { Configuration, Files } from "./types";

async function findFiles(filePatters: string[]): Promise<string[]> {
  return (await globby(filePatters)).sort();
}

export async function findFilesForConfig(
  config: Configuration
): Promise<Files> {
  const input = findFiles(config.input);
  const output = findFiles(config.output);
  return {
    input: await input,
    output: await output,
  };
}
