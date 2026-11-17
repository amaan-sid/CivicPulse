import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";

type Props = { page: number; totalPages: number; total: number; limit: number; onPage: (page: number) => void };

export default function Pagination({ page, totalPages, total, limit, onPage }: Props) {
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);

  return (
    <nav className="flex items-center justify-between border-t border-zinc-200 px-5 py-3" aria-label="Pagination">
      <p className="text-xs text-zinc-500">
        Showing <span className="font-medium text-zinc-700">{from}</span>–<span className="font-medium text-zinc-700">{to}</span> of{" "}
        <span className="font-medium text-zinc-700">{total}</span>
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page">
          <Icon name="chevronLeft" />
        </Button>
        <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)} aria-label="Next page">
          <Icon name="chevronRight" />
        </Button>
      </div>
    </nav>
  );
}
