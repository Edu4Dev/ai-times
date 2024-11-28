export const page = {
  name: "page",
  type: "page",
  hideContent: true,
  urlPath: "/{slug}",
  filePath: "content/pages/{slug}.md",
  fields: [
    { name: "title", type: "string", required: true },
    { name: "pageDescription", type: "string", required: false },
    { name: "body", type: "markdown", required: false },
  ],
};
