#!/usr/bin/env node
/** Render icons/icon.svg → icon16/48/128.png */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const here = dirname(fileURLToPath(import.meta.url));
const iconsDir = join(here, "..", "icons");
const svg = readFileSync(join(iconsDir, "icon.svg"));

for (const size of [16, 48, 128]) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: size },
    background: "transparent",
  });
  writeFileSync(join(iconsDir, `icon${size}.png`), resvg.render().asPng());
  console.log(`Wrote icon${size}.png`);
}
