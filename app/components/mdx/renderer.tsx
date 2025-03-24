/* File: app/components/mdx/renderer.tsx */
'use client';

import { useState, useEffect } from 'react';
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MDXComponents } from '@/components/mdx/components';

interface MDXRendererProps {
  source: MDXRemoteSerializeResult;
}

// Simple loading spinner component
const LoadingSpinner = () => (
  <div className="text-center p-4" aria-label="Loading content">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
    </div>
  </div>
);

export default function MDXRenderer({ source }: MDXRendererProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Import using dynamic import in useEffect
    import('next-mdx-remote').then(mod => {
      setComponent(() => mod.MDXRemote);
    }).catch(err => {
      console.error('Failed to load MDXRemote component:', err);
    });
  }, []);

  if (!source) {
    return null;
  }

  if (!mounted || !Component) {
    return <LoadingSpinner />;
  }

  return (
    <article className="prose prose-zinc dark:prose-invert max-w-none
      prose-headings:font-oswald prose-headings:uppercase prose-headings:tracking-[1.5px]
      prose-h1:text-4xl prose-h1:font-[600] lg:prose-h1:text-5xl
      prose-h2:text-3xl prose-h2:font-[600] prose-h2:leading-[1.2]
      prose-h3:text-2xl prose-h3:font-[600] prose-h3:leading-[1.2]
      prose-p:font-playfair prose-p:text-[1.1rem] prose-p:leading-[1.8] prose-p:text-[#ccc]
      prose-ul:font-playfair prose-ul:text-[1.1rem] prose-ul:leading-[1.8] prose-ul:text-[#ccc]
      prose-li:font-playfair prose-li:text-[1.1rem] prose-li:leading-[1.8] prose-li:text-[#ccc]
      [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
      <Component {...source} components={MDXComponents} />
    </article>
  );
} 