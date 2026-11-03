import { Suspense } from "react";
import { SearchPage } from "@/src/features/hotels/components/search/search-page";
import { SearchPageSkeleton } from "@/src/features/hotels/components/search/search-page-skeleton";

export default function HomePage() {
    return (
        <Suspense fallback={<SearchPageSkeleton />}>
            <SearchPage />
        </Suspense>
    );
}
