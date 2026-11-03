"use client";

import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";

interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
    const t = useTranslations();

    return (
        <Alert
            variant="destructive"
            className="min-h-64 content-center justify-items-center gap-2 py-8 text-center"
        >
            <AlertTitle className="text-base">
                {title ?? t("ClientErrors.unknown")}
            </AlertTitle>
            <AlertDescription className="flex flex-col items-center">
                <p>{message}</p>

                {onRetry && (
                    <Button
                        type="button"
                        variant="outline"
                        className="mt-1"
                        onClick={onRetry}
                    >
                        {t("Common.tryAgain")}
                    </Button>
                )}
            </AlertDescription>
        </Alert>
    );
}
