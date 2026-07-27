"use client";

import { use, useEffect, useState } from "react";
import { Activity, CalendarCheck, FileText, HeartPulse } from "lucide-react";

import { ChartCard } from "@/components/healthcare/chart-card";
import { MetricCard } from "@/components/healthcare/metric-card";
import { SectionCard } from "@/components/healthcare/section-card";
import { Header } from "@/components/layout/header";
import { LoadingSkeletons } from "@/components/layout/loading-skeletons";
import { PageContainer } from "@/components/layout/page-container";
import { safeFetchJson } from "@/lib/api-client";

type PatientDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

interface PatientDetail {
  id: string;
  name: string;
  email: string;
  status: string;
  condition?: string;
  checkIns?: Array<{
    id: string;
    date: string;
    completed: boolean;
  }>;
  scores?: Array<{
    date: string;
    score: number;
    symptomIndex?: number;
    adherenceIndex?: number;
  }>;
}

interface ChartItem {
  date?: string;
  label?: string;
  score?: number;
  value?: number;
}

interface CheckInAnswerItem {
  id: string;
  date: string;
  answers: Array<{
    question: { prompt?: string; category?: string };
    scaleValue?: number | null;
    boolValue?: boolean | null;
    numericValue?: number | null;
    skipped?: boolean;
  }>;
}

export default function PatientDetailPage({ params }: PatientDetailPageProps) {
  const { id } = use(params);
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [chartData, setChartData] = useState<Array<{ label: string; value: number }>>([]);
  const [answersList, setAnswersList] = useState<CheckInAnswerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setErrors([]);
        const failures: string[] = [];
        const [patRes, chartRes, ansRes] = await Promise.all([
          safeFetchJson<{ data?: PatientDetail }>(`/api/doctor/patients/${id}`),
          safeFetchJson<{ data?: ChartItem[] }>(`/api/doctor/patients/${id}/charts`),
          safeFetchJson<{ data?: CheckInAnswerItem[] }>(`/api/doctor/patients/${id}/answers`)
        ]);

        if (patRes.ok) {
          setPatient(patRes.data?.data || null);
        } else {
          failures.push(patRes.error || "Failed to load patient record.");
        }

        if (chartRes.ok) {
          const items: ChartItem[] = chartRes.data?.data || [];
          const formatted = items.map((c) => ({
            label: c.label || (typeof c.date === "string" ? c.date.slice(5, 10) : "Day"),
            value: typeof c.value === "number" ? c.value : c.score || 70
          }));
          setChartData(formatted);
        } else {
          failures.push(chartRes.error || "Failed to load chart data.");
        }

        if (ansRes.ok) {
          setAnswersList(ansRes.data?.data || []);
        } else {
          failures.push(ansRes.error || "Failed to load check-in responses.");
        }

        setErrors(failures);
      } catch (err) {
        console.error("Error loading patient details:", err);
        setErrors(["Failed to load patient details."]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <PageContainer className="space-y-6">
        <Header
          eyebrow="Patient detail"
          title={`Patient ${id}`}
          description="Loading patient details and clinical chart data..."
        />
        <LoadingSkeletons />
      </PageContainer>
    );
  }

  const latestScore = patient?.scores?.[0]?.score ?? chartData[chartData.length - 1]?.value ?? 75;

  const metrics = [
    {
      label: "Health Index",
      value: `${latestScore}`,
      detail: "Composite wellness score",
      trend: "stable" as const,
      icon: Activity
    },
    {
      label: "Current Status",
      value: patient?.status || "Stable",
      detail: patient?.condition || "General Monitoring",
      trend: "stable" as const,
      icon: HeartPulse
    },
    {
      label: "Check-in Records",
      value: `${patient?.checkIns?.length || 0}`,
      detail: "Total logged entries",
      trend: "stable" as const,
      icon: FileText
    }
  ];

  return (
    <PageContainer className="space-y-6">
      <Header
        eyebrow="Patient detail"
        title={patient?.name || `Patient ${id}`}
        description={`Clinical overview and daily check-in history for ${patient?.email || id}`}
      />

      {errors.length > 0 && (
        <div
          role="alert"
          className="space-y-1 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300"
        >
          {errors.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <ChartCard
          title="Health Score Trajectory"
          description="Daily composite scores calculated from symptom and adherence check-ins."
          data={chartData}
        />

        <SectionCard
          title="Recent Responses"
          description="Patient check-in response log"
        >
          <div className="space-y-4">
            {answersList.slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-md border p-3 space-y-2 bg-background">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <CalendarCheck className="h-3.5 w-3.5" />
                  <span>
                    {new Date(item.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric"
                    })}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {item.answers.map((a, idx) => {
                    let valStr = "Skipped";
                    if (!a.skipped) {
                      if (a.boolValue !== null && a.boolValue !== undefined) valStr = a.boolValue ? "Yes" : "No";
                      else if (a.scaleValue !== null && a.scaleValue !== undefined) valStr = `Rating: ${a.scaleValue}`;
                      else if (a.numericValue !== null && a.numericValue !== undefined) valStr = `Value: ${a.numericValue}`;
                    }
                    return (
                      <div key={idx} className="flex justify-between">
                        <span>{a.question?.prompt || "Question"}:</span>
                        <span className="font-medium text-foreground">{valStr}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {answersList.length === 0 && (
              <div className="text-sm text-muted-foreground">No recent responses recorded.</div>
            )}
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}
