import { green } from "chalk";
import { projectName } from "./constants";

const n = green(`[${projectName}]`);

export function debug(message: string): void {
  process.stdout.write(`${n} ${message}\n`);
}
export function error(message: string): void {
  process.stdout.write(`${n} ${message}\n`);
}
export function info(message: string): void {
  process.stdout.write(`${n} ${message}\n`);
}
