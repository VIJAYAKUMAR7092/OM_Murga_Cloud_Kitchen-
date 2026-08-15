export default function Loading() {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        {/* Luxury Gold Spinner */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gold-500/20 border-t-primary" />
        <p className="font-serif text-lg text-primary animate-pulse-gold">Preparing...</p>
      </div>
    </div>
  );
}
