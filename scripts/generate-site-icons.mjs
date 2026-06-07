#!/usr/bin/env node
/** Render public/voidad-favicon.svg → site favicons (transparent, large shield) */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import pngToIco from "png-to-ico";

const root = process.cwd();
const svg = readFileSync(join(root, "public/voidad-favicon.svg"));

function render(size) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
    background: "transparent",
  });
  return resvg.render().asPng();
}

const targets = [
  [16, "public/favicon-16.png"],
  [32, "public/favicon-32.png"],
  [180, "public/apple-touch-icon.png"],
  [512, "public/voidad-icon.png"],
  [512, "src/app/icon.png"],
  [180, "src/app/apple-icon.png"],
];

for (const [size, rel] of targets) {
  const path = join(root, rel);
  writeFileSync(path, render(size));
  console.log(`Wrote ${rel} (${size}px)`);
}

const ico = await pngToIco([
  join(root, "public/favicon-16.png"),
  join(root, "public/favicon-32.png"),
]);
writeFileSync(join(root, "src/app/favicon.ico"), ico);
writeFileSync(join(root, "public/favicon.ico"), ico);
console.log("Wrote favicon.ico");
