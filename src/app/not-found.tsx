import Link from "next/link";
import { buttonVariants } from "@/src/shared/ui/button";

export default function NotFound() {
    return (
        <main className="container space-y-4 py-8">
            <h1 className="text-2xl font-semibold">Page not found</h1>
            <p className="text-muted-foreground">The page you are looking for does not exist.</p>
            <Link href="/" className={buttonVariants()}>
                Back to search
            </Link>
        </main>
    );
}
