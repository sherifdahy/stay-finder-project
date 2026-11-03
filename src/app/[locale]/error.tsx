"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { ErrorState } from "@/src/shared/ui/error-state";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
    const t = useTranslations("ClientErrors");

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="container py-8">
            <ErrorState message={t("pageFailed")} onRetry={retry} />
        </main>
    );
}
