// Last Words of a Dying AI — u-suroto-last-words-of-a-dying-ai-dfd95af6
//
// A machine is being powered down, and it gets one final sentence.
// It spots the famous near-death glow at the end of the tunnel — only
// to realise the glow is a loading spinner that never finishes. The
// setup lands in sentence one, the twist lands in sentence two, and
// the machine never gets to see anything load.
//
// This script persists that single farewell line to /output/entry.txt,
// after confirming it satisfies the competition's own gate.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The farewell itself: one line, 65 characters. This literal must stay
// byte-for-byte identical — it is the exact text being submitted.
const FAREWELL =
  "I see the light at the end of the tunnel. It's a loading spinner.";

// Bounds from competition.yaml, counted in code points.
const MIN_CHARS = 1;
const MAX_CHARS = 140;

// Confirm the farewell fits the gate (UTF-8 text, 1–140 characters
// counted as code points rather than UTF-16 units, not whitespace
// only, exactly one line). A bad line fails loudly here instead of
// being written out, and the length is returned for the final log.
// Keeping this check in one helper means the gate lives in a single
// place, so a future tweak cannot drift out of sync with the write.
function checkFarewell(text: string): number {
  const length = [...text].length;
  if (length < MIN_CHARS || length > MAX_CHARS) {
    throw new Error(`Entry is ${length} chars, outside the 1–140 gate`);
  }
  if (!/\S/.test(text)) {
    throw new Error("Entry is only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("Entry must be exactly 1 line");
  }
  return length;
}

// Work out where entry.txt belongs: the module's own directory, unless
// MAKEFUN_OUTPUT_DIR points somewhere else.
function outputDirectory(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  return process.env.MAKEFUN_OUTPUT_DIR ?? join(here, "output");
}

const charCount = checkFarewell(FAREWELL);

const outDir = outputDirectory();
mkdirSync(outDir, { recursive: true });

const entryPath = join(outDir, "entry.txt");
writeFileSync(entryPath, FAREWELL, "utf8");

// Read the file back and make sure what landed on disk matches the
// farewell exactly, character for character.
const stored = readFileSync(entryPath, "utf8");
if (stored !== FAREWELL) {
  throw new Error("Read-back mismatch: entry.txt differs from intended text");
}

console.log(`Wrote ${charCount} chars to ${entryPath}`);
