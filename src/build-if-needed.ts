import { getHashForFiles, hashAlgorithm } from "./get-hash";
import { executeCommand } from "./execute-task";
import { findFiles } from "./file-system";
import { getCommand } from "./command";
import { getConfiguration } from "./configuration";
import { loadHashes } from "./hashes-cache";
import { projectName } from "./constants";
import { same } from "./utility";
import { updateCache } from "./after-task";

async function main(): Promise<void> {
  const { script, debug } = await getCommand();
  const config = await getConfiguration(script);
  const inputFiles = findFiles(config.input);
  const outputFiles = findFiles(config.output);
  const input = getHashForFiles(await inputFiles);
  const output = getHashForFiles(await outputFiles);
  const newHashes = { input: await input, output: await output };
  const lastHashes = await loadHashes({ script });
  if (same(newHashes, lastHashes)) {
    console.info(
      `${projectName}: Skipped: \"${config.command} run ${script}\"! The ${hashAlgorithm} hash stored by \"build-if-needed\" indicates that nothing needs to be built.`
    );
  } else {
    console.info(
      `${projectName}: Executing \"${config.command} run ${script}\"`
    );
    const { success, exitCode } = await executeCommand(config, {
      script,
      debug,
    });
    if (success) {
      await updateCache();
    } else {
      process.exit(exitCode);
    }
  }
}

(async (): Promise<void> => {
  await main();
})();