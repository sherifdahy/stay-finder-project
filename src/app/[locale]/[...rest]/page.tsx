import { notFound } from "next/navigation";

// Unmatched URLs under a locale (e.g. /ar/foo) never reach [locale]/not-found.tsx on their own,
// so catch them here and throw notFound() to render it inside the locale layout.
export default function CatchAllPage() {
    notFound();
}
