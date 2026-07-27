"use client";

import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
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
  SkipForward,
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

export function CardDeckCheckin({
  questions,
  initialAnswers = {},
  onComplete,
}: CardDeckCheckinProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerState>>(initialAnswers);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Framer Motion drag mechanics for top card
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  const bgBadgeRight = useTransform(x, [0, 80], [0, 1]);
  const bgBadgeLeft = useTransform(x, [-80, 0], [1, 0]);

  const currentQ = questions[currentIndex];
  const isLast = currentIndex >= questions.length;

  const updateCurrentAnswer = (updates: Partial<Omit<AnswerState, "questionId">>) => {
    if (!currentQ) return;
    setAnswers((prev) => {
      const existing = prev[currentQ.id] || { questionId: currentQ.id, skipped: false };
      return {
        ...prev,
        [currentQ.id]: {
          ...existing,
          skipped: false,
          ...updates,
        },
      };
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      x.set(0);
    } else {
      finishCheckin();
    }
  };

  const handleSwipeRight = () => {
    if (!currentQ) return;
    if (currentQ.type === "YES_NO") {
      updateCurrentAnswer({ booleanValue: true });
    }
    handleNext();
  };

  const handleSwipeLeft = () => {
    if (!currentQ) return;
    if (currentQ.type === "YES_NO") {
      updateCurrentAnswer({ booleanValue: false });
    } else {
      setAnswers((prev) => ({
        ...prev,
        [currentQ.id]: { questionId: currentQ.id, skipped: true },
      }));
    }
    handleNext();
  };

  const finishCheckin = async () => {
    setSubmitting(true);
    try {
      const finalAnswers = Object.values(answers);
      await onComplete(finalAnswers);
      setCompleted(true);
    } catch (err) {
      console.error("Error submitting deck:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Render pain scale emoji indicator
  const getPainEmoji = (val: number) => {
    if (val <= 2) return { icon: Smile, label: "No / Mild Pain", color: "text-emerald-500" };
    if (val <= 5) return { icon: Meh, label: "Moderate Discomfort", color: "text-amber-500" };
    if (val <= 8) return { icon: Frown, label: "Severe Pain", color: "text-orange-500" };
    return { icon: AlertOctagon, label: "Unbearable", color: "text-rose-500" };
  };

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-xl rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-900 space-y-6"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 shadow-lg shadow-emerald-500/20">
          <Check className="h-10 w-10 stroke-[3]" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Sparkles className="h-3.5 w-3.5" />
            Check-In Complete!
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white sm:text-3xl">
            Great job on today&apos;s recovery entry!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Your clinical metrics have been logged and updated on your cardiologist&apos;s portal.
          </p>
        </div>

        {/* Rewards / Badges Earned */}
        <div className="grid grid-cols-2 gap-4 text-left pt-2">
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 dark:border-amber-900/60 dark:bg-amber-950/40 space-y-1">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs">
              <Flame className="h-4 w-4" />
              <span>Streak Boost</span>
            </div>
            <p className="text-xl font-extrabold text-amber-700 dark:text-amber-300">15 Days 🔥</p>
            <p className="text-[10px] text-amber-600 dark:text-amber-400">+1 Day added to recovery streak</p>
          </div>

          <div className="rounded-2xl border border-blue-200/80 bg-blue-50/60 p-4 dark:border-blue-900/60 dark:bg-blue-950/40 space-y-1">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
              <Trophy className="h-4 w-4" />
              <span>Adherence Points</span>
            </div>
            <p className="text-xl font-extrabold text-blue-700 dark:text-blue-300">+20 Points</p>
            <p className="text-[10px] text-blue-600 dark:text-blue-400">Gold Level Progress Updated</p>
          </div>
        </div>

        <Button
          onClick={() => window.location.href = "/patient"}
          className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25"
        >
          Return to Patient Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    );
  }

  if (isLast || !currentQ) {
    return (
      <div className="py-12 text-center text-slate-500">
        All questions completed! Submitting...
      </div>
    );
  }

  const prompt = currentQ.prompt || currentQ.text || "Health Question";
  const currentAns = answers[currentQ.id] || { questionId: currentQ.id, skipped: false };
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Card {currentIndex + 1} of {questions.length}</span>
          <span className="text-blue-600 dark:text-blue-400">{progressPercent}% Completed</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-blue-600"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Tinder Card Container */}
      <div className="relative min-h-[420px] w-full flex items-center justify-center">
        {/* Next Card Background Shadow */}
        {currentIndex + 1 < questions.length && (
          <div className="absolute inset-x-4 top-4 bottom-0 rounded-3xl border border-slate-200/60 bg-slate-100/80 dark:border-slate-800 dark:bg-slate-900/60 scale-[0.95] translate-y-3 pointer-events-none" />
        )}

        {/* Main Interactive Active Tinder Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 120) {
                handleSwipeRight();
              } else if (info.offset.x < -120) {
                handleSwipeLeft();
              }
            }}
            whileTap={{ cursor: "grabbing" }}
            className="relative w-full rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between select-none min-h-[400px]"
          >
            {/* Swipe Right Visual Overlay Badge */}
            <motion.div
              style={{ opacity: bgBadgeRight }}
              className="absolute top-6 right-6 rounded-2xl border-2 border-emerald-500 bg-emerald-50 px-4 py-1.5 font-black uppercase text-emerald-600 shadow-md dark:bg-emerald-950 dark:text-emerald-300 pointer-events-none z-20 text-xs tracking-wider"
            >
              YES / SUBMIT
            </motion.div>

            {/* Swipe Left Visual Overlay Badge */}
            <motion.div
              style={{ opacity: bgBadgeLeft }}
              className="absolute top-6 left-6 rounded-2xl border-2 border-rose-500 bg-rose-50 px-4 py-1.5 font-black uppercase text-rose-600 shadow-md dark:bg-rose-950 dark:text-rose-300 pointer-events-none z-20 text-xs tracking-wider"
            >
              SKIP / NO
            </motion.div>

            {/* Card Content Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-600 dark:bg-blue-950 dark:text-blue-300 uppercase tracking-wider">
                  {currentQ.category}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Swipe Left / Right or Tap</span>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
                {prompt}
              </h3>
            </div>

            {/* Card Content Interactive Body */}
            <div className="my-6">
              {currentQ.type === "YES_NO" && (
                <div className="space-y-4">
                  <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Tap to choose or drag card right for Yes / left for No
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        updateCurrentAnswer({ booleanValue: false });
                        handleNext();
                      }}
                      className={`flex h-16 flex-col items-center justify-center gap-1 rounded-2xl border font-bold text-xs transition-all ${
                        currentAns.booleanValue === false
                          ? "border-rose-500 bg-rose-600 text-white shadow-lg"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
                      }`}
                    >
                      <X className="h-5 w-5" />
                      <span>No</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        updateCurrentAnswer({ booleanValue: true });
                        handleNext();
                      }}
                      className={`flex h-16 flex-col items-center justify-center gap-1 rounded-2xl border font-bold text-xs transition-all ${
                        currentAns.booleanValue === true
                          ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
                      }`}
                    >
                      <Check className="h-5 w-5" />
                      <span>Yes</span>
                    </button>
                  </div>
                </div>
              )}

              {currentQ.type === "SCALE" && (
                <div className="space-y-5">
                  {(() => {
                    const currentVal = currentAns.scaleValue ?? 1;
                    const emojiInfo = getPainEmoji(currentVal);
                    const EmojiIcon = emojiInfo.icon;

                    return (
                      <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-800/60">
                          <EmojiIcon className={`h-6 w-6 ${emojiInfo.color}`} />
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            Rating: {currentVal} • {emojiInfo.label}
                          </span>
                        </div>

                        {/* Interactive Range Slider */}
                        <div className="space-y-1">
                          <input
                            type="range"
                            min={currentQ.minValue ?? 1}
                            max={currentQ.maxValue ?? 10}
                            value={currentVal}
                            onChange={(e) => updateCurrentAnswer({ scaleValue: parseInt(e.target.value) })}
                            className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                            <span>{currentQ.minLabel || "None (1)"}</span>
                            <span>{currentQ.maxLabel || "Severe (10)"}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {currentQ.type === "NUMERIC" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-xl"
                      onClick={() => {
                        const cur = currentAns.numericValue ?? 98;
                        updateCurrentAnswer({ numericValue: +(cur - 0.5).toFixed(1) });
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>

                    <div className="min-w-[120px] text-center bg-slate-50 dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">
                        {currentAns.numericValue !== null && currentAns.numericValue !== undefined
                          ? currentAns.numericValue
                          : "98.6"}
                      </span>
                      {currentQ.unit && (
                        <span className="block text-[10px] font-bold text-slate-400 uppercase">
                          {currentQ.unit}
                        </span>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-xl"
                      onClick={() => {
                        const cur = currentAns.numericValue ?? 98.6;
                        updateCurrentAnswer({ numericValue: +(cur + 0.5).toFixed(1) });
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer Actions */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSwipeLeft}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <SkipForward className="mr-1.5 h-3.5 w-3.5" /> Skip
              </Button>

              <Button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 shadow-sm"
              >
                {currentIndex === questions.length - 1 ? (
                  submitting ? "Submitting..." : "Finish Check-in"
                ) : (
                  <>Next Question <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation Tip */}
      <p className="text-center text-[11px] text-slate-400 font-medium">
        💡 Tip: Drag card left or right, or use the action buttons to advance.
      </p>
    </div>
  );
}
