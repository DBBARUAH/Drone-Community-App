import { BlogList } from "@/components/ui/blog-section";
import { getAllPosts } from "@/lib/blog";
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Blog | Drone Photography Insights',
  description: 'Explore the latest insights, tips, and trends in drone photography.',
  openGraph: {
    title: 'Blog | Drone Photography Insights',
    description: 'Explore the latest insights, tips, and trends in drone photography.',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg', // Add your OG image
        width: 1200,
        height: 630,
        alt: 'Drone Photography Blog'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Drone Photography Insights',
    description: 'Explore the latest insights, tips, and trends in drone photography.',
  }
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogPage() {
  try {
    const posts = await getAllPosts();
    
    if (!posts || posts.length === 0) {
      notFound();
    }
    
    return (
      <BlogList 
        heading="LATEST POSTS"
        description="Explore our latest articles on drone photography, cinematography, and industry insights"
        posts={posts}
      />
    );
  } catch (error) {
    console.error('Error loading blog posts:', error);
    notFound();
  }
}