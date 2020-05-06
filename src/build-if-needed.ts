import { error, info } from "./feedback";
import { getHashForConfig, hashAlgorithm } from "./get-hash";
import { executeCommand } from "./execute-task";
import { findFilesForConfig } from "./file-system";
import { getCommand } from "./command";
import { getConfiguration } from "./configuration";
import { loadHashes } from "./hashes-cache";
import { same } from "./utility";
import { updateCache } from "./after-task";

async function main(): Promise<void> {
  const { script, debug } = await getCommand();
  const config = await getConfiguration(script);
  const files = findFilesForConfig(config);
  const newHashes = await getHashForConfig(await files, { debug });
  const lastHashes = await loadHashes({ script });
  const cmd = `${config.command} run ${script}`;
  if (same(newHashes, lastHashes)) {
    info(
      `The stored ${hashAlgorithm} indicates that "${cmd}" doesn't need to be executed.`
    );
  } else {
    const { success, exitCode } = await executeCommand(config, {
      script,
      debug,
    });
    if (success) {
      await updateCache();
    } else {
      process.exit(exitCode || 1);
    }
  }
}

(async (): Promise<void> => {
  try {
    await main();
  } catch (e) {
    error("Something went wrong!");
    error(e);
    process.exit(1);
  }
})();
