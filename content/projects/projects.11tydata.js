export default {
  layout: "project.njk",
  eleventyComputed: {
    permalink: (data) => `/projects/${data.slug}/`,
  },
};
