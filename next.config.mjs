/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add this to support MDX
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  
  images: {
    domains: ['images.unsplash.com'],
  },
  // ... other configurations
};

export default nextConfig; 