import { Link } from "react-router-dom";
import { Icon, Logo } from "../components/ui/Icon";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center">
      <Logo className="mb-6 size-9" />
      <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-zinc-500">
        The page you requested does not exist or has been moved.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          Dashboard
          <Icon name="arrowRight" className="size-3.5" />
        </Link>
        <Link
          to="/"
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          Home
        </Link>
      </div>
    </div>
  );
}

export function RouteError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center">
      <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
        <Icon name="alert" className="size-5" />
      </div>
      <h1 className="text-lg font-semibold text-zinc-900">Something went wrong</h1>
      <p className="mt-1.5 max-w-sm text-sm text-zinc-500">
        An unexpected error occurred while loading this page.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
      >
        Return Home
      </Link>
    </div>
  );
}
