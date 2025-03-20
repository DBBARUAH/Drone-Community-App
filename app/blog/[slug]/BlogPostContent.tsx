'use client';

import { Badge } from '@components/ui/badge';
import { ResponsiveImage } from '@components/ui/image';
import { BackButton } from '@/components/ui/back-button';
import MDXContent from './mdx-content';
import { Post } from '@/app/types/blog';

interface BlogPostContentProps {
  post: Post;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const allTags = [post.label, ...post.tags];

  return (
    <main className="relative min-h-screen bg-black">
      <BackButton />
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <div className="mb-6 sm:mb-8">
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
            <time className="text-xs sm:text-base">{post.published}</time>
          </div>
        </div>

        {post.image && (
          <div className="relative h-[400px] w-full mb-12 rounded-lg overflow-hidden">
            <ResponsiveImage
              src={post.image}
              alt={post.title}
              className="h-full w-full"
            />
          </div>
        )}

        <MDXContent source={post.content} />
      </div>
    </main>
  );
} 