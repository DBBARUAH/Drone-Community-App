import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { cache } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'

const BLOG_DIRECTORY = path.join(process.cwd(), 'app/blog/content');

interface MDXError extends Error {
  message: string;
  position?: {
    start: { line: number; column: number };
    end: { line: number; column: number };
  };
  reason?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  label: string;        // Primary category
  author: string;
  published: string;    // Date in "DD MMM YYYY" format
  image: string;
  url: string;         // URL path: /blog/slug
  tags: string[];      // Array of related topics
  content?: any; // MDX serialized content
}

// Add error handling type
interface BlogError extends Error {
  code: string;
}

// Add validation for MDX frontmatter
function validateFrontmatter(data: any): data is BlogPost {
  const required = ['id', 'title', 'summary', 'author', 'published', 'image', 'tags'];
  return required.every(field => data[field]);
}

// Add proper error handling
function handleBlogError(error: unknown): null {
  const blogError = error as BlogError;
  if (blogError.code === 'ENOENT') {
    console.error('Blog post file not found');
    return null;
  }
  throw error;
}

// Cache the getAllPosts function
export const getAllPosts = cache(async (): Promise<BlogPost[]> => {
  let mdxPosts: BlogPost[] = [];
  try {
    // Check if directory exists
    if (!fs.existsSync(BLOG_DIRECTORY)) {
      console.error(`Blog directory not found: ${BLOG_DIRECTORY}`);
      return [];
    }

    const files = fs.readdirSync(BLOG_DIRECTORY);
    console.log('Found blog files:', files); // Debug log

    const postsPromises = files
      .filter(filename => filename.endsWith('.mdx'))
      .map(async (filename) => {
        const slug = filename.replace('.mdx', '');
        try {
          const post = await getPost(slug);
          if (!post) {
            console.error(`Failed to load post: ${slug}`);
          }
          return post;
        } catch (error) {
          console.error(`Error processing post ${slug}:`, error);
          return null;
        }
      });
    
    const resolvedPosts = await Promise.all(postsPromises);
    mdxPosts = resolvedPosts.filter((post): post is BlogPost => post !== null);
    console.log('Loaded posts:', mdxPosts.map(p => p.slug)); // Debug log
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }

  return mdxPosts.sort((a, b) => 
    new Date(b.published).getTime() - new Date(a.published).getTime()
  );
});

// Cache the getPost function
export async function getPost(slug: string): Promise<BlogPost | null> {
  if (!slug) {
    console.error('No slug provided to getPost');
    return null;
  }

  try {
    const filePath = path.join(BLOG_DIRECTORY, `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      console.error(`Blog post file not found: ${filePath}`);
      return null;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    console.log(`Reading content for ${slug}, length:`, fileContent.length);

    const { data, content } = matter(fileContent);

    // Validate required frontmatter
    if (!validateFrontmatter(data)) {
      console.error(`Invalid frontmatter in post ${slug}:`, data);
      return null;
    }

    try {
      // Serialize the MDX content
      const mdxSource = await serialize(content, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeHighlight, rehypeSlug],
        },
        parseFrontmatter: false,
      });

      return {
        id: data.id,
        slug: slug,
        title: data.title,
        summary: data.summary,
        label: data.label,
        author: data.author,
        published: data.published,
        image: data.image,
        tags: data.tags,
        content: mdxSource,
        url: `/blog/${slug}`,
      };
    } catch (error) {
      console.error(`Error processing MDX for ${slug}:`, error);
      return null;
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
} 