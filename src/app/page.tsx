import { Suspense } from "react";
import { SearchPage } from "@/src/features/hotels/components/search/search-page";

export default function HomePage() {
    return (
        <Suspense fallback={<main className="p-8">Loading search...</main>}>
            <SearchPage />
        </Suspense>
    );
}
