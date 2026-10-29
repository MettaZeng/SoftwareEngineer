import { buildTagList, readingTime } from "./lib/posts.js";

const escapeXml = (value = "") =>
  String(value).replace(/[<>&"']/g, (c) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&apos;",
  })[c]);

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function (eleventyConfig) {
  // 静态资源映射到站点根：/css/site.css、/favicon.svg
  eleventyConfig.addPassthroughCopy({ static: "/" });
  eleventyConfig.addWatchTarget("./static/");

  /* ---------- 过滤器（纯函数，供模板使用） ---------- */
  eleventyConfig.addFilter("readableDate", (value) =>
    value ? dateFormatter.format(new Date(value)) : "",
  );
  eleventyConfig.addFilter("isoDate", (value) =>
    value ? new Date(value).toISOString().slice(0, 10) : "",
  );
  eleventyConfig.addFilter("rfc822", (value) =>
    value ? new Date(value).toUTCString() : "",
  );
  eleventyConfig.addFilter("escapeXml", escapeXml);
  eleventyConfig.addFilter("absoluteUrl", (url = "/", base = "") => {
    if (/^https?:\/\//.test(url)) return url;
    const origin = String(base).replace(/\/$/, "");
    return `${origin}${url.startsWith("/") ? url : `/${url}`}`;
  });
  eleventyConfig.addFilter("readingTime", readingTime);
  eleventyConfig.addFilter("currentYear", () => new Date().getFullYear());
  eleventyConfig.addFilter("tagUrl", (tag) => `/tags/${tag}/`);
  eleventyConfig.addFilter("navActive", (url = "", target = "") => {
    if (target === "/") return url === "/" ? "is-active" : "";
    return url === target || url.startsWith(target) ? "is-active" : "";
  });

  /* ---------- 集合：唯一数据出口 ---------- */
  eleventyConfig.addCollection("posts", (api) =>
    api
      .getFilteredByGlob("./content/posts/*.md")
      .filter((item) => item.data.draft !== true)
      .sort((a, b) => b.date - a.date),
  );

  eleventyConfig.addCollection("projects", (api) =>
    api
      .getFilteredByGlob("./content/projects/*.md")
      .sort((a, b) => b.date - a.date),
  );

  eleventyConfig.addCollection("pages", (api) =>
    api.getFilteredByGlob("./content/pages/*.md"),
  );

  eleventyConfig.addCollection("tagList", (api) =>
    buildTagList(api.getFilteredByGlob("./content/posts/*.md").filter((item) => item.data.draft !== true)),
  );

  return {
    dir: {
      input: "content",
      includes: "",
      layouts: "../layouts",
      data: "_data",
      output: "_site",
    },
    // 子路径部署（GitHub Pages 项目站）：CI 设 SITE_BASE=/SoftwareEngineer/
    pathPrefix: process.env.SITE_BASE || "/",
    templateFormats: ["md", "njk"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
