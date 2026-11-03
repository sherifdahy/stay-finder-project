import { Skeleton } from "@/src/shared/ui/skeleton";

export function CheckoutSkeleton() {
    return (
        <main className="container space-y-6 py-8" aria-busy="true">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-40 w-full" />
        </main>
    );
}
