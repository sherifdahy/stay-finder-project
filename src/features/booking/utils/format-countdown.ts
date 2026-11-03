export function formatCountdown(seconds: number | null): string {
    if (seconds === null) return "--:--";

    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");

    return `${mm}:${ss}`;
}
