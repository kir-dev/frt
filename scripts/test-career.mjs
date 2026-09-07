import { build } from "esbuild";
import { mkdtemp, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
const directory = await mkdtemp(path.join(process.cwd(), ".career-tests-"));
try {
  const outfile = path.join(directory, "career.test.cjs");
  await build({
    entryPoints: ["tests/career.test.ts"],
    outfile,
    bundle: true,
    platform: "node",
    format: "cjs",
    packages: "external",
  });
  const result = spawnSync(process.execPath, ["--test", outfile], {
    stdio: "inherit",
  });
  process.exitCode = result.status ?? 1;
} finally {
  await rm(directory, { recursive: true, force: true });
}
