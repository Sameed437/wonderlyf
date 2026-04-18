// Convert all PNG/JPG in public/ to WebP in place (keeps originals).
// Usage: node scripts/convert-to-webp.mjs
import { readdir, stat } from "node:fs/promises";
import { join, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "public");
const EXTS = new Set([".png", ".jpg", ".jpeg"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

let converted = 0, skipped = 0;
for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  if (!EXTS.has(ext)) continue;
  const out = join(dirname(file), basename(file, ext) + ".webp");
  try {
    await stat(out);
    skipped++;
    continue;
  } catch {}
  await sharp(file).webp({ quality: 82 }).toFile(out);
  console.log("✓", file.replace(ROOT, "public"), "→", basename(out));
  converted++;
}
console.log(`\nDone. Converted ${converted}, already existed ${skipped}.`);
