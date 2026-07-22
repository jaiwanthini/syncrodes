import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

interface RootCausePanelProps {
  rootCause: string | null;
  confidenceScore: number | null;
}

export function RootCausePanel({ rootCause, confidenceScore }: RootCausePanelProps) {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Root Cause</CardTitle>
      </CardHeader>
      <CardContent>
        {!rootCause ? (
          <EmptyState title="Root cause pending" description="Run analysis or wait for RCA enrichment on this incident." />
        ) : (
          <div className="space-y-3">
            <p className="text-sm leading-relaxed text-foreground/90">{rootCause}</p>
            {confidenceScore != null ? (
              <Badge variant="secondary">Confidence {Math.round(confidenceScore)}%</Badge>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
