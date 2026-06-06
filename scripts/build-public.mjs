import { spawnSync } from "node:child_process";
import path from "node:path";

const ROOT = process.cwd();
const node = process.execPath;
const env = {
  ...process.env,
  GITHUB_PAGES: "true",
  NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? "/omamori-sha",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "https://zhezhi-ya.github.io/omamori-sha",
  NEXT_PUBLIC_ENABLE_LOCAL_CHARACTER_IMAGES: process.env.NEXT_PUBLIC_ENABLE_LOCAL_CHARACTER_IMAGES ?? "true",
  NEXT_PUBLIC_ENABLE_LOCAL_MUSIC: process.env.NEXT_PUBLIC_ENABLE_LOCAL_MUSIC ?? "true",
};

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    env,
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run(node, [path.join(ROOT, "node_modules", "next", "dist", "bin", "next"), "build", "--webpack"]);
run(node, [path.join(ROOT, "scripts", "prune-public-export.mjs")]);
