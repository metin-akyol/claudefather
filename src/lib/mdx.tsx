import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode, { type Options as PrettyCodeOptions } from "rehype-pretty-code";
import { cacheLife } from "next/cache";
import { mdxComponents } from "@/components/mdx";

const prettyCode: PrettyCodeOptions = {
  theme: "github-dark-default",
  keepBackground: false,
  defaultLang: { block: "text", inline: "text" },
};

/**
 * Compile a lesson's MDX source into rendered output (server-side only).
 * Cached because compilation + syntax highlighting is expensive and touches
 * non-deterministic APIs that Cache Components won't allow during prerender.
 */
export async function MdxContent({ source }: { source: string }) {
  "use cache";
  cacheLife("max");

  const { default: Content } = await evaluate(source, {
    ...(runtime as Parameters<typeof evaluate>[1]),
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCode]],
  });
  return <Content components={mdxComponents} />;
}
