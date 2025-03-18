import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { cache } from 'react';

const rootDirectory = path.join(process.cwd(), 'content/blogs');

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  excerpt: string;
  date: string;
  image: string;
  label: string;        // Primary category
  author: string;
  published: string;    // Date in "DD MMM YYYY" format
  url: string;         // URL path: /blog/slug
  tags: string[];      // Array of related topics
  content?: string;    // MDX content (optional for list views)
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
  // Get MDX posts
  let mdxPosts: BlogPost[] = [];
  try {
    // Check if directory exists
    if (fs.existsSync(rootDirectory)) {
      const files = fs.readdirSync(rootDirectory);
      const postsPromises = files
        .filter(filename => filename.endsWith('.mdx'))
        .map(async (filename) => {
          const slug = filename.replace('.mdx', '');
          const post = await getPost(slug);
          return post;
        });
      
      const resolvedPosts = await Promise.all(postsPromises);
      mdxPosts = resolvedPosts.filter((post): post is BlogPost => post !== null);
    }
  } catch (error) {
    console.log('No MDX posts found or error reading them:', error);
  }

  // Deduplicate posts by URL to avoid same content showing twice
  const urlMap = new Map<string, BlogPost>();
  
  // Add all MDX posts to the map
  mdxPosts.forEach(mdxPost => {
    urlMap.set(mdxPost.url, mdxPost);
  });
  
  // Convert map back to array and sort by date (newest first)
  return Array.from(urlMap.values()).sort((a, b) => {
    return new Date(b.published).getTime() - new Date(a.published).getTime();
  });
});

// Cache the getPost function
export const getPost = cache(async (slug: string): Promise<BlogPost | null> => {
  try {
    // Reads the MDX file based on the slug
    const filePath = path.join(rootDirectory, `${slug}.mdx`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Uses gray-matter to parse the frontmatter and content
    const { data, content } = matter(fileContent);
    
    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      summary: data.summary,
      excerpt: data.excerpt,
      date: data.date,
      image: data.image,
      label: data.label,
      author: data.author,
      published: data.published,
      url: `/blog/${slug}`,
      tags: data.tags,
      content: content, // The actual MDX content
    } as BlogPost;
  } catch (error) {
    console.error(`Error getting post ${slug}:`, error);
    return null;
  }
}); 