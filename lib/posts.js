/**
 * 内容读取与路由的纯函数。
 * 模板与组件不得直接读取 content/，所有派生数据经由本层或 Eleventy 集合。
 */

export function readingTime(body = "") {
  const text = String(body).replace(/!\[[^\]]*\]\([^)]*\)/g, "");
  const cjk = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  const words = (text.replace(/[\u4e00-\u9fff]/g, " ").match(/\b\w+\b/g) || []).length;
  return Math.max(1, Math.round(cjk / 400 + words / 200));
}

export function buildTagList(posts) {
  const map = new Map();
  for (const post of posts) {
    for (const tag of post.data.tags || []) {
      if (!map.has(tag)) map.set(tag, []);
      map.get(tag).push(post);
    }
  }
  return [...map.entries()]
    .map(([name, items]) => ({
      name,
      slug: name,
      url: `/tags/${name}/`,
      count: items.length,
      posts: items.sort((a, b) => b.date - a.date),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "zh-Hans-CN"));
}
