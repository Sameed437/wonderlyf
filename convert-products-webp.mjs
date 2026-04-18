// One-off: convert Products/*.png → Products/webp/<product-name>.webp
// Run with: node convert-products-webp.mjs
import { readdir, mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "./wonderlyf-react/node_modules/sharp/lib/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, "Products");
const OUT = join(SRC, "webp");

const NAMES = {
  1: "ABC Malt",
  2: "Mudavattukal Kilangu Soup Mix",
  3: "Paruthipal Mix",
  4: "Mudakathan Thokku",
  5: "Mudakathan Soup Mix",
  6: "Rice Porridge Mix",
  7: "Moringa Honey",
  8: "Forest Honey",
  9: "Meliponini Honey",
  10: "Sesame Blossom Honey",
  11: "Moringa Thokku",
  12: "Moringa Paruppu Podi",
  13: "Banana Stem Pickle",
  14: "Banana Thokku",
  15: "Banana Stem Soup Mix",
  16: "Red Banana Flower Malt",
};

await mkdir(OUT, { recursive: true });

const files = await readdir(SRC);
let converted = 0;
for (const file of files) {
  const match = file.match(/^(\d+)\.png$/i);
  if (!match) continue;
  const id = Number(match[1]);
  const name = NAMES[id];
  if (!name) {
    console.log("⚠ skip (no name):", file);
    continue;
  }
  const outPath = join(OUT, `${name}.webp`);
  await sharp(join(SRC, file)).webp({ quality: 85 }).toFile(outPath);
  console.log("✓", file, "→", `${name}.webp`);
  converted++;
}
console.log(`\nDone. Converted ${converted} images to ${OUT}`);
