"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] gap-6 text-center px-4 animate-fade-in">
      <div className="space-y-2">
        <h2 className="font-serif text-3xl font-bold text-primary">Something went wrong!</h2>
        <p className="text-muted-foreground">We apologize for the inconvenience.</p>
      </div>
      <button
        onClick={() => reset()}
        className="btn btn-primary"
      >
        Try again
      </button>
    </div>
  );
}
