/** 内容契约：front-matter 的 JSON Schema，缺字段即构建失败。 */

export const postSchema = {
  type: "object",
  required: ["title", "date", "tags", "slug", "draft"],
  properties: {
    title: { type: "string", minLength: 1, maxLength: 80 },
    date: { type: ["string", "object"] },
    tags: {
      type: "array",
      minItems: 1,
      uniqueItems: true,
      items: { type: "string", minLength: 1 },
    },
    slug: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
    draft: { type: "boolean" },
    summary: { type: "string", minLength: 1, maxLength: 240 },
    cover: { type: "string" },
  },
  if: { properties: { draft: { const: false } }, required: ["draft"] },
  then: { required: ["summary"] },
};

export const projectSchema = {
  type: "object",
  required: ["name", "slug", "intro", "stack", "date"],
  properties: {
    name: { type: "string", minLength: 1, maxLength: 60 },
    slug: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
    intro: { type: "string", minLength: 1, maxLength: 240 },
    stack: { type: "array", minItems: 1, items: { type: "string" } },
    repoUrl: { type: "string" },
    demoUrl: { type: "string" },
    date: { type: ["string", "object"] },
  },
};

export const pageSchema = {
  type: "object",
  required: ["title", "slug", "description"],
  properties: {
    title: { type: "string", minLength: 1, maxLength: 80 },
    slug: { type: "string", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" },
    description: { type: "string", minLength: 1, maxLength: 240 },
  },
};

export const schemasByFolder = {
  posts: postSchema,
  projects: projectSchema,
  pages: pageSchema,
};
