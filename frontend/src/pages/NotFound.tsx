import { Link } from "react-router-dom";
import { Icon, Logo } from "../components/ui/Icon";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <Logo className="mb-6 size-11" />
      <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">404 · Not Found</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600">
        The link may be broken or the page may have moved. Head back to your workspace to continue managing community issues.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700"
        >
          Go to Dashboard
          <Icon name="arrowRight" className="size-4" />
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export function RouteError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
        <Icon name="alert" className="size-6" />
      </div>
      <h1 className="text-xl font-bold text-slate-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-slate-600">
        An unexpected error occurred while rendering this route.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Return Home
      </Link>
    </div>
  );
}
