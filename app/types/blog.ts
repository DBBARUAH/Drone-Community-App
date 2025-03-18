export interface BlogPost {
  title: string;
  date: string;
  author: string;
  excerpt?: string;
  tags: string[];
  label: string;
  image: string;
  summary: string;
  slug: string;
  content?: any;
}

export interface MDXFrontmatter {
  title: string;
  date: string;
  author: string;
  excerpt?: string;
  tags: string[];
  label: string;
  image: string;
  summary: string;
} 