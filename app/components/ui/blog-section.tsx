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
  heading = "BLOG",
  description = "Revolutionary drone techniques that are reshaping the industry: Cutting-edge insights for businesses and creators who want to stay ahead",
  posts,
}: Blog8Props) => {
  return (
    <section className="pt-4 pb-12 md:pt-6 md:pb-16 lg:pt-8 lg:pb-20">
      <div className="container flex flex-col items-center gap-8 md:gap-12">
        <div className="text-center max-w-[900px] mx-auto px-4">
          <div className="flex flex-col items-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight 
              text-white uppercase mb-0 leading-none">
              {heading}
            </h2>
            <div className="mt-4 h-px w-40 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <p className="mt-4 text-base md:text-lg text-white/70 max-w-2xl leading-relaxed
              font-light tracking-wide">
              {description}
            </p>
          </div>
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