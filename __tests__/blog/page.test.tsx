import { render, screen } from '@testing-library/react';
import BlogPage from '@/app/blog/page';
import { getAllPosts } from '@lib/blog';
import { vi } from 'vitest';

// Mock the blog utilities
vi.mock('@/app/lib/blog', () => ({
  getAllPosts: vi.fn(),
}));

describe('Blog Page', () => {
  const mockPosts = [
    {
      id: "test-1",
      title: "Test Post 1",
      summary: "Test summary 1",
      label: "Test",
      author: "Test Author",
      published: "2024-03-21",
      url: "/blog/test-1",
      image: "/images/test1.jpg",
      tags: ["test"],
    },
  ];

  beforeEach(() => {
    (getAllPosts as jest.Mock).mockResolvedValue(mockPosts);
  });

  it('renders blog posts', async () => {
    render(await BlogPage());

    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test summary 1')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  it('renders blog post images', async () => {
    render(await BlogPage());

    const image = screen.getByAltText('Test Post 1');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', expect.stringContaining('test1.jpg'));
  });
}); 