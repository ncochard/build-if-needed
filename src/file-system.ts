import * as globby from "globby";
export async function findFiles(filePatters: string[]): Promise<string[]> {
  return (await globby(filePatters)).sort();
}
