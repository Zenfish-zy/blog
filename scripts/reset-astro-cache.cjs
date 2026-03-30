const { existsSync, rmSync } = require("fs");
const { resolve } = require("path");

const astroCacheDir = resolve(process.cwd(), ".astro");

if (existsSync(astroCacheDir)) {
  rmSync(astroCacheDir, { recursive: true, force: true });
  console.log("🧹 Cleared Astro cache:", astroCacheDir);
}
