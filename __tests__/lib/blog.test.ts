import { getPost, getAllPosts, BlogPost } from '@/app/lib/blog';
import fs from 'fs';
import path from 'path';
import { vi } from 'vitest';

// Mock fs and path modules
vi.mock('fs');
vi.mock('path');

describe('Blog Utilities', () => {
  const mockMDXContent = `---
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

  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();
    
    // Mock path.join to return predictable paths
    (path.join as jest.Mock).mockImplementation((...args) => args.join('/'));
    
    // Mock fs.existsSync
    (fs.existsSync as jest.Mock).mockReturnValue(true);
  });

  describe('getPost', () => {
    it('should return static post when found', async () => {
      const post = await getPost('hiring-drone-photographers-real-estate');
      
      expect(post).toBeTruthy();
      expect(post?.id).toBe('post-1');
      expect(post?.title).toContain('Ultimate Guide');
    });

    it('should return MDX post when found', async () => {
      // Mock fs.readFileSync for MDX post
      (fs.readFileSync as jest.Mock).mockReturnValue(mockMDXContent);
      
      const post = await getPost('test-mdx-post');
      
      expect(post).toBeTruthy();
      expect(post?.id).toBe('mdx-post');
      expect(post?.content).toBeTruthy();
    });

    it('should return null for non-existent post', async () => {
      // Mock fs.readFileSync to throw error
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found');
      });
      
      const post = await getPost('non-existent');
      expect(post).toBeNull();
    });
  });

  describe('getAllPosts', () => {
    it('should return combined static and MDX posts', async () => {
      // Mock fs.readdirSync for MDX files
      (fs.readdirSync as jest.Mock).mockReturnValue(['test.mdx']);
      
      // Mock fs.readFileSync for MDX content
      (fs.readFileSync as jest.Mock).mockReturnValue(mockMDXContent);
      
      const posts = await getAllPosts();
      
      expect(posts.length).toBeGreaterThan(6); // 6 static posts + MDX posts
      expect(posts.some(post => post.id === 'mdx-post')).toBeTruthy();
      expect(posts.some(post => post.id === 'post-1')).toBeTruthy();
    });

    it('should handle missing MDX directory', async () => {
      // Mock fs.existsSync to return false
      (fs.existsSync as jest.Mock).mockReturnValue(false);
      
      const posts = await getAllPosts();
      
      expect(posts.length).toBe(6); // Only static posts
      expect(posts.every(post => post.id.startsWith('post-'))).toBeTruthy();
    });
  });
}); 