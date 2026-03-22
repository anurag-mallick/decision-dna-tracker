export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-10 w-40 rounded-md bg-zinc-800" />
      <div className="h-10 rounded-md bg-zinc-800" />
      <div className="grid gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}
