"use client";

import { useEffect } from "react";
import { ErrorState } from "@/src/shared/ui/error-state";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="container py-8">
            <ErrorState message="This page failed to load." onRetry={retry} />
        </main>
    );
}
