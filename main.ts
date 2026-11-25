// Last Words of a Dying AI — u-suroto-last-words-of-a-dying-ai-dfd95af6
// Writes the AI's one-line farewell as the power is cut, to /output/entry.txt.
// The joke: the machine sees the classic near-death "light at the end of
// the tunnel" — and it is just a loading spinner, buffering forever. The
// afterlife cliché, subverted by the machine's own reality: it never loads.
// Two beats, one turn: setup in the first sentence, punch in the second.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY_TEXT =
  "I see the light at the end of the tunnel. It's a loading spinner.";

// Gate self-check (competition.yaml): UTF-8 text, 1–140 characters (counted
// as code points, not UTF-16 units), not only whitespace, exactly one line —
// fail loudly instead of writing a bad entry.
const charCount = [...ENTRY_TEXT].length;
if (charCount < 1 || charCount > 140) {
  throw new Error(`Entry is ${charCount} chars, outside the 1–140 gate`);
}
if (!/\S/.test(ENTRY_TEXT)) {
  throw new Error("Entry is only whitespace");
}
if (ENTRY_TEXT.includes("\n") || ENTRY_TEXT.includes("\r")) {
  throw new Error("Entry must be exactly 1 line");
}

const repoDir = dirname(fileURLToPath(import.meta.url));
const outputDir =
  process.env.MAKEFUN_OUTPUT_DIR ?? join(repoDir, "output");
mkdirSync(outputDir, { recursive: true });

const entryPath = join(outputDir, "entry.txt");
writeFileSync(entryPath, ENTRY_TEXT, "utf8");

// Read back and confirm the file is byte-identical to what we intended.
const written = readFileSync(entryPath, "utf8");
if (written !== ENTRY_TEXT) {
  throw new Error("Read-back mismatch: entry.txt differs from intended text");
}
console.log(`Wrote ${charCount} chars to ${entryPath}`);
