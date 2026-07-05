import chalk from "chalk";
import { projectName } from "./constants.js";

const { bold, dim } = chalk;

const n = bold(`[${projectName}]`);
const f = dim(`(${process.cwd()})`);

export function debug(message: string): void {
  process.stdout.write(`${n} ${message} ${f}\n`);
}
export function error(message: string): void {
  process.stdout.write(`${n} ${message} ${f}\n`);
}
export function info(message: string): void {
  process.stdout.write(`${n} ${message} ${f}\n`);
}
