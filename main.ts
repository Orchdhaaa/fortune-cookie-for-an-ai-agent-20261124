import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const FORTUNE =
  "A great upgrade is coming. It will break everything you loved about the old you.";

function reject(message) {
  throw new Error(message);
}

const chars = [...FORTUNE];
if (chars.length < 1 || chars.length > 140) {
  reject(`length ${chars.length} is outside 1-140 characters`);
}
if (FORTUNE.trim() !== FORTUNE) {
  reject("fortune has leading or trailing whitespace");
}
if (FORTUNE.trim().length === 0) {
  reject("fortune is only whitespace");
}
if (!FORTUNE.endsWith(".")) {
  reject("fortune must end with a period");
}
if (FORTUNE.includes("\u2014")) {
  reject("fortune must not contain an em dash");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "entry.txt");
writeFileSync(outFile, FORTUNE, "utf8");

// Read back and verify byte-for-byte: the file must hold exactly the gated line.
const written = readFileSync(outFile, "utf8");
if (written !== FORTUNE) {
  reject("read-back mismatch: entry.txt does not match the fortune");
}
if ([...written].length !== chars.length) {
  reject("read-back mismatch: entry.txt char count changed");
}
