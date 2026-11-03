"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import { useState, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "@/src/i18n/navigation";
import { isApiError } from "@/src/store/baseApi";
import { useSearchHotelsQuery } from "../../hotel.api";
import {
    parseSearchParams,
    serializeSearchParams,
    type HotelSearchParams,
} from "../../search-params";
import { HotelFilters, type HotelFiltersValue } from "./hotel-filters";
import { HotelResults } from "./hotel-results";
import { SearchBar } from "./search-bar";

const FILTERS_DEBOUNCE_MS = 400;

export function SearchPage() {
    const t = useTranslations("Search");
    const router = useRouter();
    const urlSearchParams = useSearchParams();
    const [, startTransition] = useTransition();

    // Filters the user changed but that are not in the URL yet.
    const [draftFilters, setDraftFilters] =
        useState<HotelFiltersValue | null>(null);

    const search = parseSearchParams(
        new URLSearchParams(urlSearchParams.toString()),
    );

    const hasDates = Boolean(search.checkIn && search.checkOut);

    // currentData (not data), so results of an older filter never show.
    const { currentData, isFetching, error, refetch } = useSearchHotelsQuery(
        hasDates ? search : skipToken,
    );

    // A new search is a new history entry; tweaking filters is not.
    function updateUrl(next: HotelSearchParams, mode: "push" | "replace") {
        const url = `/?${serializeSearchParams(next).toString()}`;

        router[mode](url, { scroll: false });
    }

    const commitFilters = useDebouncedCallback(
        (filters: HotelFiltersValue) => {
            // One transition, so the draft clears in the same commit the URL
            // updates in: no flash of the old filter values or old results.
            startTransition(() => {
                updateUrl({ ...search, ...filters }, "replace");
                setDraftFilters(null);
            });
        },
        FILTERS_DEBOUNCE_MS,
    );

    const filters = draftFilters ?? {
        maxPrice: search.maxPrice,
        stars: search.stars,
        sort: search.sort,
    };

    return (
        <main className="container space-y-6 py-8">
            <header>
                <h1 className="text-3xl font-bold">{t("title")}</h1>
                <p className="mt-2 text-muted-foreground">
                    {t("subtitle")}
                </p>
            </header>

            <SearchBar
                key={urlSearchParams.toString()}
                city={search.city}
                checkIn={search.checkIn}
                checkOut={search.checkOut}
                adults={search.adults}
                onSearch={(values) => {
                    // A pending filter commit must not overwrite the new search.
                    commitFilters.cancel();
                    setDraftFilters(null);
                    updateUrl({ ...search, ...values }, "push");
                }}
            />

            {!hasDates ? (
                <div className="rounded-xl border p-6 text-center">
                    {t("selectDates")}
                </div>
            ) : (
                <section className="grid gap-6 md:grid-cols-[260px_1fr]">
                    <HotelFilters
                        {...filters}
                        onChange={(next) => {
                            setDraftFilters(next);
                            commitFilters(next);
                        }}
                    />

                    <HotelResults
                        hotels={currentData?.hotels ?? []}
                        stay={search}
                        isLoading={
                            draftFilters !== null ||
                            (isFetching && !currentData)
                        }
                        error={isApiError(error) ? error : undefined}
                        onRetry={refetch}
                    />
                </section>
            )}
        </main>
    );
}
