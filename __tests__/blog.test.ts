import { getPost, getAllPosts } from '@/lib/blog';
import fs from 'fs';
import path from 'path';

describe('Blog functionality', () => {
  test('getAllPosts returns array of posts', async () => {
    const posts = await getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
    
    // Verify each post has required fields
    posts.forEach(post => {
      expect(post.id).toBeDefined();
      expect(post.title).toBeDefined();
      expect(post.slug).toBeDefined();
      expect(post.url).toBeDefined();
    });
  });

  test('getPost returns valid post for existing slug', async () => {
    const slug = 'drone-event-documentation';
    const post = await getPost(slug);
    
    expect(post).not.toBeNull();
    expect(post?.slug).toBe(slug);
    expect(post?.content).toBeDefined();
  });

  test('getPost returns null for non-existent slug', async () => {
    const post = await getPost('non-existent-post');
    expect(post).toBeNull();
  });

  test('Blog directory exists and contains MDX files', () => {
    const blogDir = path.join(process.cwd(), 'app/blog/content');
    expect(fs.existsSync(blogDir)).toBe(true);
    
    const files = fs.readdirSync(blogDir);
    const mdxFiles = files.filter(f => f.endsWith('.mdx'));
    expect(mdxFiles.length).toBeGreaterThan(0);
  });

  test('MDX content is properly compiled', async () => {
    const slug = 'drone-event-documentation';
    const post = await getPost(slug);
    
    expect(post).not.toBeNull();
    expect(post?.content).toBeDefined();
    
    // Test specific content features
    const content = post?.content as React.ReactNode;
    expect(content).toBeTruthy();
  });

  test('handles invalid MDX content gracefully', async () => {
    // Mock fs.readFileSync to return invalid MDX
    const originalReadFileSync = fs.readFileSync;
    fs.readFileSync = jest.fn().mockReturnValue(`
---
id: "test"
title: "Test"
summary: "Test"
label: "Test"
author: "Test"
published: "1 Jan 2024"
image: "/test.jpg"
tags: ["test"]
---

# Invalid <mdx> content
    `);

    const post = await getPost('test-post');
    expect(post).toBeNull();

    // Restore original fs.readFileSync
    fs.readFileSync = originalReadFileSync;
  });
}); 