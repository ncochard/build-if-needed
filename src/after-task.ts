import { CommandOptions } from "./types.js";
import { findFilesForConfig } from "./file-system.js";
import { getConfiguration } from "./configuration.js";
import { getHashForConfig } from "./get-hash.js";
import { saveHashes } from "./hashes-cache.js";

export async function updateCache(command: CommandOptions): Promise<void> {
  const { script, debug } = command;
  const config = await getConfiguration(script);
  const files = findFilesForConfig(config);
  const hashes = getHashForConfig(await files, { debug });
  await saveHashes(
    { hashes: await hashes, files: await files },
    { debug, script },
  );
}
