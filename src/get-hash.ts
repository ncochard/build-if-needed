import * as crypto from "crypto";
import * as fs from "fs";
import { DebugOptions, Files, Hashes } from "./types.js";
import { info } from "./feedback.js";
import throatFactoryRaw from "throat";

export const hashAlgorithm = "md5";

// throat's type declarations don't resolve correctly under "nodenext" module
// resolution (its .d.ts uses ESM "export default" syntax for a CJS module);
// the runtime export is unaffected, so a cast is needed here.
const throatFactory = throatFactoryRaw as unknown as (
  size: number,
) => <T>(fn: () => Promise<T>) => Promise<T>;

const MAX_NUMBER_OF_FILES_CONCURENTLY_OPENED = 50;
const throat = throatFactory(MAX_NUMBER_OF_FILES_CONCURENTLY_OPENED);

function getHashForFile(fileName: string): Promise<string> {
  return new Promise<string>((resolve, reject): void => {
    const fd = fs.createReadStream(fileName);
    const hash = crypto.createHash(hashAlgorithm);
    hash.setEncoding("hex");
    fd.on("end", () => {
      hash.end();
      resolve(hash.read());
    });
    fd.on("open", () => {
      fd.pipe(hash);
    });
    fd.on("error", (err) => {
      hash.end();
      reject(err);
    });
  });
}

async function getHashesForFiles(fileNames: string[]): Promise<string[]> {
  return await Promise.all(
    fileNames.map((f: string): Promise<string> =>
      throat(() => getHashForFile(f)),
    ),
  );
}

async function getHashForObject(obj: string[]): Promise<string> {
  const hash = crypto.createHash(hashAlgorithm);
  hash.setEncoding("hex");
  hash.write(JSON.stringify(obj));
  hash.end();
  return hash.read();
}

async function getHashForFiles(fileNames: string[]): Promise<string> {
  const hashes = await getHashesForFiles(fileNames);
  return await getHashForObject(hashes);
}

export async function getHashForConfig(
  { input, output }: Files,
  { debug }: DebugOptions,
): Promise<Hashes> {
  const hrstart = process.hrtime();
  try {
    const hashForInputs = getHashForFiles(input);
    const hashForOutputs = getHashForFiles(output);
    return {
      input: await hashForInputs,
      output: await hashForOutputs,
    };
  } catch (e) {
    throw e;
  } finally {
    if (debug) {
      const [s, ns] = process.hrtime(hrstart);
      const ms = Math.round(ns / 1000000);
      info(`${hashAlgorithm} calculation took ${s}s ${ms}ms`);
    }
  }
}
