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
    <article className="max-w-none">
      <Component {...source} components={MDXComponents} />
    </article>
  );
} 