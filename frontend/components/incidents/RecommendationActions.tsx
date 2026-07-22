"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { approveRecommendation, executeRecommendation } from "@/lib/recommendations";

interface RecommendationActionsProps {
  recommendationId: string;
  approved: boolean;
}

export function RecommendationActions({ recommendationId, approved }: RecommendationActionsProps) {
  const [isApproved, setIsApproved] = useState(approved);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    setLoading(true);
    try {
      await approveRecommendation(recommendationId);
      setIsApproved(true);
      setStatus("Approved");
    } catch {
      setStatus("Approval failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleExecute() {
    setLoading(true);
    try {
      const result = await executeRecommendation(recommendationId);
      setStatus(`Executed ${result.action_type}`);
    } catch {
      setStatus("Execution failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      {!isApproved ? (
        <Button size="sm" variant="outline" disabled={loading} onClick={() => void handleApprove()}>
          Approve
        </Button>
      ) : (
        <Button size="sm" disabled={loading} onClick={() => void handleExecute()}>
          Execute
        </Button>
      )}
      {status ? <span className="text-xs text-muted-foreground">{status}</span> : null}
    </div>
  );
}
