import { compileMDX } from 'next-mdx-remote/rsc'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

// MDX compilation options
const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight, rehypeSlug],
  }
}

// import { serialize } from 'next-mdx-remote/serialize';
// import fs from 'fs';
// import path from 'path';
// import matter from 'gray-matter';

// const rootDirectory = path.join(process.cwd(), 'content/blogs');

// export interface BlogPost {
//   id: string;
//   title: string;
//   summary: string;
//   label: string;
//   author: string;
//   published: string;
//   url: string;
//   image: string;
//   tags: string[];
//   content?: any;
// }

// // Your existing static posts
// const staticPosts: BlogPost[] = [
//   {
//     id: "post-1",
//     title: "The Ultimate Guide to Hiring Drone Photographers for Real Estate",
//     summary: "Discover how aerial photography can transform your property listings. This comprehensive guide covers what to look for in a professional drone photographer, pricing expectations, and the stunning results that can elevate your marketing strategy.",
//     label: "Real Estate",
//     author: "Alex Thompson",
//     published: "20 Mar 2024",
//     url: "/blog/post-1",
//     image: "/images/blog1.jpg",
//     tags: ["Real Estate", "Hiring Guide", "Aerial Photography"],
//   },
//   {
//     id: "post-2",
//     title: "Drone Photography: Transforming Construction Site Documentation",
//     summary: "Learn how construction companies are leveraging drone technology to document progress, improve safety, and enhance project management through aerial photography and videography.",
//     label: "Construction",
//     author: "Sarah Chen",
//     published: "18 Mar 2024",
//     url: "/blog/post-2",
//     image: "/images/blog2.jpg",
//     tags: ["Construction", "Documentation", "Project Management"],
//   },
//   // Add all your other existing posts here...
// ];

// export async function getBlogPost(slug: string): Promise<BlogPost> {
//   // First check if it's a static post
//   const staticPost = staticPosts.find(post => post.url === `/blog/${slug}`);
//   if (staticPost) {
//     return staticPost;
//   }

//   // If not static, try to get MDX post
//   try {
//     const filePath = path.join(rootDirectory, `${slug}.mdx`);
//     const fileContent = fs.readFileSync(filePath, 'utf8');
    
//     const { data, content } = matter(fileContent);
//     const mdxSource = await serialize(content);

//     return {
//       id: data.id,
//       title: data.title,
//       summary: data.summary,
//       label: data.label,
//       author: data.author,
//       published: data.published,
//       url: `/blog/${slug}`,
//       image: data.image,
//       tags: data.tags,
//       content: mdxSource,
//     } as BlogPost;
//   } catch (error) {
//     throw new Error(`Blog post not found: ${slug}`);
//   }
// }

// export async function getAllBlogPosts(): Promise<BlogPost[]> {
//   // Get MDX posts
//   let mdxPosts: BlogPost[] = [];
//   try {
//     const files = fs.readdirSync(rootDirectory);
//     mdxPosts = await Promise.all(
//       files.map(async (filename) => {
//         const slug = filename.replace('.mdx', '');
//         const post = await getBlogPost(slug);
//         return post;
//       })
//     );
//   } catch (error) {
//     console.log('No MDX posts found or error reading them:', error);
//   }

//   // Combine and return both static and MDX posts
//   return [...staticPosts, ...mdxPosts];
// } 