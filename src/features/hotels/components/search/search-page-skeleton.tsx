import { Skeleton } from "@/src/shared/ui/skeleton";

// Same blocks and heights as SearchPage, so nothing jumps when it renders.
export function SearchPageSkeleton() {
    return (
        <main className="container space-y-6 py-8" aria-busy="true">
            <header className="space-y-2">
                <Skeleton className="h-9 w-64 max-w-full" />
                <Skeleton className="h-5 w-80 max-w-full" />
            </header>

            <section className="grid gap-x-6 gap-y-4 md:grid-cols-[280px_1fr] md:grid-rows-[auto_1fr]">
                <div className="flex flex-col items-end gap-4 self-start md:col-start-1 md:row-span-2 md:row-start-1">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-[372px] w-full rounded-xl" />
                </div>
                <Skeleton className="h-8 w-full md:col-start-2 md:row-start-1" />
                <div className="min-w-0 md:col-start-2 md:row-start-2">
                    <HotelResultsSkeleton />
                </div>
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
