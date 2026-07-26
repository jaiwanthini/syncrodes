import { getPredictions } from "@/lib/predictions";

const RISK_COLOR: Record<string, string> = {
  medium: "text-amber-400",
  high: "text-red-400",
};

export async function PredictionsPanel() {
  const predictions = await getPredictions().catch(() => []);

  if (predictions.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5 text-sm text-neutral-500">
        No at-risk services right now.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5">
      <h2 className="mb-3 text-sm font-semibold">Predicted Risks</h2>
      <ul className="space-y-2">
        {predictions.map((p, i) => (
          <li key={i} className="flex items-center justify-between text-sm">
            <span>{p.service}</span>
            <span className={"text-xs " + RISK_COLOR[p.risk_level]}>{p.reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}