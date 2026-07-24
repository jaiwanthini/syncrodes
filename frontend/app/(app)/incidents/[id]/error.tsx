"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ErrorState } from "@/components/common/ErrorState";

export default function IncidentDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="space-y-4">
      <Link
        href="/incidents"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to incidents
      </Link>
      <ErrorState
        title="Couldn't load this incident"
        message="It may not exist, or the API is temporarily unavailable."
        onRetry={reset}
      />
    </div>
  );
}
