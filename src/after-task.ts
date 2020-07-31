import { CommandOptions } from "./types";
import { findFilesForConfig } from "./file-system";
import { getConfiguration } from "./configuration";
import { getHashForConfig } from "./get-hash";
import { saveHashes } from "./hashes-cache";

export async function updateCache(command: CommandOptions): Promise<void> {
  const { script, debug } = command;
  const config = await getConfiguration(script);
  const files = findFilesForConfig(config);
  const hashes = getHashForConfig(await files, { debug });
  await saveHashes(
    { hashes: await hashes, files: await files },
    { debug, script }
  );
}
