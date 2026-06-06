import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "out");

const removableDirectories = [
  "images/generated-themes/legacy",
];

const removableFiles = [
  "audio/ambience/README.md",
];

const removableFilePatterns = [
  /(?:^|[/\\])source-sheet-v\d+\.(?:png|webp)$/i,
  /(?:^|[/\\])[^/\\]+-scene(?:-v\d+)?\.png$/i,
  /(?:^|[/\\])[^/\\]+-ritual-kit-v\d+\.png$/i,
];

const textFileExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".map",
  ".mjs",
  ".rsc",
  ".txt",
]);

const sanitizedTextPatterns = [
  {
    pattern: /sourceSheet:\s*`[^`]*source-sheet-v\d+\.(?:png|webp)`/gi,
    replacement: 'sourceSheet:""',
  },
  {
    pattern: /"sourceSheet"\s*:\s*"[^"]*source-sheet-v\d+\.(?:png|webp)"/gi,
    replacement: '"sourceSheet":""',
  },
  {
    pattern: /\/images\/generated-themes\/legacy\/[^"'`\\\s),;]+?\.(?:jpg|jpeg|png|webp)/gi,
    replacement: "",
  },
  {
    pattern: /\/images\/generated-themes\/[^"'`\\\s),;]*source-sheet-v\d+\.(?:png|webp)/gi,
    replacement: "",
  },
  {
    pattern: /\/images\/generated-themes\/[^"'`\\\s),;]+?-scene(?:-v\d+)?\.png/gi,
    replacement: "",
  },
  {
    pattern: /\/images\/generated-themes\/[^"'`\\\s),;]+?-ritual-kit-v\d+\.png/gi,
    replacement: "",
  },
];

const forbiddenResiduePatterns = [
  /\/images\/generated-themes\/legacy\//i,
  /source-sheet-v\d+\.(?:png|webp)/i,
  /-scene(?:-v\d+)?\.png/i,
  /-ritual-kit-v\d+\.png/i,
];

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes}B`;
  }

  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(2)}${units[unitIndex]}`;
}

function statSize(targetPath) {
  if (!fs.existsSync(targetPath)) {
    return 0;
  }

  const stats = fs.statSync(targetPath);
  if (!stats.isDirectory()) {
    return stats.size;
  }

  return fs.readdirSync(targetPath).reduce((total, entry) => total + statSize(path.join(targetPath, entry)), 0);
}

function removeTarget(relativePath) {
  const targetPath = path.join(OUT_DIR, relativePath);
  if (!fs.existsSync(targetPath)) {
    return null;
  }

  const size = statSize(targetPath);
  fs.rmSync(targetPath, { recursive: true, force: true });
  return { path: relativePath, size };
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const entries = [];
  for (const entry of fs.readdirSync(dir)) {
    const entryPath = path.join(dir, entry);
    const stats = fs.statSync(entryPath);
    if (stats.isDirectory()) {
      entries.push(...walkFiles(entryPath));
    } else {
      entries.push(entryPath);
    }
  }

  return entries;
}

function isTextFile(filePath) {
  return textFileExtensions.has(path.extname(filePath).toLowerCase());
}

function sanitizeTextFile(filePath) {
  if (!isTextFile(filePath)) {
    return 0;
  }

  let content = fs.readFileSync(filePath, "utf8");
  let replacements = 0;

  for (const { pattern, replacement } of sanitizedTextPatterns) {
    content = content.replace(pattern, () => {
      replacements += 1;
      return replacement;
    });
  }

  if (replacements > 0) {
    fs.writeFileSync(filePath, content, "utf8");
  }

  return replacements;
}

function findForbiddenResidue(files) {
  const residue = [];

  for (const filePath of files) {
    if (!isTextFile(filePath)) {
      continue;
    }

    const content = fs.readFileSync(filePath, "utf8");
    if (!forbiddenResiduePatterns.some((pattern) => pattern.test(content))) {
      continue;
    }

    residue.push(path.relative(OUT_DIR, filePath).replaceAll(path.sep, "/"));
  }

  return residue;
}

function createRscAliases(files) {
  let aliases = 0;

  for (const filePath of files) {
    if (path.extname(filePath).toLowerCase() !== ".txt") {
      continue;
    }

    const sourceDir = path.dirname(filePath);
    const sourceDirName = path.basename(sourceDir);
    if (!sourceDirName.startsWith("__next.")) {
      continue;
    }

    const targetPath = path.join(path.dirname(sourceDir), `${sourceDirName}.${path.basename(filePath)}`);
    if (fs.existsSync(targetPath)) {
      continue;
    }

    fs.copyFileSync(filePath, targetPath);
    aliases += 1;
  }

  return aliases;
}

if (!fs.existsSync(OUT_DIR)) {
  console.error("out/ does not exist. Run the public export build before pruning.");
  process.exit(1);
}

const removed = [];
const allFilesBeforeSanitize = walkFiles(OUT_DIR);

for (const relativePath of removableDirectories) {
  const result = removeTarget(relativePath);
  if (result) {
    removed.push(result);
  }
}

for (const relativePath of removableFiles) {
  const result = removeTarget(relativePath);
  if (result) {
    removed.push(result);
  }
}

for (const filePath of allFilesBeforeSanitize) {
  if (!fs.existsSync(filePath)) {
    continue;
  }

  const relativePath = path.relative(OUT_DIR, filePath).replaceAll(path.sep, "/");
  if (!removableFilePatterns.some((pattern) => pattern.test(relativePath))) {
    continue;
  }

  const result = removeTarget(relativePath);
  if (result) {
    removed.push(result);
  }
}

let sanitizedTextReferences = 0;
const remainingFiles = walkFiles(OUT_DIR);
for (const filePath of remainingFiles) {
  sanitizedTextReferences += sanitizeTextFile(filePath);
}

const rscAliases = createRscAliases(walkFiles(OUT_DIR));
const forbiddenResidue = findForbiddenResidue(walkFiles(OUT_DIR));
if (forbiddenResidue.length > 0) {
  console.error("Public export still contains local-only asset references:");
  for (const relativePath of forbiddenResidue.slice(0, 25)) {
    console.error(`- ${relativePath}`);
  }
  if (forbiddenResidue.length > 25) {
    console.error(`...and ${forbiddenResidue.length - 25} more files`);
  }
  process.exit(1);
}

const total = removed.reduce((sum, item) => sum + item.size, 0);
console.log(`Pruned ${removed.length} public export targets (${formatBytes(total)}).`);
for (const item of removed.sort((a, b) => b.size - a.size)) {
  console.log(`- ${item.path} (${formatBytes(item.size)})`);
}
console.log(`Sanitized ${sanitizedTextReferences} local-only asset references from public text output.`);
console.log(`Created ${rscAliases} RSC text aliases for static export compatibility.`);
console.log("Public export residue check passed.");
