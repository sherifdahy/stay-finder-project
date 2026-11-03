"use client";

import { MapPin, Search, Users } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "cn";
import { Fragment, useState, type FormEvent } from "react";
import { z } from "zod";
import { useGetCitiesQuery } from "../../hotel.api";
import { hotelSearchSchema } from "@/src/domain/validations/hotel-search.schema";
import type { HotelSearchParams } from "../../search-params";
import StayDatePicker from "./stay-date-picker";
import { Button } from "@/src/shared/ui/button";
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

// Everything the search button applies; sort lives above the results.
export type SearchFormValues = Omit<HotelSearchParams, "sort">;

interface SearchFormProps extends SearchFormValues {
    className?: string;
    onSearch: (values: SearchFormValues) => void;
}

const ADULTS = [1, 2, 3, 4].map((count) => ({
    value: String(count),
    label: String(count),
}));

const STAR_OPTIONS = ["5", "4", "3", "2", "1"];

export function SearchForm(props: SearchFormProps) {
    const t = useTranslations("Search");
    const tFilters = useTranslations("Filters");
    const tCommon = useTranslations("Common");
    const tValidation = useTranslations("Validation");
    const locale = useLocale();
    const { data: citiesData } = useGetCitiesQuery();
    const starsAnchor = useComboboxAnchor();

    const [city, setCity] = useState<string>(props.city);
    // Until the names load, the select shows the code of the city in the URL.
    const cities = citiesData?.cities.map((item) => ({ value: item.code, label: item.name })) ?? [
        { value: city, label: city },
    ];
    const [checkIn, setCheckIn] = useState(props.checkIn);
    const [checkOut, setCheckOut] = useState(props.checkOut);
    const [adults, setAdults] = useState(String(props.adults));
    // The guest types SAR; the URL and the API use halalas.
    const [maxPrice, setMaxPrice] = useState(
        props.maxPrice === undefined ? "" : String(props.maxPrice / 100),
    );
    const [stars, setStars] = useState(props.stars.map(String));
    const [errors, setErrors] = useState<Record<string, string>>({});

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Same schema the API uses.
        const result = hotelSearchSchema.safeParse(
            {
                city,
                checkIn,
                checkOut,
                adults,
                maxPrice: maxPrice === "" ? undefined : Math.round(Number(maxPrice) * 100),
                stars: stars.join(","),
            },
            { error: z.locales[locale]().localeError },
        );

        if (!result.success) {
            const next: Record<string, string> = {};

            for (const issue of result.error.issues) {
                // Our own messages are keys; the zod defaults are already in the page language.
                next[String(issue.path[0])] ??= tValidation.has(issue.message as never)
                    ? tValidation(issue.message as never, (issue as { params?: unknown }).params as never)
                    : issue.message;
            }

            setErrors(next);
            return;
        }

        setErrors({});
        props.onSearch({
            city: result.data.city,
            checkIn: result.data.checkIn,
            checkOut: result.data.checkOut,
            adults: result.data.adults,
            maxPrice: result.data.maxPrice,
            stars: [...(result.data.stars ?? [])].sort(),
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={cn("flex flex-col gap-4 self-start md:sticky md:top-4", props.className)}
            noValidate
        >
            {/* h-8 matches the sort bar, so the card starts level with the results. */}
            <div className="flex h-8 items-center justify-end">
                <Button type="submit" size="sm">
                    <Search data-icon="inline-start" />
                    {t("submit")}
                </Button>
            </div>

            <Card>
                <CardContent className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="city">{t("city")}</Label>
                        <Select
                            modal={false}
                            items={cities}
                            value={city}
                            onValueChange={(value) => value && setCity(value)}
                        >
                            <SelectTrigger id="city" className="w-full">
                                <span className="flex items-center gap-2">
                                    <MapPin className="text-muted-foreground" />
                                    <SelectValue />
                                </span>
                            </SelectTrigger>
                            <SelectContent>
                                {cities.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="stay">{t("dates")}</Label>
                        <StayDatePicker
                            checkIn={checkIn}
                            checkOut={checkOut}
                            invalid={Boolean(errors.checkIn || errors.checkOut)}
                            onChange={(stay) => {
                                setCheckIn(stay.checkIn);
                                setCheckOut(stay.checkOut);
                                // A date error is about the old dates; the next search checks the new ones.
                                setErrors((current) => ({ ...current, checkIn: "", checkOut: "" }));
                            }}
                        />
                        {(errors.checkIn || errors.checkOut) && (
                            <p className="text-sm text-destructive">{errors.checkIn || errors.checkOut}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="adults">{t("adults")}</Label>
                        <Select
                            modal={false}
                            items={ADULTS}
                            value={adults}
                            onValueChange={(value) => value && setAdults(value)}
                        >
                            <SelectTrigger id="adults" className="w-full">
                                <span className="flex items-center gap-2">
                                    <Users className="text-muted-foreground" />
                                    <SelectValue />
                                </span>
                            </SelectTrigger>
                            <SelectContent>
                                {ADULTS.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="maxPrice">{tFilters("maxPrice")}</Label>
                        <Input
                            id="maxPrice"
                            type="number"
                            min={0}
                            placeholder={tFilters("anyPrice")}
                            value={maxPrice}
                            aria-invalid={Boolean(errors.maxPrice)}
                            onChange={(event) => setMaxPrice(event.target.value)}
                        />
                        {errors.maxPrice && (
                            <p className="text-sm text-destructive">{errors.maxPrice}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="stars">{tFilters("stars")}</Label>
                        <Combobox
                            multiple
                            openOnInputClick
                            items={STAR_OPTIONS}
                            value={stars}
                            onValueChange={setStars}
                        >
                            <ComboboxChips ref={starsAnchor}>
                                <ComboboxValue>
                                    {(values: string[]) => (
                                        <Fragment>
                                            {values.map((value) => (
                                                <ComboboxChip key={value}>{tCommon("stars", { count: Number(value) })}</ComboboxChip>
                                            ))}
                                            <ComboboxChipsInput
                                                id="stars"
                                                placeholder={values.length === 0 ? tFilters("anyRating") : ""}
                                            />
                                        </Fragment>
                                    )}
                                </ComboboxValue>
                            </ComboboxChips>
                            <ComboboxContent anchor={starsAnchor}>
                                <ComboboxEmpty>{tFilters("noRatings")}</ComboboxEmpty>
                                <ComboboxList>
                                    {(item: string) => (
                                        <ComboboxItem key={item} value={item}>
                                            {tCommon("stars", { count: Number(item) })}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
