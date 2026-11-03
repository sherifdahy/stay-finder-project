import { useEffect, useState } from "react";

export function useHoldCountdown(holdExpiresAt: string | null): number | null {
    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    if (now === null || !holdExpiresAt) return null;

    const msLeft = Date.parse(holdExpiresAt) - now;

    return Math.max(0, Math.ceil(msLeft / 1000));
}
