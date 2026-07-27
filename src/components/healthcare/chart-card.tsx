"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

type ChartPoint = {
  label: string;
  value: number;
};

type ChartCardProps = {
  title: string;
  description: string;
  data: ChartPoint[];
};

export function ChartCard({ title, description, data }: ChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: -20, right: 12, top: 12, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(148, 163, 184, 0.15)"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "#94a3b8" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  fontSize: "12px",
                  padding: "8px 12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#2563eb" }}
                activeDot={{ r: 6, fill: "#2563eb" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
