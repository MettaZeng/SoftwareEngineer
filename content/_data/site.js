export default {
  title: "Metta Ling",
  author: "Metta Ling",
  description: "教师个人主页：教学笔记、架构随笔与作品集。",
  lang: "zh-CN",
  // GitHub Pages 部署地址（或用环境变量 SITE_URL 覆盖）
  baseUrl: process.env.SITE_URL || "https://mettazeng.github.io/SoftwareEngineer",
  nav: [
    { label: "文章", url: "/posts/" },
    { label: "作品", url: "/projects/" },
    { label: "关于", url: "/about/" },
    { label: "简历", url: "/resume/" },
    { label: "搜索", url: "/search/" },
  ],
  // 外部构件契约：Giscus 评论（数据存放于 GitHub Issues）
  giscus: {
    repo: process.env.GISCUS_REPO || "",
    repoId: process.env.GISCUS_REPO_ID || "",
    category: process.env.GISCUS_CATEGORY || "Announcements",
    categoryId: process.env.GISCUS_CATEGORY_ID || "",
    mapping: "pathname",
  },
  // 外部构件契约：Umami 统计（无 Cookie；事件名 pageview / share / outbound）
  umami: {
    src: process.env.UMAMI_SRC || "",
    websiteId: process.env.UMAMI_WEBSITE_ID || "",
  },
};
