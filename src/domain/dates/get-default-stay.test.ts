import { describe, expect, it } from "@jest/globals";
import { nights } from "./nights";
import { getDefaultStay } from "./get-default-stay";

describe("getDefaultStay", () => {
    it("checks in today and checks out after the longest allowed stay", () => {
        const stay = getDefaultStay(new Date("2026-12-06T12:00:00.000Z"));

        expect(stay).toEqual({ checkIn: "2026-12-06", checkOut: "2026-12-20" });
        expect(nights(stay.checkIn, stay.checkOut)).toBe(14);
    });

    it("crosses a month boundary", () => {
        const stay = getDefaultStay(new Date("2026-12-25T00:00:00.000Z"));

        expect(stay.checkOut).toBe("2027-01-08");
    });
});
