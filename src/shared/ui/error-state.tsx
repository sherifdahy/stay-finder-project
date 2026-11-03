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
        <Alert variant="destructive">
            <AlertTitle>{title ?? t("ClientErrors.unknown")}</AlertTitle>
            <AlertDescription>
                <p>{message}</p>

                {onRetry && (
                    <Button
                        type="button"
                        variant="outline"
                        className="mt-3"
                        onClick={onRetry}
                    >
                        {t("Common.tryAgain")}
                    </Button>
                )}
            </AlertDescription>
        </Alert>
    );
}
