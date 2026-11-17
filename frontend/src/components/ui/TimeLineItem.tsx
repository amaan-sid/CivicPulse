interface Props {
  action: string;
  performedBy?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

function TimelineItem({ action, performedBy, oldValue, newValue, createdAt }: Props) {
  const dotColor =
    action.toLowerCase().includes("escalat")
      ? "bg-rose-500 ring-rose-100"
      : action.toLowerCase().includes("assign")
        ? "bg-indigo-500 ring-indigo-100"
        : "bg-emerald-500 ring-emerald-100";

  return (
    <div className="relative">
      <span
        className={`absolute -left-[25px] top-1.5 size-3 rounded-full ring-4 ${dotColor}`}
        aria-hidden="true"
      />
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-semibold capitalize text-slate-900">
            {action.replace(/[-_]/g, " ")}
          </p>
          <span className="text-xs text-slate-400">
            {new Date(createdAt).toLocaleString()}
          </span>
        </div>

        {performedBy && (
          <p className="mt-1 text-xs text-slate-600">
            By <span className="font-semibold text-slate-800">{performedBy}</span>
          </p>
        )}

        {(oldValue || newValue) && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
            {oldValue && (
              <span className="rounded-md bg-white px-2 py-0.5 text-slate-600 ring-1 ring-slate-200">
                {oldValue}
              </span>
            )}
            {oldValue && newValue && <span className="text-slate-400">→</span>}
            {newValue && (
              <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-medium text-indigo-700 ring-1 ring-indigo-200">
                {newValue}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TimelineItem;
