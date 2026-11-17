interface Props {
  action: string;
  performedBy?: string;
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

function TimelineItem({ action, performedBy, oldValue, newValue, createdAt }: Props) {
  const isEscalation = action.toLowerCase().includes("escalat");

  return (
    <div className="relative">
      <span
        className={`absolute -left-[25px] top-1.5 size-2.5 rounded-full ring-4 ring-white ${
          isEscalation ? "bg-red-600" : "bg-zinc-900"
        }`}
        aria-hidden="true"
      />
      <div className="rounded-lg border border-zinc-200 bg-zinc-50/60 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium capitalize text-zinc-900">
            {action.replace(/[-_]/g, " ")}
          </p>
          <span className="text-xs tabular-nums text-zinc-400">
            {new Date(createdAt).toLocaleString()}
          </span>
        </div>

        {performedBy && (
          <p className="mt-1 text-xs text-zinc-500">
            By <span className="font-medium text-zinc-800">{performedBy}</span>
          </p>
        )}

        {(oldValue || newValue) && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            {oldValue && (
              <span className="rounded bg-white px-2 py-0.5 text-zinc-600 ring-1 ring-zinc-200">
                {oldValue}
              </span>
            )}
            {oldValue && newValue && <span className="text-zinc-400">→</span>}
            {newValue && (
              <span className="rounded bg-zinc-900 px-2 py-0.5 font-medium text-white">
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
