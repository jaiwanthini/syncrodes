import { apiFetch } from "@/lib/api";
import { Prediction } from "@/types/predictions";

export async function getPredictions(): Promise<Prediction[]> {
  return apiFetch<Prediction[]>("/api/predictions", { method: "GET" });
}
