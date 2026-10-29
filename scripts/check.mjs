import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import matter from "gray-matter";
import Ajv from "ajv";

import { schemasByFolder } from "../lib/schema.js";

const root = process.cwd();
const contentDir = join(root, "content");
const errors = [];

/** 递归列出某个目录下指定后缀的文件 */
function listFiles(dir, suffix) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  return entries.flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return listFiles(full, suffix);
    return entry.endsWith(suffix) ? [full] : [];
  });
}

/** 1. front-matter JSON Schema 校验（内容契约） */
const ajv = new Ajv({ allErrors: true, strict: false });
const validators = Object.fromEntries(
  Object.entries(schemasByFolder).map(([folder, schema]) => [folder, ajv.compile(schema)]),
);

for (const folder of Object.keys(schemasByFolder)) {
  for (const file of listFiles(join(contentDir, folder), ".md")) {
    const raw = readFileSync(file, "utf8");
    const rel = relative(root, file).replace(/\\/g, "/");
    if (!raw.startsWith("---")) {
      errors.push(`${rel}：缺少 front-matter`);
      continue;
    }
    const { data, content } = matter(raw);
    const validate = validators[folder];
    if (!validate(data)) {
      for (const issue of validate.errors || []) {
        errors.push(`${rel}：${issue.instancePath || "front-matter"} ${issue.message}`);
      }
    }
    // 图片必须带 alt（无障碍与构建红线）
    if (/!\[\s*\]\(/.test(content)) {
      errors.push(`${rel}：存在缺少 alt 的图片`);
    }
  }
}

/** 2. 分层红线：layouts/ 与 components/ 不得读写文件系统 */
const forbidden = /(node:fs|require\(\s*["']fs["']|readFileSync|readFile\b)/;
for (const dir of ["layouts", "components"]) {
  for (const file of listFiles(join(root, dir), ".njk")) {
    const source = readFileSync(file, "utf8");
    const rel = relative(root, file).replace(/\\/g, "/");
    if (forbidden.test(source)) {
      errors.push(`${rel}：模板层不得直接访问文件系统，请经由 lib/ 或集合数据`);
    }
  }
}

if (errors.length > 0) {
  console.error("✖ 内容检查未通过：");
  for (const item of errors) console.error(`  - ${item}`);
  process.exit(1);
}

console.log("✔ 内容契约与分层检查通过");
