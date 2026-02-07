import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const orderPath = "src/data/order.yaml";
const raw = fs.readFileSync(orderPath, "utf-8");
const order = parse(raw);

const collections = ["video", "image", "web", "music"];
let hasError = false;

for (const collection of collections) {
  const dir = path.join("src", "data", collection);
  const slugsInOrder = order[collection] || [];

  // Get actual .md files in the directory
  let filesOnDisk = [];
  if (fs.existsSync(dir)) {
    filesOnDisk = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
  }

  // Check: every slug in order.yaml has a matching file
  for (const slug of slugsInOrder) {
    if (!filesOnDisk.includes(slug)) {
      console.error(
        `ERROR: ${collection}/${slug} is in order.yaml but no file exists at ${dir}/${slug}.md`
      );
      hasError = true;
    }
  }

  // Check: every file on disk is listed in order.yaml
  for (const file of filesOnDisk) {
    if (!slugsInOrder.includes(file)) {
      console.warn(
        `WARN: ${dir}/${file}.md exists but is not listed in order.yaml under ${collection}`
      );
    }
  }
}

if (hasError) {
  console.error("\nValidation failed. Fix the errors above.");
  process.exit(1);
} else {
  console.log("Validation passed.");
}
