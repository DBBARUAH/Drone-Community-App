'use client';

import { MDXRemote } from 'next-mdx-remote';
import { MDXComponents } from '@/components/mdx-components';

export default function MDXContent({ source }: { source: any }) {
  if (!source) {
    return (
      <div className="text-destructive font-playfair">
        Error loading content. Please try again later.
      </div>
    );
  }

  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none
      prose-headings:font-oswald prose-headings:uppercase prose-headings:tracking-[1.5px]
      prose-h1:text-4xl prose-h1:font-[600] lg:prose-h1:text-5xl
      prose-h2:text-3xl prose-h2:font-[600] prose-h2:leading-[1.2]
      prose-h3:text-2xl prose-h3:font-[600] prose-h3:leading-[1.2]
      prose-p:font-playfair prose-p:text-[1.1rem] prose-p:leading-[1.8] prose-p:text-[#ccc]
      prose-ul:font-playfair prose-ul:text-[1.1rem] prose-ul:leading-[1.8] prose-ul:text-[#ccc]
      prose-li:font-playfair prose-li:text-[1.1rem] prose-li:leading-[1.8] prose-li:text-[#ccc]
      [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <MDXRemote {...source} components={MDXComponents} />
    </div>
  );
} 