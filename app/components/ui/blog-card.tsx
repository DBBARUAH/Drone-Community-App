import { BlogPost } from '@lib/blog';
import { ResponsiveImage } from '@components/ui/image';
import Link from 'next/link';
import { Badge } from '@components/ui/badge';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  // Filter out the label from tags to avoid duplication
  const uniqueTags = post.tags.filter(tag => tag !== post.label);

  return (
    <Link href={post.url} className="group">
      <article className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-105 bg-white dark:bg-gray-800 h-[500px]">
        {/* Fixed height image container */}
        <div className="relative h-48 w-full flex-shrink-0">
          <ResponsiveImage
            src={post.image}
            alt={post.title}
            className="h-48 w-full"
          />
          {/* Primary category badge */}
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="text-sm font-medium">
              {post.label}
            </Badge>
          </div>
        </div>
        
        {/* Fixed height content area with overflow handling */}
        <div className="flex flex-col flex-grow p-6 justify-between">
          <div>
            {/* Fixed height title with truncation */}
            <h3 className="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white line-clamp-2 h-[56px]">
              {post.title}
            </h3>
            
            {/* Fixed height summary with truncation */}
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-3 h-[60px]">
              {post.summary}
            </p>
            
            {/* Fixed height tags area */}
            <div className="flex flex-wrap gap-2 mb-4 h-[32px] overflow-hidden">
              {uniqueTags.length > 0 && uniqueTags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs text-gray-700 dark:text-gray-300 border-gray-400 dark:border-gray-500">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Author and date */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-auto">
            <span>{post.author}</span>
            <span>{post.published}</span>
          </div>
        </div>
      </article>
    </Link>
  );
} 