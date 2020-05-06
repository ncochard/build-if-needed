import { findFilesForConfig } from "./file-system";
import { getCommand } from "./command";
import { getConfiguration } from "./configuration";
import { getHashForConfig } from "./get-hash";
import { saveHashes } from "./hashes-cache";

export async function updateCache(): Promise<void> {
  const { script, debug } = await getCommand();
  const config = await getConfiguration(script);
  const files = findFilesForConfig(config);
  const hashes = getHashForConfig(await files, { debug });
  await saveHashes(
    { hashes: await hashes, files: await files },
    { debug, script }
  );
}
