import { useEffect, useState } from "react";

export function useHoldCountdown(
    holdExpiresAt: string | null,
    serverTime: string | undefined,
    receivedAt: number | undefined,
): number | null {
    const [now, setNow] = useState<number | null>(null);

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    if (now === null || !holdExpiresAt || !serverTime || !receivedAt) return null;

    // Difference between the server clock and this device's clock.
    const offset = Date.parse(serverTime) - receivedAt;
    const msLeft = Date.parse(holdExpiresAt) - (now + offset);

    return Math.max(0, Math.ceil(msLeft / 1000));
}
