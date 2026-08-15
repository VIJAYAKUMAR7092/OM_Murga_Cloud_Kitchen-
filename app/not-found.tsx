import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-6 text-center px-4 animate-fade-in">
      <div className="space-y-2">
        <h1 className="font-serif text-5xl font-bold text-primary">404</h1>
        <h2 className="font-serif text-2xl font-bold text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md">
          The dish you are looking for is currently off the menu or the page does not exist.
        </p>
      </div>
      <Link href="/" className="btn btn-primary">
        Return Home
      </Link>
    </div>
  );
}
