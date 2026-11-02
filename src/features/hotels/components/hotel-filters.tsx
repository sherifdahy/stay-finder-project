"use client";

import type { HotelSort } from "@/src/domain/validations/sort.schema";
import { Card, CardContent } from "@/src/shared/ui/card";
import { Checkbox } from "@/src/shared/ui/checkbox";
import { Input } from "@/src/shared/ui/input";
import { Label } from "@/src/shared/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/shared/ui/select";

interface Filters {
    maxPrice?: number;
    stars: number[];
    sort: HotelSort;
}

interface HotelFiltersProps extends Filters {
    onChange: (filters: Filters) => void;
}

const SORT_OPTIONS = [
    { value: "price", label: "Price" },
    { value: "rating", label: "Rating" },
];

export function HotelFilters({
    maxPrice,
    stars,
    sort,
    onChange,
}: HotelFiltersProps) {
    function toggleStar(star: number, checked: boolean) {
        const next = checked
            ? [...stars, star].sort()
            : stars.filter((value) => value !== star);

        onChange({ maxPrice, stars: next, sort });
    }

    return (
        <Card>
            <CardContent className="space-y-6">
                <div className="space-y-1.5">
                    <Label htmlFor="maxPrice">Max total price (SAR)</Label>
                    <Input
                        id="maxPrice"
                        type="number"
                        min={0}
                        placeholder="Any price"
                        value={maxPrice === undefined ? "" : maxPrice / 100}
                        onChange={(event) => {
                            const value = event.target.value;

                            onChange({
                                maxPrice:
                                    value === ""
                                        ? undefined
                                        : Math.round(Number(value) * 100),
                                stars,
                                sort,
                            });
                        }}
                    />
                </div>

                <fieldset className="space-y-2">
                    <legend className="mb-2 text-sm font-medium">Stars</legend>

                    {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className="flex items-center gap-2">
                            <Checkbox
                                id={`stars-${star}`}
                                checked={stars.includes(star)}
                                onCheckedChange={(checked) =>
                                    toggleStar(star, checked)
                                }
                            />
                            <Label htmlFor={`stars-${star}`}>{star} stars</Label>
                        </div>
                    ))}
                </fieldset>

                <div className="space-y-1.5">
                    <Label htmlFor="sort">Sort by</Label>
                    <Select
                        items={SORT_OPTIONS}
                        value={sort}
                        onValueChange={(value) =>
                            value &&
                            onChange({
                                maxPrice,
                                stars,
                                sort: value as HotelSort,
                            })
                        }
                    >
                        <SelectTrigger id="sort" className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {SORT_OPTIONS.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}
