import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const siteDir = join(process.cwd(), "_site");
const errors = [];
// 子路径部署前缀（与 eleventy.config.js 的 pathPrefix 保持一致）
const pathPrefix = process.env.SITE_BASE || "/";

/** 产物断言：切片 S1–S6 的端到端检查 */
const required = [
  "index.html",
  "404.html",
  "feed.xml",
  "sitemap.xml",
  "posts/index.html",
  "projects/index.html",
  "search/index.html",
  "css/site.css",
  "pagefind/pagefind.js",
  "posts/static-site-architecture/index.html",
  "tags/架构/index.html",
  "projects/personal-site/index.html",
  "resume/index.html",
];

for (const file of required) {
  if (!existsSync(join(siteDir, file))) errors.push(`缺少产物：${file}`);
}

/** 递归收集 HTML */
function listHtml(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "pagefind") return [];
      return listHtml(full);
    }
    return entry.endsWith(".html") ? [full] : [];
  });
}

function isFile(path) {
  if (!existsSync(path)) return false;
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

/** 站内死链检查 */
for (const file of listHtml(siteDir)) {
  const html = readFileSync(file, "utf8");
  const links = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const raw of links) {
    if (/^(https?:|mailto:|tel:|data:|javascript:|#|\/\/)/.test(raw)) continue;
    const target = raw.split("#")[0].split("?")[0];
    if (!target) continue;
    const decoded = decodeURIComponent(target);
    // 去掉 pathPrefix 前缀，映射回 _site 内的真实文件路径
    let relPath = decoded;
    if (pathPrefix !== "/" && relPath.startsWith(pathPrefix)) {
      relPath = relPath.slice(pathPrefix.length - 1); // 保留开头的 "/"
    }
    const base = relPath.startsWith("/") ? siteDir : dirname(file);
    let candidate = relPath.endsWith("/")
      ? join(base, `${relPath}index.html`)
      : join(base, relPath);
    candidate = resolve(candidate);
    const ok =
      isFile(candidate) ||
      isFile(`${candidate}.html`) ||
      isFile(join(candidate, "index.html"));
    if (!ok) {
      errors.push(
        `${file.replace(siteDir, "_site").replace(/\\/g, "/")} 指向不存在的资源：${raw}`,
      );
    }
  }
}

/** RSS 结构自查 */
if (existsSync(join(siteDir, "feed.xml"))) {
  const feed = readFileSync(join(siteDir, "feed.xml"), "utf8");
  if (!feed.includes("<rss") || !feed.includes("<channel>") || !feed.includes("<item>")) {
    errors.push("feed.xml 不是有效的 RSS 2.0 结构");
  }
}

if (existsSync(join(siteDir, "posts/static-site-architecture/index.html"))) {
  const post = readFileSync(join(siteDir, "posts/static-site-architecture/index.html"), "utf8");
  if (!post.includes("data-pagefind-body")) {
    errors.push("文章详情页缺少 data-pagefind-body，搜索索引将不完整");
  }
}

if (errors.length > 0) {
  console.error("✖ 产物验收未通过：");
  for (const item of errors) console.error(`  - ${item}`);
  process.exit(1);
}

console.log(`✔ 产物验收通过（${listHtml(siteDir).length} 个页面，无站内死链）`);
