#!/usr/bin/env node
/** Package extension/ → public/downloads/voidad-extension.zip for dashboard download */
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const outDir = join(root, "public/downloads");
const outFile = join(outDir, "voidad-extension.zip");

mkdirSync(outDir, { recursive: true });

execSync(
  `zip -r "${outFile}" . -x "*.DS_Store" -x "scripts/*" -x "README.md"`,
  { cwd: join(root, "extension"), stdio: "inherit" },
);

console.log(`Extension zip → ${outFile}`);
