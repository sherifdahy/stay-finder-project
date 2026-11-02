import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";

interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = "Something went wrong",
    message,
    onRetry,
}: ErrorStateProps) {
    return (
        <Alert variant="destructive">
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>
                <p>{message}</p>

                {onRetry && (
                    <Button
                        type="button"
                        variant="outline"
                        className="mt-3"
                        onClick={onRetry}
                    >
                        Try again
                    </Button>
                )}
            </AlertDescription>
        </Alert>
    );
}
