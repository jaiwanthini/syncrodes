import { getRecommendations } from "@/lib/recommendations-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";
import { RecommendationActions } from "@/components/incidents/RecommendationActions";

interface RemediationPanelProps {
  incidentId: string;
}

export async function RemediationPanel({ incidentId }: RemediationPanelProps) {
  let recommendations: Awaited<ReturnType<typeof getRecommendations>> = [];
  try {
    recommendations = await getRecommendations(incidentId);
  } catch {
    recommendations = [];
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.length === 0 ? (
          <EmptyState title="No recommendations yet" description="Recommendations will be generated for this incident." />
        ) : (
          recommendations.map((rec) => (
            <div key={rec.id} className="rounded-lg border border-border/70 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="outline">{rec.action_type}</Badge>
                {rec.confidence_score != null ? (
                  <span className="text-xs text-muted-foreground">
                    Confidence {Math.round(rec.confidence_score)}%
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{rec.description}</p>
              <RecommendationActions recommendationId={rec.id} approved={rec.approved} />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
