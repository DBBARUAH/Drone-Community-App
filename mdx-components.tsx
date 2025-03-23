import type { MDXComponents } from 'mdx/types'
import { MDXComponents as CustomMDXComponents } from './app/components/mdx/components'

// This file is required by Next.js when using MDX in the App Router
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...CustomMDXComponents
  }
} 