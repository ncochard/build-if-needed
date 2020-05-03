import { findFiles } from "./file-system";
import { getCommand } from "./command";
import { getConfiguration } from "./configuration";
import { getHashForFiles } from "./get-hash";
import { saveHashes } from "./hashes-cache";

export async function updateCache(): Promise<void> {
  const { script, debug } = await getCommand();
  const config = await getConfiguration(script);
  const inputFiles = findFiles(config.input);
  const outputFiles = findFiles(config.output);
  const hashes = {
    input: await getHashForFiles(await inputFiles),
    output: await getHashForFiles(await outputFiles),
  };
  const files = {
    input: await inputFiles,
    output: await outputFiles,
  };
  await saveHashes({ hashes, files }, { debug, script });
}
