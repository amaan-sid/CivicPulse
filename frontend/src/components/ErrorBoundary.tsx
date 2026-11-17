import { Component, type ErrorInfo, type ReactNode } from "react";
import { Icon } from "./ui/Icon";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message || "Unexpected rendering error" };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("UI ErrorBoundary caught:", error, info);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-6 text-center">
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-700">
          <Icon name="alert" className="size-5" />
        </div>
        <h1 className="text-lg font-semibold text-zinc-900">Something went wrong</h1>
        <p className="mt-1.5 max-w-md text-xs text-zinc-500">{this.state.message}</p>
        <button
          type="button"
          onClick={() => window.location.assign("/")}
          className="mt-6 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white hover:bg-zinc-800"
        >
          Reload application
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;

