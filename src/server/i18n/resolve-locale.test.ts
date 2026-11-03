import { describe, expect, it } from "@jest/globals";
import { resolveLocale } from "./resolve-locale";

describe("resolveLocale", () => {
    it("falls back to English without a header", () => {
        expect(resolveLocale(null)).toBe("en");
        expect(resolveLocale("")).toBe("en");
    });

    it("matches a regional tag to its language", () => {
        expect(resolveLocale("ar-SA,ar;q=0.9,en;q=0.8")).toBe("ar");
    });

    it("prefers the highest q", () => {
        expect(resolveLocale("en;q=0.4,ar;q=0.9")).toBe("ar");
    });

    it("skips languages we do not support", () => {
        expect(resolveLocale("fr,en;q=0.5")).toBe("en");
        expect(resolveLocale("fr")).toBe("en");
    });

    it("ignores a wildcard and q=0", () => {
        expect(resolveLocale("*")).toBe("en");
        expect(resolveLocale("ar;q=0,en")).toBe("en");
    });
});
