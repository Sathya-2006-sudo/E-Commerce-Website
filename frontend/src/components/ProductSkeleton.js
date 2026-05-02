export default function ProductSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 skeleton" />
        <div className="h-5 w-3/4 skeleton" />
        <div className="h-6 w-1/2 skeleton" />
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-4 w-4 skeleton rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
