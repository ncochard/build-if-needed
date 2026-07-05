import { Configuration, Files } from "./types.js";
import { globby } from "globby";

async function findFiles(filePatters: string[]): Promise<string[]> {
  return (await globby(filePatters)).sort();
}

export async function findFilesForConfig(
  config: Configuration,
): Promise<Files> {
  const input = findFiles(config.input);
  const output = findFiles(config.output);
  return {
    input: await input,
    output: await output,
  };
}
