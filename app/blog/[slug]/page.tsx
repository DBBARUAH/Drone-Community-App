import { getPost } from '@lib/blog';
import { notFound } from 'next/navigation';
import { Badge } from '@components/ui/badge';
import { ResponsiveImage } from '@components/ui/image';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | Drone Photography Blog`,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  // Include the label in the tags for the blog post page
  const allTags = [post.label, ...post.tags];

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        
        {/* Tags after heading */}
        <div className="flex flex-wrap gap-2 mb-6">
          {allTags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-gray-600 dark:text-gray-300 mb-8">
          <span className="text-lg">{post.author}</span>
          <time className="text-sm">{post.published}</time>
        </div>
      </div>

      <div className="relative h-[400px] w-full mb-12 rounded-lg overflow-hidden">
        <ResponsiveImage
          src={post.image}
          alt={post.title}
          className="h-full w-full"
        />
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        {post.content}
      </div>
    </article>
  );
} 