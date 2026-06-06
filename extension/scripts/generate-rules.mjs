#!/usr/bin/env node
/**
 * Generate declarativeNetRequest rules from blocked-domains.json
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const domains = JSON.parse(
  readFileSync(join(root, "rules/blocked-domains.json"), "utf8"),
).domains;

const resourceTypes = [
  "script",
  "image",
  "xmlhttprequest",
  "sub_frame",
  "media",
  "stylesheet",
  "object",
  "websocket",
  "ping",
  "other",
];

const rules = domains.map((domain, index) => ({
  id: index + 1,
  priority: 1,
  action: { type: "block" },
  condition: {
    urlFilter: `||${domain}^`,
    resourceTypes,
  },
}));

writeFileSync(
  join(root, "rules/block-rules.json"),
  JSON.stringify(rules, null, 2) + "\n",
);

console.log(`Generated ${rules.length} blocking rules.`);
