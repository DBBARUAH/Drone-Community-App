'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Blog post error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-red-600 mb-4">
        {error.message || 'Error loading blog post'}
      </p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
} 