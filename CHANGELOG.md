# Changelog

## [1.0.0] - 2024-03-26

### Added
- New blog post handling system with TypeScript support
- MDX content processing pipeline
  - Added `remark-gfm` for GitHub Flavored Markdown
  - Added `rehype-highlight` for code syntax highlighting
  - Added `rehype-slug` for heading anchor links
- Caching system using React's `cache` function
- Custom error handling with `BlogError` type
- Frontmatter validation system
- Sorting functionality for blog posts by publication date

### Enhanced
- Error handling throughout the blog post pipeline
- Type safety with proper TypeScript interfaces
- Directory and file existence validation
- Debug logging system for better troubleshooting

### Fixed
- Removed undefined 'excerpt' and 'date' properties from blog post object
- Proper error handling for missing files
- Null checks for invalid blog posts
- Type safety for MDX frontmatter validation

### Technical Details
#### Types and Interfaces
- Added `BlogPost` interface for post structure
- Added `MDXFrontmatter` interface for frontmatter validation
- Added `MDXError` interface for MDX-specific errors
- Added `BlogError` interface for blog-specific errors

#### Required Frontmatter Fields
- id
- title
- published
- author
- summary
- image
- tags
- label

#### File Structure
- Blog posts stored in `app/blog/content` directory
- MDX files for content
- Automated slug generation from filenames

#### Performance
- Implemented caching for `getAllPosts` function
- Optimized post loading with Promise.all
- Added error boundary for failed post loads

### Dependencies
- next-mdx-remote
- gray-matter
- remark-gfm
- rehype-highlight
- rehype-slug 