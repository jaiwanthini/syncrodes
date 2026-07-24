import { apiFetchServer } from "@/lib/api-server";
import { Prediction } from "@/types/predictions";

export async function getPredictions(): Promise<Prediction[]> {
  return apiFetchServer<Prediction[]>("/api/predictions", { method: "GET" });
}
