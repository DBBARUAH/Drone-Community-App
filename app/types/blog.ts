// file: app/types/blog.ts
import type { MDXRemoteSerializeResult } from 'next-mdx-remote';

// Base interface for MDX frontmatter
export interface MDXFrontmatter {
  id: string;
  title: string;
  published: string;     // Date in "DD MMM YYYY" format
  author: string;
  summary: string;       // Main description/excerpt of the post
  tags: string[];
  label: string;
  image: string;
}

// Complete BlogPost interface extending MDXFrontmatter
export interface BlogPost extends MDXFrontmatter {
  slug: string;          // URL-friendly version of the title
  url: string;           // Full URL path (/blog/[slug])
  content?: MDXRemoteSerializeResult;  // Properly typed MDX content
}

// Props interfaces for components
export interface BlogListProps {
  posts: BlogPost[];
  heading?: string;
  description?: string;
}

// For generateStaticParams in [slug]/page.tsx
export interface BlogStaticParams {
  slug: string;
}

// For generateMetadata in [slug]/page.tsx
export interface BlogMetadata {
  title: string;
  description: string;
  openGraph?: {
    title: string;
    description: string;
    images: string[];
  };
} 