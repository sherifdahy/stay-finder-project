import type { Money } from "@/src/domain/types/primitives";

export function formatMoney(halalas: Money): string {
    return new Intl.NumberFormat("en-SA", {
        style: "currency",
        currency: "SAR",
    }).format(halalas / 100);
}
