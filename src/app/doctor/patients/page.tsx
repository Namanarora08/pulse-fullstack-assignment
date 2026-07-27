"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";

import { EmptyState } from "@/components/layout/empty-state";
import { Header } from "@/components/layout/header";
import { LoadingSkeletons } from "@/components/layout/loading-skeletons";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { safeFetchJson } from "@/lib/api-client";

interface PatientRow {
  id: string;
  name: string;
  email?: string;
  status?: string;
  condition?: string;
  checkIns?: Array<{ completed: boolean; date: string }>;
}

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<PatientRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPatients() {
      try {
        setLoading(true);
        const url = searchQuery
          ? `/api/doctor/patients?q=${encodeURIComponent(searchQuery)}`
          : "/api/doctor/patients";
        const res = await safeFetchJson<{ data?: PatientRow[] }>(url);
        if (res.ok && res.data) {
          setPatients(res.data.data || []);
        }
      } catch (err) {
        console.error("Error loading patient list:", err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadPatients, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <PageContainer className="space-y-6">
      <Header
        eyebrow="Patients"
        title="Patient roster"
        description="Monitor assigned patient records, current risk status, and check-in history."
      />

      <div className="flex h-11 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-3.5 shadow-sm transition-all focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 dark:border-slate-800 dark:bg-slate-900">
        <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
        <input
          type="text"
          placeholder="Search patients by name, email or condition..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
        />
      </div>

      {loading ? (
        <LoadingSkeletons />
      ) : patients.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {patients.map((patient) => {
                const latestCheckIn = patient.checkIns?.[0];
                const checkInLabel = latestCheckIn
                  ? latestCheckIn.completed
                    ? "Completed today"
                    : "Pending check-in"
                  : "No check-ins";

                const isWatch =
                  patient.status === "Watch" || patient.status === "Deteriorating";

                return (
                  <div
                    key={patient.id}
                    className="grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                  >
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {patient.condition || "General Monitoring"} • Check-in:{" "}
                        {checkInLabel}
                      </p>
                    </div>
                    <Badge
                      variant={isWatch ? "warning" : "secondary"}
                      className="w-fit"
                    >
                      {patient.status || "Stable"}
                    </Badge>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/doctor/patients/${patient.id}`}>
                        Open
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          title="No patients found"
          description="Try adjusting your search terms or filter parameters."
        />
      )}
    </PageContainer>
  );
}
