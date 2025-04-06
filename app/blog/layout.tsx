// Delete this file or revert to its original state if it had other purposes 

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen pt-[80px] bg-background">
      {children}
    </div>
  );
} 