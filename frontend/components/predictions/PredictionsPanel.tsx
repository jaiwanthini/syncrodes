import { getPredictions } from "@/lib/predictions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { riskBadgeVariant } from "@/lib/incident-display";
import { EmptyState } from "@/components/common/EmptyState";

export async function PredictionsPanel() {
  let predictions: Awaited<ReturnType<typeof getPredictions>> = [];
  try {
    predictions = await getPredictions();
  } catch {
    predictions = [];
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Predicted Risks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {predictions.length === 0 ? (
          <EmptyState
            title="No active risk predictions"
            description="CloudWatch metrics are within normal thresholds."
          />
        ) : (
          predictions.map((prediction) => (
            <div
              key={`${prediction.service}-${prediction.reason}`}
              className="rounded-lg border border-border/70 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{prediction.service}</p>
                <Badge variant={riskBadgeVariant(prediction.risk_level)}>{prediction.risk_level}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{prediction.reason}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
