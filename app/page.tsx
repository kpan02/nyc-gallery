export default function Page() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Gallery</h1>
      <p className="text-neutral-600">Coming soon — photos will appear here.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="aspect-[3/2] rounded bg-neutral-100" />
        ))}
      </div>
    </section>
  );
}
