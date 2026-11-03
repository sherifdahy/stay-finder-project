import { Skeleton } from "@/src/shared/ui/skeleton";

// Same blocks and heights as SearchPage, so nothing jumps when it renders.
export function SearchPageSkeleton() {
    return (
        <main className="container space-y-6 py-8" aria-busy="true">
            <header className="space-y-2">
                <Skeleton className="h-9 w-64 max-w-full" />
                <Skeleton className="h-5 w-80 max-w-full" />
            </header>

            <Skeleton className="h-[270px] w-full rounded-xl sm:h-40 lg:h-[86px]" />

            <section className="grid gap-6 md:grid-cols-[260px_1fr]">
                <Skeleton className="h-60 w-full self-start rounded-xl" />
                <HotelResultsSkeleton />
            </section>
        </main>
    );
}

export function HotelResultsSkeleton() {
    return (
        <div className="space-y-4" aria-busy="true">
            {[1, 2, 3].map((item) => (
                <Skeleton key={item} className="h-48 w-full" />
            ))}
        </div>
    );
}
