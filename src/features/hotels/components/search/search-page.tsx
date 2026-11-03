"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { skipToken } from "@reduxjs/toolkit/query";
import { isApiError } from "@/src/store/baseApi";
import { useSearchHotelsQuery } from "../../hotel.api";
import {
    parseSearchParams,
    serializeSearchParams,
    type HotelSearchParams,
} from "../../search-params";
import { HotelFilters } from "./hotel-filters";
import { HotelResults } from "./hotel-results";
import { SearchBar } from "./search-bar";

export function SearchPage() {
    const router = useRouter();
    const urlSearchParams = useSearchParams();

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

    return (
        <main className="container space-y-6 py-8">
            <header>
                <h1 className="text-3xl font-bold">Find your next stay</h1>
                <p className="mt-2 text-muted-foreground">
                    Search and compare available hotels.
                </p>
            </header>

            <SearchBar
                key={urlSearchParams.toString()}
                city={search.city}
                checkIn={search.checkIn}
                checkOut={search.checkOut}
                adults={search.adults}
                onSearch={(values) => updateUrl({ ...search, ...values }, "push")}
            />

            {!hasDates ? (
                <div className="rounded-xl border p-6 text-center">
                    Select your check-in and check-out dates to search for hotels.
                </div>
            ) : (
                <section className="grid gap-6 md:grid-cols-[260px_1fr]">
                    <HotelFilters
                        maxPrice={search.maxPrice}
                        stars={search.stars}
                        sort={search.sort}
                        onChange={(filters) =>
                            updateUrl({ ...search, ...filters }, "replace")
                        }
                    />

                    <HotelResults
                        hotels={currentData?.hotels ?? []}
                        stay={search}
                        isLoading={isFetching && !currentData}
                        error={isApiError(error) ? error : undefined}
                        onRetry={refetch}
                    />
                </section>
            )}
        </main>
    );
}
