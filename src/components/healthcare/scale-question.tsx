type ScaleQuestionProps = {
  label: string;
  minLabel?: string | null;
  maxLabel?: string | null;
  value?: number | null;
  onChange?: (value: number) => void;
  minValue?: number | null;
  maxValue?: number | null;
};

export function ScaleQuestion({
  label,
  minLabel = "None",
  maxLabel = "Severe",
  value,
  onChange,
  minValue = 1,
  maxValue = 10
}: ScaleQuestionProps) {
  const min = minValue ?? 1;
  const max = maxValue ?? 10;
  const total = max - min + 1;

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</p>
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {Array.from({ length: total > 0 ? total : 10 }).map((_, index) => {
          const num = min + index;
          const isSelected = value === num;
          return (
            <button
              key={num}
              type="button"
              onClick={() => onChange?.(num)}
              className={`aspect-square rounded-xl border text-xs font-bold transition-all ${
                isSelected
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm dark:border-blue-500"
                  : "border-slate-200 bg-white text-slate-800 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {num}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
        <span>{minLabel || "Min"}</span>
        <span>{maxLabel || "Max"}</span>
      </div>
    </div>
  );
}
