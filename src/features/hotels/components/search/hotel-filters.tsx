"use client";

import { useTranslations } from "next-intl";
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
import type { HotelSearchParams } from "../../search-params";

export type HotelFiltersValue = Pick<
    HotelSearchParams,
    "maxPrice" | "stars" | "sort"
>;

interface HotelFiltersProps extends HotelFiltersValue {
    onChange: (filters: HotelFiltersValue) => void;
}

const STAR_OPTIONS = ["5", "4", "3", "2", "1"];

export function HotelFilters({
    maxPrice,
    stars,
    sort,
    onChange,
}: HotelFiltersProps) {
    const t = useTranslations("Filters");
    const tStars = useTranslations("Common");
    const starsAnchor = useComboboxAnchor();
    const sortOptions = (["price", "rating"] as const).map((value) => ({
        value,
        label: t(`sort.${value}`),
    }));

    function changeStars(values: string[]) {
        onChange({ maxPrice, stars: values.map(Number).sort(), sort });
    }

    return (
        <Card className="self-start md:sticky md:top-4">
            <CardContent className="space-y-6">
                <div className="space-y-1.5">
                    <Label htmlFor="maxPrice">{t("maxPrice")}</Label>
                    <Input
                        id="maxPrice"
                        type="number"
                        min={0}
                        placeholder={t("anyPrice")}
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
                    <Label htmlFor="stars">{t("stars")}</Label>
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
                                            <ComboboxChip key={value}>{tStars("stars", { count: Number(value) })}</ComboboxChip>
                                        ))}
                                        <ComboboxChipsInput
                                            id="stars"
                                            placeholder={values.length === 0 ? t("anyRating") : ""}
                                        />
                                    </Fragment>
                                )}
                            </ComboboxValue>
                        </ComboboxChips>
                        <ComboboxContent anchor={starsAnchor}>
                            <ComboboxEmpty>{t("noRatings")}</ComboboxEmpty>
                            <ComboboxList>
                                {(item: string) => (
                                    <ComboboxItem key={item} value={item}>
                                        {tStars("stars", { count: Number(item) })}
                                    </ComboboxItem>
                                )}
                            </ComboboxList>
                        </ComboboxContent>
                    </Combobox>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="sort">{t("sortBy")}</Label>
                    <Select
                        modal={false}
                        items={sortOptions}
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
                            {sortOptions.map((item) => (
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
