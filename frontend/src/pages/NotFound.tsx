import { isRouteErrorResponse, useRouteError } from "react-router";
import { ButtonLink } from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <p className="text-sm font-semibold text-zinc-500">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">Page not found</h1>
      <p className="mt-2 text-sm text-zinc-500">The page you’re looking for doesn’t exist or has moved.</p>
      <ButtonLink to="/" variant="secondary" className="mt-6">
        Back to issues
      </ButtonLink>
    </div>
  );
}

export function RouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : (error as Error)?.message;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-xl font-semibold text-zinc-900">Something went wrong</h1>
      <p className="mt-2 max-w-md text-sm text-zinc-500">{message || "An unexpected error occurred."}</p>
      <a href="/" className="mt-6 text-sm font-medium text-zinc-900 underline underline-offset-4">
        Reload the app
      </a>
    </div>
  );
}
