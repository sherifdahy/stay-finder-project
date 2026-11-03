import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { buttonVariants } from "@/src/shared/ui/button";

export default async function NotFound() {
    const t = await getTranslations();

    return (
        <main className="container space-y-4 py-8">
            <h1 className="text-2xl font-semibold">{t("NotFound.title")}</h1>
            <p className="text-muted-foreground">{t("NotFound.text")}</p>
            <Link href="/" className={buttonVariants()}>
                {t("Common.backToSearch")}
            </Link>
        </main>
    );
}
