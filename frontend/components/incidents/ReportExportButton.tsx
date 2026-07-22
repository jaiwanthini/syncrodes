"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { downloadIncidentReport } from "@/lib/reports";

interface ReportExportButtonProps {
  incidentId: string;
}

export function ReportExportButton({ incidentId }: ReportExportButtonProps) {
  const [loading, setLoading] = useState<"json" | "pdf" | null>(null);

  async function handleExport(format: "json" | "pdf") {
    setLoading(format);
    try {
      const blob = await downloadIncidentReport(incidentId, format);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `incident-${incidentId}.${format}`;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" disabled={loading !== null} onClick={() => void handleExport("json")}>
        {loading === "json" ? "Exporting..." : "Export JSON"}
      </Button>
      <Button size="sm" disabled={loading !== null} onClick={() => void handleExport("pdf")}>
        {loading === "pdf" ? "Exporting..." : "Export Report"}
      </Button>
    </div>
  );
}
