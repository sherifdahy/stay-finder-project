import { getTranslations } from "next-intl/server";
import { Link } from "@/src/i18n/navigation";
import { buttonVariants } from "@/src/shared/ui/button";

export default async function NotFound() {
    const t = await getTranslations();

    return (
        <main className="container flex flex-1 flex-col items-center justify-center gap-4 py-8 text-center">
            <h1 className="text-page-title">{t("NotFound.title")}</h1>
            <p className="text-muted-foreground">{t("NotFound.text")}</p>
            <Link href="/" className={buttonVariants()}>
                {t("Common.backToSearch")}
            </Link>
        </main>
    );
}
