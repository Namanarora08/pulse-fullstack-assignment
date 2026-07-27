"use client";

import {
  Utensils,
  Droplets,
  Flame,
  Plus,
  Minus,
  Check,
  Stethoscope,
} from "lucide-react";
import { RoleShell } from "@/components/layout/role-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-context";
import { PatientRecord } from "@/lib/auth";
import { patientNavItems } from "@/lib/patient-nav";

export default function PatientDietPage() {
  const { user, updatePatientData } = useAuth();
  const patient = (user as PatientRecord) || null;

  const dietPlan = patient?.dietPlan || {
    type: "Mediterranean Cardiac Recovery Diet",
    dailyCalories: "1,800 - 2,000 kcal",
    sodiumLimit: "< 2,000 mg / day",
    hydrationTarget: "2.5 Liters daily",
    recommendations: [
      "Include rich omega-3 fatty acids (salmon, walnuts, olive oil)",
      "Avoid high-sodium processed foods and fried items",
      "Maintain lean protein and fiber intake across meals",
    ],
    meals: [],
  };

  const vitals = patient?.vitals || {
    waterIntakeLiters: 1.75,
    waterTargetLiters: 2.5,
  };

  const meals = dietPlan.meals || [];

  const toggleMeal = (mealId: string) => {
    updatePatientData((prev) => {
      const updatedMeals = (prev.dietPlan?.meals || []).map((m) => {
        if (m.id === mealId) {
          return { ...m, completed: !m.completed };
        }
        return m;
      });
      return {
        ...prev,
        dietPlan: {
          ...prev.dietPlan,
          meals: updatedMeals,
        },
      };
    });
  };

  const handleWaterChange = (delta: number) => {
    updatePatientData((prev) => {
      const current = prev.vitals?.waterIntakeLiters || 0;
      const target = prev.vitals?.waterTargetLiters || 2.5;
      const updated = Math.max(0, Math.min(target + 1.0, +(current + delta).toFixed(2)));
      return {
        ...prev,
        vitals: {
          ...prev.vitals,
          waterIntakeLiters: updated,
        },
      };
    });
  };

  const totalCalories = meals.reduce((acc, m) => acc + (m.completed ? m.calories : 0), 0);

  return (
    <RoleShell
      role="patient"
      title="Diet & Hydration Plan"
      description="Personalized cardiac nutrition plan, meal schedules, and hydration tracking."
      navItems={patientNavItems}
    >
      <div className="space-y-6">
        {/* Diet Plan Overview Header */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Utensils className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              {dietPlan.type}
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Daily Meal & Hydration Tracker
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Daily Target: <strong>{dietPlan.dailyCalories}</strong> • Sodium Limit: <strong>{dietPlan.sodiumLimit}</strong>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Logged Calories</p>
              <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{totalCalories} kcal</p>
            </div>
            <Flame className="h-6 w-6 text-emerald-500" />
          </div>
        </div>

        {/* Doctor Recommendations Box */}
        <div className="rounded-2xl border border-blue-200/80 bg-blue-50/50 p-5 dark:border-blue-900/40 dark:bg-blue-950/20 space-y-2">
          <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 font-bold text-xs">
            <Stethoscope className="h-4 w-4 text-blue-600" />
            <span>Doctor Instructions & Nutrition Guidance</span>
          </div>
          <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1 pl-1">
            {dietPlan.recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>

        {/* Hydration Goal Section */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-cyan-500" />
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Water Intake Goal</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Target: {dietPlan.hydrationTarget}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                {vitals.waterIntakeLiters} L / {vitals.waterTargetLiters} L
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-lg text-xs"
                  onClick={() => handleWaterChange(-0.25)}
                >
                  <Minus className="h-3 w-3 mr-1" /> -250ml
                </Button>
                <Button
                  size="sm"
                  className="h-8 rounded-lg text-xs bg-cyan-600 hover:bg-cyan-700 text-white"
                  onClick={() => handleWaterChange(0.25)}
                >
                  <Plus className="h-3 w-3 mr-1" /> +250ml
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                style={{ width: `${Math.min(100, (vitals.waterIntakeLiters / vitals.waterTargetLiters) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Meals Schedule Cards */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Daily Meals Schedule</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md">
                      {meal.meal}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {meal.calories} kcal
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 dark:text-white text-base">{meal.title}</h4>

                  <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    {meal.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>

                  <p className="text-[11px] italic text-slate-500 dark:text-slate-400 border-t border-slate-100 pt-2 dark:border-slate-800">
                    {meal.instructions}
                  </p>
                </div>

                <Button
                  type="button"
                  variant={meal.completed ? "default" : "outline"}
                  size="sm"
                  className={`w-full rounded-xl font-medium ${
                    meal.completed
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "border-slate-300 dark:border-slate-700"
                  }`}
                  onClick={() => toggleMeal(meal.id)}
                >
                  {meal.completed ? (
                    <>
                      <Check className="mr-2 h-4 w-4" /> Meal Logged & Completed
                    </>
                  ) : (
                    "Mark Meal Completed"
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RoleShell>
  );
}
