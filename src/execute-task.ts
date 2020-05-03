import * as execa from "execa";
import { CommandOptions, CommandResult, Configuration } from "./types";
import { projectName } from "./constants";

export async function executeCommand(
  config: Configuration,
  command: CommandOptions
): Promise<CommandResult> {
  const subprocess = execa(config.command, ["run", command.script]);
  if (!subprocess) {
    console.error(
      `${projectName}: Could not start the process "${config.command} run ${command.script}"`
    );
  }
  if (subprocess.stdout) {
    subprocess.stdout.pipe(process.stdout);
  }
  if (subprocess.stderr) {
    subprocess.stderr.pipe(process.stderr);
  }
  const kill = (): void => {
    subprocess.kill("SIGTERM", {
      forceKillAfterTimeout: 2000,
    });
  };
  process.on("SIGTERM", kill);
  try {
    const result = await subprocess;
    console.info(
      `${projectName}: Command terminated successfully with code ${result.exitCode}: "${config.command} run ${command.script}"`
    );
    return { success: true, exitCode: result.exitCode };
  } catch (e) {
    console.error(
      `${projectName}: Command terminated with error code ${e.code}: "${config.command} run ${command.script}"`
    );
    return { success: false, exitCode: e.code };
  } finally {
    process.off("SIGTERM", kill);
  }
}
