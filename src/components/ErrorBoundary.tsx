import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("ErrorBoundary caught error:", error, errorInfo);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null });
		window.location.href = "/";
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="flex min-h-screen items-center justify-center p-4">
					<div className="max-w-md space-y-4 text-center">
						<div className="space-y-2">
							<h1 className="text-2xl font-semibold text-foreground">
								Something went wrong
							</h1>
							<p className="text-sm text-muted-foreground">
								{this.state.error?.message || "An unexpected error occurred"}
							</p>
						</div>

						<div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
							<Button onClick={this.handleReset} variant="default">
								Reload Application
							</Button>
							<Button
								onClick={() => window.location.reload()}
								variant="outline"
							>
								Refresh Page
							</Button>
						</div>

						{process.env.NODE_ENV === "development" && this.state.error && (
							<details className="mt-4 text-left">
								<summary className="cursor-pointer text-sm font-medium">
									Error Details
								</summary>
								<pre className="mt-2 overflow-auto rounded-lg bg-muted p-4 text-xs">
									{this.state.error.stack}
								</pre>
							</details>
						)}
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}
