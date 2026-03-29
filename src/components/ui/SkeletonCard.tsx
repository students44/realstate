export default function SkeletonCard() {
  return (
    <div className="bg-foreground/5 rounded-2xl overflow-hidden border border-foreground/10 animate-pulse">
      <div className="h-64 bg-foreground/10 w-full"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-foreground/10 rounded w-3/4"></div>
        <div className="h-4 bg-foreground/10 rounded w-1/2"></div>
        <div className="py-4 border-t border-foreground/10 flex justify-between">
          <div className="h-4 bg-foreground/10 rounded w-1/4"></div>
          <div className="h-4 bg-foreground/10 rounded w-1/4"></div>
          <div className="h-4 bg-foreground/10 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}
