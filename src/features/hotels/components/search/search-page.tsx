"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/src/i18n/navigation";
import { isApiError } from "@/src/store/baseApi";
import { useSearchHotelsQuery } from "../../hotel.api";
import {
    parseSearchParams,
    serializeSearchParams,
    withDefaultStay,
    type HotelSearchParams,
} from "../../utils/search-params";
import { HotelResults } from "./hotel-results";
import { MobileSearchSheet } from "./mobile-search-sheet";
import { SearchForm } from "./search-form";
import { SortBar } from "./sort-bar";

export function SearchPage() {
    const t = useTranslations("Search");
    const router = useRouter();
    const urlSearchParams = useSearchParams();

    const search = withDefaultStay(
        parseSearchParams(new URLSearchParams(urlSearchParams.toString())),
    );

    // currentData (not data), so results of an older search never show.
    const { currentData, isFetching, error, refetch } =
        useSearchHotelsQuery(search);

    const isLoading = isFetching && !currentData;

    const formValues = {
        city: search.city,
        checkIn: search.checkIn,
        checkOut: search.checkOut,
        adults: search.adults,
        maxPrice: search.maxPrice,
        stars: search.stars,
    };

    // A new search is a new history entry; changing the sort is not.
    function updateUrl(next: HotelSearchParams, mode: "push" | "replace") {
        const url = `/?${serializeSearchParams(next).toString()}`;

        router[mode](url, { scroll: false });
    }

    return (
        // Extra bottom space on phones, so the floating search button never covers the last card.
        <main className="container space-y-6 py-8 max-md:pb-24">
            <header>
                <h1 className="text-page-title">{t("title")}</h1>
                <p className="mt-2 text-sm text-muted-foreground md:text-base">
                    {t("subtitle")}
                </p>
            </header>

            {/* The search button and the sort share the first row, so the sidebar card
                starts level with the results. The 1fr row keeps the form's height out of row one. */}
            <section className="grid gap-x-6 gap-y-4 md:grid-cols-[280px_1fr] md:grid-rows-[auto_1fr]">
                <SearchForm
                    key={urlSearchParams.toString()}
                    {...formValues}
                    className="hidden md:col-start-1 md:row-span-2 md:row-start-1 md:flex"
                    onSearch={(values) =>
                        updateUrl({ ...search, ...values }, "push")
                    }
                />

                <MobileSearchSheet
                    {...formValues}
                    className="md:hidden"
                    onSearch={(values) =>
                        updateUrl({ ...search, ...values }, "push")
                    }
                />

                <SortBar
                    // The empty state already says there are no hotels.
                    count={isLoading || error || !currentData?.hotels.length ? undefined : currentData.hotels.length}
                    sort={search.sort}
                    className="md:col-start-2 md:row-start-1"
                    onSortChange={(sort) =>
                        updateUrl({ ...search, sort }, "replace")
                    }
                />

                <div className="min-w-0 md:col-start-2 md:row-start-2">
                    <HotelResults
                        hotels={currentData?.hotels ?? []}
                        stay={search}
                        isLoading={isLoading}
                        error={isApiError(error) ? error : undefined}
                        onRetry={refetch}
                    />
                </div>
            </section>
        </main>
    );
}
