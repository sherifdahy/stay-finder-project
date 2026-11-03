import { useTranslations } from "next-intl";
import { formatMoney } from "@/src/shared/lib/format-money";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/src/shared/ui/alert-dialog";

interface PriceChangedDialogProps {
    open: boolean;
    oldTotal: number;
    newTotal: number;
    isSubmitting: boolean;
    onAccept: () => void;
    onCancel: () => void;
}

export function PriceChangedDialog({
    open,
    oldTotal,
    newTotal,
    isSubmitting,
    onAccept,
    onCancel,
}: PriceChangedDialogProps) {
    const t = useTranslations();

    return (
        <AlertDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) onCancel();
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t("Hotel.priceChanged")}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <span className="text-muted-foreground line-through">
                            {formatMoney(oldTotal)}
                        </span>{" "}
                        <span className="font-semibold text-foreground">
                            {formatMoney(newTotal)}
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isSubmitting}>{t("Hotel.goBack")}</AlertDialogCancel>
                    <AlertDialogAction disabled={isSubmitting} onClick={onAccept}>
                        {isSubmitting ? t("Common.reserving") : t("Hotel.acceptNewPrice")}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
