'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface TimedRedirectProps {
  delay: number; // Delay in milliseconds
  target: string; // Target URL path
}

export default function TimedRedirect({ delay, target }: TimedRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    console.log(`Redirecting to ${target} in ${delay / 1000} seconds...`);
    const timer = setTimeout(() => {
      console.log(`Executing redirect to ${target}`);
      router.push(target);
    }, delay);

    // Cleanup the timer if the component unmounts before the timeout finishes
    return () => clearTimeout(timer);
  }, [delay, target, router]); // Dependencies for the effect

  // This component doesn't render anything visual
  return null; 
} 