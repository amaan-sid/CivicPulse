import type { IssueFilters as Filters } from "../features/issues/types";
import { CATEGORY_LABELS, PRIORITY_LABELS, SORT_LABELS, STATUS_LABELS } from "../utils/constants";
import { Select, inputClass } from "./ui/Field";
import { Icon } from "./ui/Icon";

type Props = {
  search: string;
  onSearch: (value: string) => void;
  filters: Filters;
  onChange: (key: keyof Filters, value: string) => void;
  onReset: () => void;
};

const options = (labels: Record<string, string>) =>
  Object.entries(labels).map(([value, label]) => (
    <option key={value} value={value}>
      {label}
    </option>
  ));

export default function IssueFilters({ search, onSearch, filters, onChange, onReset }: Props) {
  const active = Boolean(search || filters.status || filters.category || filters.priority);

  return (
    <div className="flex flex-col gap-3 border-b border-zinc-200 p-4 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
        <label htmlFor="issue-search" className="sr-only">
          Search issues
        </label>
        <input
          id="issue-search"
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by title, description or location"
          className={`${inputClass} border-zinc-300 pl-9 focus:border-zinc-900 focus:ring-zinc-900`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex">
        <Select aria-label="Status" value={filters.status ?? ""} onChange={(e) => onChange("status", e.target.value)} className="lg:w-36">
          <option value="">All statuses</option>
          {options(STATUS_LABELS)}
        </Select>
        <Select aria-label="Category" value={filters.category ?? ""} onChange={(e) => onChange("category", e.target.value)} className="lg:w-40">
          <option value="">All categories</option>
          {options(CATEGORY_LABELS)}
        </Select>
        <Select aria-label="Priority" value={filters.priority ?? ""} onChange={(e) => onChange("priority", e.target.value)} className="lg:w-36">
          <option value="">All priorities</option>
          {options(PRIORITY_LABELS)}
        </Select>
        <Select aria-label="Sort by" value={filters.sort ?? "severity"} onChange={(e) => onChange("sort", e.target.value)} className="lg:w-44">
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              Sort: {label}
            </option>
          ))}
        </Select>
      </div>

      {active && (
        <button onClick={onReset} className="self-start text-sm font-medium text-zinc-600 hover:text-zinc-900 lg:self-center">
          Clear
        </button>
      )}
    </div>
  );
}
