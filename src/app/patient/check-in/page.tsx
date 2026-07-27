"use client";

import { useEffect, useState } from "react";
import { CardDeckCheckin, AnswerState, QuestionItem } from "@/components/healthcare/card-deck-checkin";
import { RoleShell } from "@/components/layout/role-shell";
import { LoadingSkeletons } from "@/components/layout/loading-skeletons";
import { useAuth } from "@/components/auth/auth-context";
import { patientNavItems } from "@/lib/patient-nav";
import { safeFetchJson } from "@/lib/api-client";

export default function PatientCheckInPage() {
  const { updatePatientData } = useAuth();
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [draftAnswers, setDraftAnswers] = useState<Record<string, AnswerState>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuestionsAndDraft() {
      try {
        setLoading(true);
        const res = await safeFetchJson<{ data?: QuestionItem[] }>("/api/patient/checklist");
        const qList: QuestionItem[] = res.data?.data || [];
        setQuestions(qList);

        // Fetch existing draft answers if present
        type DraftAnswerItem = { questionId: string; scaleValue?: number; booleanValue?: boolean; numericValue?: number; skipped?: boolean };
        const draftRes = await safeFetchJson<{ data?: { answers?: DraftAnswerItem[] } }>("/api/patient/checkin");
        if (draftRes.ok && draftRes.data?.data?.answers) {
          const initialMap: Record<string, AnswerState> = {};
          draftRes.data.data.answers.forEach((ans) => {
            initialMap[ans.questionId] = {
              questionId: ans.questionId,
              scaleValue: ans.scaleValue ?? null,
              booleanValue: ans.booleanValue ?? null,
              numericValue: ans.numericValue ?? null,
              skipped: ans.skipped ?? false,
            };
          });
          setDraftAnswers(initialMap);
        }
      } catch (err) {
        console.error("Error loading check-in questions:", err);
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadQuestionsAndDraft();
  }, []);

  const handleDeckComplete = async (submittedAnswers: AnswerState[]) => {
    setError(null);
    const response = await safeFetchJson("/api/patient/checkin/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId: "demo",
        answers: submittedAnswers,
      }),
    });

    if (!response.ok) {
      throw new Error(response.error || "Failed to submit check-in response.");
    }

    // Live update patient session state
    updatePatientData((prev) => ({
      ...prev,
      recoveryStatus: {
        ...prev.recoveryStatus,
        checkInStatus: "Completed",
        lastCheckIn: "Today at " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        streakDays: (prev.recoveryStatus?.streakDays || 14) + 1,
        completionScore: Math.min(100, (prev.recoveryStatus?.completionScore || 92) + 2),
      },
      badgeInfo: {
        ...prev.badgeInfo,
        points: (prev.badgeInfo?.points || 840) + 20,
      },
    }));
  };

  return (
    <RoleShell
      role="patient"
      title="Interactive Daily Check-In"
      description="Swipe through your daily health & symptom questionnaire."
      navItems={patientNavItems}
    >
      {loading ? (
        <div className="mx-auto max-w-lg space-y-6">
          <LoadingSkeletons />
        </div>
      ) : (
        <div className="space-y-6">
          {error && (
            <div className="mx-auto max-w-lg rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-300">
              {error}
            </div>
          )}

          <CardDeckCheckin
            questions={questions}
            initialAnswers={draftAnswers}
            onComplete={handleDeckComplete}
          />
        </div>
      )}
    </RoleShell>
  );
}

