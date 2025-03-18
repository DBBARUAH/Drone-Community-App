import { Blog8 } from "@/components/ui/blog-section";
import { getAllPosts } from "@/lib/blog";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Drone Photography Insights',
  description: 'Explore the latest insights, tips, and trends in drone photography.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  return <Blog8 posts={posts} />;
}