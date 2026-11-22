import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";

import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve paths relative to the project root.
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));

const projectRoot = path.resolve(scriptDirectory, "..");
const outputDirectory = path.join(projectRoot, "www");

// Files and folders used by the web application.
const requiredEntries = ["index.html", "blocks", "pages", "scripts", "vendor"];

const optionalEntries = ["assets"];

// Verify required files exist before deleting any output.
for (const entry of requiredEntries) {
  if (!existsSync(path.join(projectRoot, entry))) {
    throw new Error(`Missing required entry: ${entry}`);
  }
}

// Remove the previous build.
rmSync(outputDirectory, {
  recursive: true,
  force: true,
});

// Create a clean output directory.
mkdirSync(outputDirectory, { recursive: true });

// Copy web application files into www.
for (const entry of [...requiredEntries, ...optionalEntries]) {
  const source = path.join(projectRoot, entry);
  const destination = path.join(outputDirectory, entry);

  if (!existsSync(source)) {
    continue;
  }

  cpSync(source, destination, {
    recursive: true,
  });
}

// Confirm the build contains index.html.
if (!existsSync(path.join(outputDirectory, "index.html"))) {
  throw new Error("Build failed: index.html is missing.");
}

console.log("TaskFlow web build completed.");
console.log("Output directory:", outputDirectory);
console.log("Top-level contents:", readdirSync(outputDirectory));
