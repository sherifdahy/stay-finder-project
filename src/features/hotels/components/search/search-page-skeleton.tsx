import { Skeleton } from "@/src/shared/ui/skeleton";

// Same blocks and heights as SearchPage, so nothing jumps when it renders.
export function SearchPageSkeleton() {
    return (
        <main className="container space-y-6 py-8 max-md:pb-24" aria-busy="true">
            <header className="space-y-2">
                <Skeleton className="h-7 w-64 max-w-full sm:h-8 md:h-9" />
                <Skeleton className="h-5 w-80 max-w-full" />
            </header>

            <section className="grid gap-x-6 gap-y-4 md:grid-cols-[280px_1fr] md:grid-rows-[auto_1fr]">
                <div className="hidden flex-col items-end gap-4 self-start md:col-start-1 md:row-span-2 md:row-start-1 md:flex">
                    <Skeleton className="h-7 w-16 rounded-lg" />
                    <SearchFormSkeleton />
                </div>

                <div className="flex h-8 items-center justify-between md:col-start-2 md:row-start-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-48 rounded-lg" />
                </div>

                <div className="min-w-0 md:col-start-2 md:row-start-2">
                    <HotelResultsSkeleton />
                </div>
            </section>
        </main>
    );
}

// The sidebar card: five label and field pairs, at the real card's height.
function SearchFormSkeleton() {
    return (
        <div className="flex h-[372px] w-full flex-col gap-5 overflow-hidden rounded-xl border bg-card p-4">
            {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full rounded-lg" />
                </div>
            ))}
        </div>
    );
}

export function HotelResultsSkeleton() {
    return (
        <div className="space-y-4" aria-busy="true">
            {[1, 2, 3].map((item) => (
                <HotelCardSkeleton key={item} />
            ))}
        </div>
    );
}

// Mirrors HotelCard: image, name and stars, rating, city with amenities, then price and button.
function HotelCardSkeleton() {
    return (
        <div className="flex flex-col overflow-hidden rounded-xl border bg-card sm:flex-row">
            <Skeleton className="h-48 w-full rounded-none sm:h-auto sm:w-60" />

            <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-14" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                    <div className="flex items-center justify-between gap-2">
                        <Skeleton className="h-4 w-24" />
                        <div className="flex gap-2">
                            {[1, 2, 3].map((item) => (
                                <Skeleton key={item} className="size-8 rounded-lg" />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-end justify-between gap-3 border-t pt-4">
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-6 w-28" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
            </div>
        </div>
    );
}
