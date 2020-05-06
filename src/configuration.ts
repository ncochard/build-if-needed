import { Commands, Configuration } from "./types";
import { cosmiconfig } from "cosmiconfig";
import { error } from "./feedback";
import { projectName } from "./constants";

export async function getConfiguration(script: string): Promise<Configuration> {
  const explorerSync = cosmiconfig(projectName);
  const configResult = await explorerSync.search();
  if (!configResult || !configResult.config) {
    error(`Could not find any section "${projectName}" in the "package.json".`);
    process.exit(1);
  }
  const result = configResult.config[script];
  if (!result) {
    error(
      `The configuration section "${projectName}" in the package.json is missing the definition of the script "${script}". [${configResult.filepath}]`
    );
    process.exit(1);
  }
  const command =
    result.command === Commands.yarn ? Commands.yarn : Commands.npm;
  return {
    input: result.input || [],
    output: result.output || [],
    command,
  };
}
