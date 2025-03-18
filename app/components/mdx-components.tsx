'use client';

import React from 'react';

export const MDXComponents = {
  // Tables with consistent styling
  table: (props: React.TableHTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto max-[640px]:my-4">
      <table {...props} className="w-full border-collapse font-playfair
        text-[14px] max-[640px]:text-[13px]" />
    </div>
  ),
  // Blockquotes that match your site's design
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote 
      {...props} 
      className="mt-6 border-l-2 border-muted pl-6 italic text-muted-foreground font-playfair
        max-[640px]:text-[15px] max-[640px]:pl-4 max-[640px]:mt-4" 
    />
  ),
  // Lists with consistent styling
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul 
      {...props} 
      className="my-3 sm:my-6 ml-3 sm:ml-6 list-disc font-playfair text-[17px] 
        leading-[1.7] text-[#ccc] marker:text-[14px]
        max-[640px]:text-[16px] max-[640px]:leading-[1.6] max-[640px]:marker:text-[11px]
        [&>li]:mt-2 max-[640px]:[&>li]:mt-1.5" 
    />
  ),
  // List items matching paragraph style
  li: (props: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li 
      {...props} 
      className="font-playfair text-[17px] leading-[1.7] text-[#ccc] pl-2
        max-[640px]:text-[16px] max-[640px]:leading-[1.6] max-[640px]:pl-1"
    />
  ),
  // Paragraphs with consistent text styling
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p 
      {...props} 
      className="font-playfair text-[17px] leading-[1.7] 
        text-[#ccc] [&:not(:first-child)]:mt-6
        max-[640px]:text-[16px] max-[640px]:leading-[1.6] max-[640px]:mt-3"
    />
  ),
  // Main heading (h1) with Oswald - skip if it matches the title
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => {
    // Skip rendering if it's the first h1 (which is typically the title)
    return null;
  },
  // Section heading (h2) with Oswald
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 
      {...props} 
      className="font-oswald text-[28px] font-[600] tracking-[1.5px] 
        leading-[1.2] uppercase text-white mt-8 sm:mt-10 first:mt-0 
        max-[640px]:text-[22px] max-[640px]:mt-6 max-[640px]:tracking-[1px]"
    />
  ),
  // Subsection heading (h3) with Oswald
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 
      {...props} 
      className="font-oswald text-[22px] font-[600] tracking-[1.5px] 
        leading-[1.2] uppercase text-white mt-6 sm:mt-8
        max-[640px]:text-[19px] max-[640px]:mt-5 max-[640px]:tracking-[0.8px]"
    />
  ),
}; 