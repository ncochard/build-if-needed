import * as crypto from "crypto";
import * as fs from "fs";

export const hashAlgorithm = "md5";

function getHashForFile(fileName: string): Promise<string> {
  return new Promise<string>((resolve): void => {
    const fd = fs.createReadStream(fileName);
    const hash = crypto.createHash(hashAlgorithm);
    hash.setEncoding("hex");
    fd.on("end", function () {
      hash.end();
      resolve(hash.read());
    });
    fd.pipe(hash);
  });
}

async function getHashesForFiles(fileNames: string[]): Promise<string[]> {
  return await Promise.all(
    fileNames.map((f: string): Promise<string> => getHashForFile(f))
  );
}

async function getHashForObject(obj: string[]): Promise<string> {
  const hash = crypto.createHash(hashAlgorithm);
  hash.setEncoding("hex");
  hash.write(JSON.stringify(obj));
  hash.end();
  return hash.read();
}

export async function getHashForFiles(fileNames: string[]): Promise<string> {
  const hashes = await getHashesForFiles(fileNames);
  return await getHashForObject(hashes);
}
