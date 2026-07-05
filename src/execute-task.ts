import { CommandOptions, CommandResult, Configuration } from "./types.js";
import { debug, error, info } from "./feedback.js";
import { execa } from "execa";

const SIGTERM = "SIGTERM";

export async function executeCommand(
  config: Configuration,
  command: CommandOptions,
): Promise<CommandResult> {
  const cmd = `${config.command} run ${command.script}`;
  info(`Executing "${cmd}"`);
  const subprocess = execa(config.command, ["run", command.script], {
    forceKillAfterDelay: 2000,
  });
  if (!subprocess) {
    error(`Could not start "${cmd}"`);
    return { success: false };
  }
  subprocess.stdout?.pipe(process.stdout);
  subprocess.stderr?.pipe(process.stderr);
  const kill = (): void => {
    debug(`Killed command ${SIGTERM}: "${cmd}"`);
    subprocess.kill(SIGTERM);
  };
  process.on(SIGTERM, kill);
  try {
    const result = await subprocess;
    info(`Completed successfully: "${cmd}"`);
    return { success: true, exitCode: result.exitCode };
  } catch (e) {
    const err = e as { code?: string; exitCode?: number };
    if (err.code) {
      error(`Terminated with error ${err.code}: "${cmd}"`);
      return { success: false };
    } else {
      error(`Terminated with error: "${cmd}"`);
      return { success: false, exitCode: err.exitCode };
    }
  } finally {
    process.off(SIGTERM, kill);
  }
}
