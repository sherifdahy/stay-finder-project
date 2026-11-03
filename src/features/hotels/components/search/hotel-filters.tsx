"use client";

import { Fragment } from "react";
import type { HotelSort } from "@/src/domain/validations/sort.schema";
import { Card, CardContent } from "@/src/shared/ui/card";
import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
    useComboboxAnchor,
} from "@/src/shared/ui/combobox";
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

const STAR_OPTIONS = ["5", "4", "3", "2", "1"];

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
    const starsAnchor = useComboboxAnchor();

    function changeStars(values: string[]) {
        onChange({ maxPrice, stars: values.map(Number).sort(), sort });
    }

    return (
        <Card className="self-start md:sticky md:top-4">
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

                <div className="space-y-1.5">
                    <Label htmlFor="stars">Stars</Label>
                    <Combobox
                        multiple
                        openOnInputClick
                        items={STAR_OPTIONS}
                        value={stars.map(String)}
                        onValueChange={changeStars}
                    >
                        <ComboboxChips ref={starsAnchor}>
                            <ComboboxValue>
                                {(values: string[]) => (
                                    <Fragment>
                                        {values.map((value) => (
                                            <ComboboxChip key={value}>{value} stars</ComboboxChip>
                                        ))}
                                        <ComboboxChipsInput
                                            id="stars"
                                            placeholder={values.length === 0 ? "Any rating" : ""}
                                        />
                                    </Fragment>
                                )}
                            </ComboboxValue>
                        </ComboboxChips>
                        <ComboboxContent anchor={starsAnchor}>
                            <ComboboxEmpty>No ratings found.</ComboboxEmpty>
                            <ComboboxList>
                                {(item: string) => (
                                    <ComboboxItem key={item} value={item}>
                                        {item} stars
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="sort">Sort by</Label>
                    <Select
                        modal={false}
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
