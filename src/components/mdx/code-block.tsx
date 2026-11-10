"use client";

import { useRef, type ComponentProps } from "react";
import { CopyButton } from "./copy-button";

/** Wraps every fenced code block with a copy button. */
export function CodeBlock(props: ComponentProps<"pre">) {
  const ref = useRef<HTMLPreElement>(null);
  return (
    <div className="group relative">
      <pre ref={ref} {...props} />
      <div className="absolute right-3 top-3 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100 max-md:opacity-100">
        <CopyButton getText={() => ref.current?.innerText ?? ""} />
      </div>
    </div>
  );
}
