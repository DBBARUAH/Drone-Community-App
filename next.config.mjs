/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '**',
      },
    ],
  },
  webpack: (config) => {
    // Fix for "Can't resolve 'fs'" error
    config.resolve.fallback = { 
      ...config.resolve.fallback,
      fs: false,
      path: false
    };
    
    // Fix extension resolution
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
    };

    return config;
  },
  // Configure experimental features
  experimental: {}
}

// For development with Turbopack, use a simple configuration
export default nextConfig