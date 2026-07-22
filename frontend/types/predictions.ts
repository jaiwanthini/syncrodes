export interface Prediction {
    service: string;
    risk_level: "medium" | "high";
    reason: string;
  }