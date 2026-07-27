type NumericQuestionProps = {
  label: string;
  unit?: string | null;
  placeholder?: string;
  value?: number | null;
  onChange?: (val: number | null) => void;
};

export function NumericQuestion({
  label,
  unit,
  placeholder,
  value,
  onChange
}: NumericQuestionProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</span>
      <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-white px-3.5 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 dark:border-slate-800 dark:bg-slate-900">
        <input
          type="number"
          step="any"
          className="min-w-0 flex-1 bg-transparent text-xs font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          placeholder={placeholder}
          value={value !== null && value !== undefined ? value : ""}
          onChange={(e) => {
            const val = e.target.value === "" ? null : parseFloat(e.target.value);
            onChange?.(val);
          }}
        />
        {unit && <span className="text-xs font-semibold text-slate-400">{unit}</span>}
      </div>
    </label>
  );
}
