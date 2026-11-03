"use client";

import { useEffect } from "react";

// Replaces the root layout, so it can't use the store, the Tailwind setup or shared UI.
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <html lang="en">
            <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
                <h2>Something went wrong</h2>
                <p>The app failed to load.</p>
                <button type="button" onClick={() => retry()}>
                    Try again
                </button>
            </body>
        </html>
    );
}
