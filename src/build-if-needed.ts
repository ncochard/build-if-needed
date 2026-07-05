import { error, info } from "./feedback.js";
import { getHashForConfig, hashAlgorithm } from "./get-hash.js";
import { executeCommand } from "./execute-task.js";
import { findFilesForConfig } from "./file-system.js";
import { getCommand } from "./command.js";
import { getConfiguration } from "./configuration.js";
import { loadHashes } from "./hashes-cache.js";
import { same } from "./utility.js";
import { updateCache } from "./after-task.js";

async function main(): Promise<void> {
  const { script, debug } = await getCommand();
  const config = await getConfiguration(script);
  const files = findFilesForConfig(config);
  const newHashes = await getHashForConfig(await files, { debug });
  const lastHashes = await loadHashes({ script });
  const cmd = `${config.command} run ${script}`;
  if (same(newHashes, lastHashes)) {
    info(
      `The stored ${hashAlgorithm} indicates that "${cmd}" doesn't need to be executed.`,
    );
  } else {
    const { success, exitCode } = await executeCommand(config, {
      script,
      debug,
    });
    if (success) {
      await updateCache({ script, debug });
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
    error(e instanceof Error ? e.message : String(e));
    process.exit(1);
  }
})();
