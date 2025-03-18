import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BlogPost } from "@/lib/blog";
import Link from "next/link";
import { ResponsiveImage } from "@/components/ui/image";

interface Blog8Props {
  heading?: string;
  description?: string;
  posts: BlogPost[];
}

const Blog8 = ({
  heading = "Drone Photography Blog",
  description = "Expert insights and guides for drone photography professionals",
  posts,
}: Blog8Props) => {
  return (
    <section className="py-12 md:py-20">
      <div className="container flex flex-col items-center gap-16">
        <div className="text-center">
          <h2 className="mx-auto mb-6 text-pretty text-3xl font-semibold md:text-4xl lg:max-w-3xl text-white">
            {heading}
          </h2>
          <p className="mx-auto max-w-2xl text-white/90 md:text-lg">
            {description}
          </p>
        </div>

        <div className="grid gap-y-10 sm:grid-cols-12 sm:gap-y-12 md:gap-y-16 lg:gap-y-20">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="order-last sm:order-first sm:col-span-12 lg:col-span-10 lg:col-start-2 transition-all duration-300 hover:scale-[1.005] hover:shadow-xl dark:hover:shadow-indigo-500/10 bg-transparent rounded-xl overflow-hidden border border-white/10 hover:border-white/20"
            >
              <div className="grid gap-y-6 sm:grid-cols-10 sm:gap-x-5 sm:gap-y-0 md:items-center md:gap-x-8 lg:gap-x-12 p-4 sm:p-6">
                <div className="sm:col-span-5">
                  <div className="mb-4 md:mb-6">
                    <div className="flex flex-wrap gap-3 text-xs uppercase tracking-wider text-white/80 md:gap-5 lg:gap-6">
                      {post.tags?.map((tag) => <span key={tag} className="hover:text-white transition-colors">{tag}</span>)}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold md:text-2xl lg:text-3xl text-white">
                    <Link
                      href={post.url}
                      className="hover:underline decoration-1 underline-offset-4"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-4 text-white/90 md:mt-5">
                    {post.summary}
                  </p>
                  <div className="mt-6 flex items-center space-x-4 text-sm md:mt-8">
                    <span className="text-white/80">{post.author}</span>
                    <span className="text-white/80">•</span>
                    <span className="text-white/80">
                      {post.published}
                    </span>
                  </div>
                  <div className="mt-6 flex items-center space-x-2 md:mt-8">
                    <Link
                      href={post.url}
                      className="inline-flex items-center font-semibold text-white hover:underline decoration-1 underline-offset-4 md:text-base group"
                    >
                      <span>Read more</span>
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
                <div className="order-first sm:order-last sm:col-span-5">
                  <Link href={post.url} className="block overflow-hidden rounded-lg">
                    <div className="aspect-[16/9] overflow-hidden rounded-lg border border-white/10 transition-all duration-300 hover:shadow-md">
                      <ResponsiveImage
                        src={post.image}
                        alt={post.title}
                        className="h-full w-full object-cover transition-all duration-500 hover:scale-105 hover:opacity-90"
                      />
                    </div>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export { Blog8 };