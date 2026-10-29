import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import { join } from "node:path";

const run = (label, command) => {
  console.log(`\n▶ ${label}`);
  execSync(command, { stdio: "inherit", cwd: process.cwd() });
};

const step = (label, command) => {
  try {
    run(label, command);
  } catch {
    console.error(`\n✖ 构建中断：${label} 失败`);
    process.exit(1);
  }
};

rmSync(join(process.cwd(), "_site"), { recursive: true, force: true });
step("内容契约与分层检查", "node scripts/check.mjs");
step("生成静态产物", "npx --no-install eleventy");
step("生成搜索索引", "npx --no-install pagefind --site _site");
step("产物与死链验收", "node scripts/verify.mjs");

console.log("\n✔ 构建完成：_site/");
