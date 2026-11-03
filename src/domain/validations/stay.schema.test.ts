import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { staySchema } from "./stay.schema";
import { starsSchema } from "./stars.schema";

function parseStay(checkIn: string, checkOut: string) {
    return staySchema.safeParse({ checkIn, checkOut, adults: 2 });
}

describe("staySchema", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date("2026-06-01T12:00:00.000Z"));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("rejects a check-in date in the past", () => {
        const result = parseStay("2026-05-31", "2026-06-02");

        expect(result.success).toBe(false);
        expect(result.error?.issues[0].path).toEqual(["checkIn"]);
    });

    it("rejects a zero-night stay", () => {
        const result = parseStay("2026-06-10", "2026-06-10");

        expect(result.success).toBe(false);
        expect(result.error?.issues[0].path).toEqual(["checkOut"]);
    });

    it("rejects a 15-night stay", () => {
        expect(parseStay("2026-06-10", "2026-06-25").success).toBe(false);
    });

    it("accepts a 14-night stay", () => {
        expect(parseStay("2026-06-10", "2026-06-24").success).toBe(true);
    });

    it("rejects a date that does not exist in the calendar", () => {
        expect(parseStay("2026-02-30", "2026-03-02").success).toBe(false);
    });
});

describe("starsSchema", () => {
    it("parses a comma separated list", () => {
        expect(starsSchema.parse("4,5")).toEqual([4, 5]);
    });

    it("rejects out of range values", () => {
        expect(starsSchema.safeParse("4,6").success).toBe(false);
    });
});
