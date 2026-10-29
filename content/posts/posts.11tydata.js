export default {
  layout: "post.njk",
  eleventyComputed: {
    // 状态图：草稿不产出 URL；撤回的文章由 retired.json 生成 410 页
    permalink: (data) => (data.draft === true ? false : `/posts/${data.slug}/`),
    eleventyExcludeFromCollections: (data) => data.draft === true,
  },
};
