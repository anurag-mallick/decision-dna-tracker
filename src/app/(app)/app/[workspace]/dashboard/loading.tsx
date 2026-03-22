export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 w-48 rounded-md bg-zinc-800" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-zinc-800" />
        ))}
      </div>
      <div className="h-64 rounded-xl bg-zinc-800" />
    </div>
  );
}
