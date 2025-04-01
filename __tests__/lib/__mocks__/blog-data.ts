import type { BlogPost } from '@/lib/blog';

export const mockBlogPosts: BlogPost[] = [
  {
    id: "post-1",
    title: "Ultimate Guide to Drone Photography",
    slug: "hiring-drone-photographers-real-estate",
    summary: "A comprehensive guide...",
    label: "Guide",
    author: "John Doe",
    published: "2024-03-21",
    image: "/images/drone-guide.jpg",
    tags: ["drone", "photography", "guide"],
    url: "/blog/hiring-drone-photographers-real-estate",
    content: "# Test Content"
  },
  // Add more mock posts as needed
];

export const mockMDXContent = `---
id: "mdx-post"
title: "MDX Test Post"
summary: "Test summary"
label: "Test"
author: "Test Author"
published: "2024-03-21"
image: "/images/test.jpg"
tags: ["test", "mdx"]
---

# Test Content`; 