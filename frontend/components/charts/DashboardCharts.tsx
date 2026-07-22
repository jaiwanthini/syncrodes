"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CHART_COLORS = [
  "hsl(var(--destructive))",
  "hsl(var(--warning))",
  "hsl(var(--primary))",
  "hsl(var(--success))",
  "hsl(var(--muted-foreground))",
];

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

function ChartCard({ title, children }: ChartCardProps) {
  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-64">{children}</CardContent>
    </Card>
  );
}

interface IncidentTrendChartProps {
  data: { date: string; count: number }[];
}

export function IncidentTrendChart({ data }: IncidentTrendChartProps) {
  return (
    <ChartCard title="Incident Trend">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.75rem",
            }}
          />
          <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

interface SeverityDistributionChartProps {
  data: { severity: string; count: number }[];
}

export function SeverityDistributionChart({ data }: SeverityDistributionChartProps) {
  return (
    <ChartCard title="Severity Distribution">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="severity" innerRadius={50} outerRadius={80}>
            {data.map((entry, index) => (
              <Cell key={entry.severity} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.75rem",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

interface IncidentsByServiceChartProps {
  data: { service: string; count: number }[];
}

export function IncidentsByServiceChart({ data }: IncidentsByServiceChartProps) {
  return (
    <ChartCard title="Incidents by Service">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="service" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis allowDecimals={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.75rem",
            }}
          />
          <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

interface PredictionConfidenceChartProps {
  data: { service: string; confidence: number; risk: string }[];
}

export function PredictionConfidenceChart({ data }: PredictionConfidenceChartProps) {
  return (
    <ChartCard title="Prediction Confidence">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis type="category" dataKey="service" width={90} stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.75rem",
            }}
          />
          <Bar dataKey="confidence" fill="hsl(var(--warning))" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

interface DashboardChartsProps {
  trend: { date: string; count: number }[];
  severity: { severity: string; count: number }[];
  byService: { service: string; count: number }[];
  confidence: { service: string; confidence: number; risk: string }[];
}

export function DashboardCharts({ trend, severity, byService, confidence }: DashboardChartsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <IncidentTrendChart data={trend} />
      <SeverityDistributionChart data={severity} />
      <IncidentsByServiceChart data={byService} />
      <PredictionConfidenceChart data={confidence} />
    </div>
  );
}
