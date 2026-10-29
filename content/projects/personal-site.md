---
name: "本站：零运行时个人主页"
slug: "personal-site"
date: 2026-10-01
intro: "你正在看的这个站点：Eleventy 构建、Pagefind 搜索、Giscus 评论、Umami 统计，全部静态分发。"
stack: ["Eleventy", "Pagefind", "Giscus", "Umami"]
repoUrl: "https://gitee.com/MettaLing/metta-ling"
demoUrl: ""
---

## 能力清单

- 文章列表、详情、标签筛选与站内搜索；
- RSS 与 sitemap 由构建期生成；
- 评论交给 Giscus，数据存于 GitHub Discussions；
- 统计交给 Umami，不采集个人信息。

## 约束

内容只在 Git；模板层不得读写文件系统；front-matter 不符合契约时构建直接失败。架构细节见[这篇文章](/posts/static-site-architecture/)。
