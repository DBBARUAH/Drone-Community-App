import { notFound } from 'next/navigation';
import { getAllPosts, getPost } from '@/lib/blog';
import { Badge } from '@/components/ui/badge';
import { ResponsiveImage } from '@/components/ui/image';
import { BackButton } from '@/components/ui/back-button';
import MDXRenderer from '@/components/mdx/renderer';
import type { Metadata } from 'next';

// Tell Next.js to treat unknown slugs as 404
export const dynamicParams = false;

// Generate all valid paths at build time
export async function generateStaticParams() {
  const posts = await getAllPosts();
  // Return array of valid slugs from your MDX files
  return posts.map((post) => ({
    slug: post.slug, // e.g., 'drone-event-documentation', 'drone-licensing-regulations', etc.
  }));
}

// Generate metadata for the page
export async function generateMetadata(props: any): Promise<Metadata> {
  try {
    const post = await getPost(props.params.slug);
    
    if (!post) {
      return {
        title: 'Post Not Found',
        description: 'The requested blog post is missing or unavailable.',
      };
    }

    return {
      title: `${post.title} | Drone Photography Blog`,
      description: post.summary,
      openGraph: {
        title: post.title,
        description: post.summary,
        images: [post.image],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Error',
      description: 'There was an error loading this blog post.',
    };
  }
}

// The page component
export default async function BlogPostPage(props: any) {
  const post = await getPost(props.params.slug);
  
  if (!post) {
    notFound();
  }

  // Combine main label and tags
  const allTags = [post.label, ...post.tags];

  return (
    <main className="relative min-h-screen bg-background">
      <BackButton />
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 font-oswald uppercase tracking-[1.5px]">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between mb-6 sm:mb-8 text-muted-foreground">
            <span className="text-xs sm:text-base font-medium">{post.author}</span>
            <time dateTime={post.published} className="text-xs sm:text-base">
              {post.published}
            </time>
          </div>
        </header>

        {post.image && (
          <figure className="relative h-[400px] w-full mb-12 rounded-lg overflow-hidden">
            <ResponsiveImage
              src={post.image}
              alt={`A drone shot for ${post.title}`}
              className="h-full w-full object-cover"
              unoptimized={post.image.includes('unsplash.com')}
            />
          </figure>
        )}

        {post.content && <MDXRenderer source={post.content} />}
      </div>
    </main>
  );
}