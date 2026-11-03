"use client";

import { useTranslations } from "next-intl";
import { cn } from "cn";
import type { HotelSort } from "@/src/domain/validations/sort.schema";
import { Label } from "@/src/shared/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/shared/ui/select";

interface SortBarProps {
    // Undefined while the results load, so no stale count shows.
    count?: number;
    sort: HotelSort;
    className?: string;
    onSortChange: (sort: HotelSort) => void;
}

export function SortBar({ count, sort, className, onSortChange }: SortBarProps) {
    const t = useTranslations("Filters");
    const tSearch = useTranslations("Search");
    const sortOptions = (["price", "rating"] as const).map((value) => ({
        value,
        label: t(`sort.${value}`),
    }));

    return (
        <div className={cn("flex items-center justify-between gap-4", className)}>
            <p className="text-sm text-muted-foreground" aria-live="polite">
                {count !== undefined && tSearch("resultsCount", { count })}
            </p>

            <div className="flex items-center gap-2">
                <Label htmlFor="sort" className="whitespace-nowrap">
                    {t("sortBy")}
                </Label>
                <Select
                    modal={false}
                    items={sortOptions}
                    value={sort}
                    onValueChange={(value) => value && onSortChange(value as HotelSort)}
                >
                    <SelectTrigger id="sort" className="w-36">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {sortOptions.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
