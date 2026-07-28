"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform
} from "framer-motion";
import {
  Check,
  X,
  Sparkles,
  Trophy,
  Flame,
  ArrowRight,
  Smile,
  Meh,
  Frown,
  AlertOctagon,
  Minus,
  Plus,
  SkipForward
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface QuestionItem {
  id: string;
  prompt?: string;
  text?: string;
  type: "YES_NO" | "SCALE" | "NUMERIC";
  category: "SYMPTOM" | "ADHERENCE";
  minLabel?: string | null;
  maxLabel?: string | null;
  minValue?: number | null;
  maxValue?: number | null;
  unit?: string | null;
}

export interface AnswerState {
  questionId: string;
  scaleValue?: number | null;
  booleanValue?: boolean | null;
  numericValue?: number | null;
  skipped: boolean;
}

interface CardDeckCheckinProps {
  questions: QuestionItem[];
  initialAnswers?: Record<string, AnswerState>;
  onComplete: (answers: AnswerState[]) => Promise<void>;
}

const CATEGORY_COLOR: Record<string, string> = {
  SYMPTOM: "#EF4444",
  ADHERENCE: "#34D399"
};

function getPainInfo(val: number) {
  if (val <= 2) return { icon: Smile, label: "Minimal", color: "#34D399" };
  if (val <= 5) return { icon: Meh, label: "Moderate", color: "#FBBF24" };
  if (val <= 8) return { icon: Frown, label: "Severe", color: "#F97316" };
  return { icon: AlertOctagon, label: "Critical", color: "#EF4444" };
}

export function CardDeckCheckin({
  questions,
  initialAnswers = {},
  onComplete
}: CardDeckCheckinProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] =
    useState<Record<string, AnswerState>>(initialAnswers);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const cardOpacity = useTransform(
    x,
    [-200, -120, 0, 120, 200],
    [0, 1, 1, 1, 0]
  );
  const yesOpacity = useTransform(x, [0, 80], [0, 1]);
  const noOpacity = useTransform(x, [-80, 0], [1, 0]);

  const currentQ = questions[currentIndex];
  const isLast = currentIndex >= questions.length;

  const updateAnswer = (updates: Partial<Omit<AnswerState, "questionId">>) => {
    if (!currentQ) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id]: {
        ...(prev[currentQ.id] || { questionId: currentQ.id, skipped: false }),
        skipped: false,
        ...updates
      }
    }));
  };

  const advance = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((p) => p + 1);
      x.set(0);
    } else {
      finish();
    }
  };

  const handleYes = () => {
    if (currentQ?.type === "YES_NO") updateAnswer({ booleanValue: true });
    advance();
  };
  const handleNo = () => {
    if (currentQ?.type === "YES_NO") updateAnswer({ booleanValue: false });
    else
      setAnswers((p) => ({
        ...p,
        [currentQ.id]: { questionId: currentQ.id, skipped: true }
      }));
    advance();
  };

  const finish = async () => {
    setSubmitting(true);
    try {
      await onComplete(Object.values(answers));
      setCompleted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Completion screen ── */
  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="mx-auto max-w-md space-y-7 rounded-3xl p-8 text-center"
        style={{
          background: "#111113",
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)"
        }}
      >
        {/* Animated check */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 16,
            delay: 0.1
          }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: "rgba(52,211,153,0.12)",
            border: "2px solid rgba(52,211,153,0.3)",
            boxShadow: "0 0 40px rgba(52,211,153,0.25)"
          }}
        >
          <Check className="h-10 w-10 stroke-[2.5] text-recovery" />
        </motion.div>

        <div className="space-y-2">
          <div className="bg-recovery/8 inline-flex items-center gap-1.5 rounded-full border border-recovery/20 px-3 py-1 text-xs font-medium text-recovery">
            <Sparkles className="h-3 w-3" /> Check-in complete
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Great work today.
          </h2>
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-text-muted">
            Your clinical metrics are logged and visible to your cardiologist.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-left">
          <div
            className="space-y-1.5 rounded-2xl p-4"
            style={{
              background: "rgba(251,191,36,0.07)",
              border: "1px solid rgba(251,191,36,0.18)"
            }}
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-warning">
              <Flame className="h-3.5 w-3.5" /> Streak
            </div>
            <p className="metric-number text-2xl font-bold text-warning">
              15 Days
            </p>
            <p className="text-[10px] text-warning/60">+1 day added</p>
          </div>
          <div
            className="space-y-1.5 rounded-2xl p-4"
            style={{
              background: "rgba(129,140,248,0.07)",
              border: "1px solid rgba(129,140,248,0.18)"
            }}
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-sleep">
              <Trophy className="h-3.5 w-3.5" /> Points
            </div>
            <p className="metric-number text-2xl font-bold text-sleep">+20</p>
            <p className="text-[10px] text-sleep/60">Gold tier progress</p>
          </div>
        </div>

        <Button
          onClick={() => (window.location.href = "/patient")}
          variant="recovery"
          className="w-full"
          size="lg"
        >
          Back to dashboard <ArrowRight className="h-4 w-4" />
        </Button>
      </motion.div>
    );
  }

  if (isLast || !currentQ) {
    return (
      <div className="py-16 text-center text-sm text-text-muted">
        {submitting ? "Submitting…" : "All questions answered."}
      </div>
    );
  }

  const prompt = currentQ.prompt || currentQ.text || "Health Question";
  const currentAns = answers[currentQ.id] || {
    questionId: currentQ.id,
    skipped: false
  };
  const progressPct = Math.round(((currentIndex + 1) / questions.length) * 100);
  const catColor = CATEGORY_COLOR[currentQ.category] ?? "#A1A1AA";

  return (
    <div className="mx-auto max-w-md space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-text-muted">
            {currentIndex + 1} of {questions.length}
          </span>
          <span style={{ color: catColor }}>{progressPct}%</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.07]">
          <motion.div
            className="h-full rounded-full"
            style={{ background: catColor }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>
      </div>

      {/* Card stack */}
      <div className="relative flex min-h-[400px] items-center justify-center">
        {/* Back card */}
        {currentIndex + 1 < questions.length && (
          <div
            className="pointer-events-none absolute inset-x-4 bottom-0 top-4 rounded-3xl"
            style={{
              background: "#0D0D0F",
              border: "1px solid rgba(255,255,255,0.05)",
              transform: "scale(0.95) translateY(8px)"
            }}
          />
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            style={{
              x,
              rotate,
              opacity: cardOpacity,
              background: "#111113",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.7)"
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) handleYes();
              else if (info.offset.x < -100) handleNo();
              else x.set(0);
            }}
            initial={{ scale: 0.94, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative flex min-h-[380px] w-full cursor-grab select-none flex-col gap-6 rounded-3xl p-6 active:cursor-grabbing sm:p-8"
            // eslint-disable-next-line react/jsx-no-duplicate-props
          >
            {/* Swipe badges */}
            <motion.div
              style={{ opacity: yesOpacity }}
              className="pointer-events-none absolute right-5 top-5 z-20 rounded-xl border-2 border-recovery bg-recovery/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-recovery"
            >
              YES
            </motion.div>
            <motion.div
              style={{ opacity: noOpacity }}
              className="pointer-events-none absolute left-5 top-5 z-20 rounded-xl border-2 border-danger bg-danger/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-danger"
            >
              NO
            </motion.div>

            {/* Header */}
            <div className="space-y-3">
              <span
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                style={{
                  background: `${catColor}12`,
                  color: catColor,
                  border: `1px solid ${catColor}25`
                }}
              >
                {currentQ.category}
              </span>
              <h3 className="text-xl font-semibold leading-snug tracking-tight text-foreground">
                {prompt}
              </h3>
              <p className="text-[11px] text-text-muted">
                Drag right for Yes · left for No · or tap below
              </p>
            </div>

            {/* Interactive body */}
            <div className="flex-1">
              {currentQ.type === "YES_NO" && (
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleNo}
                    className="transition-apple flex flex-col items-center justify-center gap-2 rounded-2xl py-5 text-sm font-semibold"
                    style={{
                      background:
                        currentAns.booleanValue === false
                          ? "rgba(239,68,68,0.14)"
                          : "rgba(255,255,255,0.03)",
                      border:
                        currentAns.booleanValue === false
                          ? "1px solid rgba(239,68,68,0.35)"
                          : "1px solid rgba(255,255,255,0.07)",
                      color:
                        currentAns.booleanValue === false
                          ? "#EF4444"
                          : "#71717A"
                    }}
                  >
                    <X className="h-6 w-6" /> No
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleYes}
                    className="transition-apple flex flex-col items-center justify-center gap-2 rounded-2xl py-5 text-sm font-semibold"
                    style={{
                      background:
                        currentAns.booleanValue === true
                          ? "rgba(52,211,153,0.14)"
                          : "rgba(255,255,255,0.03)",
                      border:
                        currentAns.booleanValue === true
                          ? "1px solid rgba(52,211,153,0.35)"
                          : "1px solid rgba(255,255,255,0.07)",
                      color:
                        currentAns.booleanValue === true ? "#34D399" : "#71717A"
                    }}
                  >
                    <Check className="h-6 w-6" /> Yes
                  </motion.button>
                </div>
              )}

              {currentQ.type === "SCALE" &&
                (() => {
                  const val =
                    currentAns.scaleValue ??
                    Math.round(
                      ((currentQ.minValue ?? 1) + (currentQ.maxValue ?? 10)) / 2
                    );
                  const info = getPainInfo(val);
                  const Icon = info.icon;
                  return (
                    <div className="space-y-6">
                      <motion.div
                        animate={{ borderColor: `${info.color}40` }}
                        className="flex items-center gap-3 rounded-2xl border px-4 py-3"
                        style={{ background: `${info.color}0a` }}
                      >
                        <Icon
                          className="h-5 w-5 shrink-0"
                          style={{ color: info.color }}
                        />
                        <div>
                          <span
                            className="text-sm font-semibold"
                            style={{ color: info.color }}
                          >
                            {info.label}
                          </span>
                          <span className="ml-2 text-xs text-text-muted">
                            Rating: {val}
                          </span>
                        </div>
                      </motion.div>

                      <div className="space-y-2 px-1">
                        <input
                          type="range"
                          min={currentQ.minValue ?? 1}
                          max={currentQ.maxValue ?? 10}
                          value={val}
                          onChange={(e) =>
                            updateAnswer({
                              scaleValue: parseInt(e.target.value)
                            })
                          }
                          className="w-full"
                          style={{ accentColor: info.color }}
                        />
                        <div className="flex justify-between text-[10px] text-text-muted">
                          <span>{currentQ.minLabel || "None"}</span>
                          <span>{currentQ.maxLabel || "Severe"}</span>
                        </div>
                      </div>

                      <Button
                        onClick={advance}
                        variant="secondary"
                        className="w-full"
                      >
                        Confirm rating <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })()}

              {currentQ.type === "NUMERIC" &&
                (() => {
                  const val = currentAns.numericValue ?? currentQ.minValue ?? 0;
                  const min = currentQ.minValue ?? 0;
                  const max = currentQ.maxValue ?? 999;
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-4">
                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.92 }}
                          onClick={() =>
                            updateAnswer({
                              numericValue: Math.max(min, val - 1)
                            })
                          }
                          className="transition-apple-fast flex h-12 w-12 items-center justify-center rounded-2xl"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.09)"
                          }}
                        >
                          <Minus className="h-4 w-4 text-text-secondary" />
                        </motion.button>

                        <div className="min-w-[80px] text-center">
                          <motion.p
                            key={val}
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="metric-number text-4xl font-bold tracking-tighter text-foreground"
                          >
                            {val}
                          </motion.p>
                          {currentQ.unit && (
                            <p className="mt-0.5 text-xs text-text-muted">
                              {currentQ.unit}
                            </p>
                          )}
                        </div>

                        <motion.button
                          type="button"
                          whileTap={{ scale: 0.92 }}
                          onClick={() =>
                            updateAnswer({
                              numericValue: Math.min(max, val + 1)
                            })
                          }
                          className="transition-apple-fast flex h-12 w-12 items-center justify-center rounded-2xl"
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.09)"
                          }}
                        >
                          <Plus className="h-4 w-4 text-text-secondary" />
                        </motion.button>
                      </div>

                      <Button
                        onClick={advance}
                        variant="secondary"
                        className="w-full"
                      >
                        Confirm value <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })()}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleNo}
          className="transition-apple-fast flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-medium text-text-muted hover:bg-white/[0.04] hover:text-foreground"
        >
          <SkipForward className="h-3.5 w-3.5" /> Skip
        </button>
        <div className="flex gap-2">
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleNo}
            className="transition-apple flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background: "rgba(239,68,68,0.10)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#EF4444"
            }}
          >
            <X className="h-5 w-5" />
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleYes}
            className="transition-apple flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background: "rgba(52,211,153,0.12)",
              border: "1px solid rgba(52,211,153,0.30)",
              color: "#34D399",
              boxShadow: "0 0 20px rgba(52,211,153,0.15)"
            }}
          >
            <Check className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
