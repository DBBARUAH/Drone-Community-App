import { render, screen } from '@testing-library/react';
import BlogPostPage from '@/app/blog/[slug]/page';
import { getPost } from '@/app/lib/blog';
import { notFound } from 'next/navigation';

// Mock the blog utilities and next/navigation
vi.mock('@/app/lib/blog', () => ({
  getPost: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

describe('Blog Post Page', () => {
  const mockPost = {
    id: "test-1",
    title: "Test Post 1",
    summary: "Test summary 1",
    label: "Test",
    author: "Test Author",
    published: "2024-03-21",
    url: "/blog/test-1",
    image: "/images/test1.jpg",
    tags: ["test"],
    content: "# Test Content",
  };

  beforeEach(() => {
    vi.resetAllMocks();
    (getPost as jest.Mock).mockResolvedValue(mockPost);
  });

  it('renders blog post content', async () => {
    render(await BlogPostPage({ params: { slug: 'test-1' } }));

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('calls notFound for non-existent post', async () => {
    (getPost as jest.Mock).mockResolvedValue(null);

    await BlogPostPage({ params: { slug: 'non-existent' } });

    expect(notFound).toHaveBeenCalled();
  });
}); 