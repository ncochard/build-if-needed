import { CommandOptions } from "./types";
import { program } from "commander";
import { projectName } from "./constants";

export async function getCommand(): Promise<CommandOptions> {
  await Promise.resolve();
  program.requiredOption(
    "-n, --script <script>",
    "name of the script configuration"
  );
  program.option("-d, --debug", "outputs debugging information");
  program.parse(process.argv);
  const script = `${program.script}`;
  const debug: boolean = program.debug === true;
  if (!script) {
    console.error(`${projectName} Missing --script parameter`);
  }
  return { script, debug };
}
