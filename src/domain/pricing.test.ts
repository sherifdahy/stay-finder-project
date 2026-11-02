
import { describe, expect, it } from "vitest";
import { buildQuote } from "./pricing";

describe("buildQuote", () => {
    it("calculates weekday nights correctly", () => {
        const quote = buildQuote(
            40000,
            "2026-12-06",
            "2026-12-08"
        );

        expect(quote.nights).toHaveLength(2);

        expect(quote.subtotal).toBe(80000);
        expect(quote.vat).toBe(12000);
        expect(quote.total).toBe(92000);
    });

    it("applies 25% increase on Thursday and Friday", () => {
        const quote = buildQuote(
            40000,
            "2026-12-09",
            "2026-12-12"
        );

        expect(quote.nights).toEqual([
            {
                date: "2026-12-09",
                rate: 40000,
                isWeekend: false,
            },
            {
                date: "2026-12-10",
                rate: 50000,
                isWeekend: true,
            },
            {
                date: "2026-12-11",
                rate: 50000,
                isWeekend: true,
            },
        ]);

        expect(quote.subtotal).toBe(140000);
        expect(quote.vat).toBe(21000);
        expect(quote.total).toBe(161000);
    });

    it("rounds VAT to the nearest halala", () => {
        const quote = buildQuote(
            1,
            "2026-12-06",
            "2026-12-07"
        );

        expect(quote.subtotal).toBe(1);
        expect(quote.vat).toBe(0);
        expect(quote.total).toBe(1);
    });

    it("handles stays crossing a month boundary", () => {
        const quote = buildQuote(
            40000,
            "2026-11-30",
            "2026-12-03"
        );

        expect(quote.nights.map((night) => night.date)).toEqual([
            "2026-11-30",
            "2026-12-01",
            "2026-12-02",
        ]);

        expect(quote.subtotal).toBe(120000);
        expect(quote.vat).toBe(18000);
        expect(quote.total).toBe(138000);
    });

    it("rejects stays longer than 14 nights", () => {
        expect(() =>
            buildQuote(40000, "2026-12-01", "2026-12-16")
        ).toThrow();
    });

    it("rejects invalid base rates", () => {
        expect(() =>
            buildQuote(-100, "2026-12-06", "2026-12-07")
        ).toThrow();
    });
});
