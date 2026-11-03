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
    return (
        <AlertDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) onCancel();
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>The price has changed</AlertDialogTitle>
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
                    <AlertDialogCancel disabled={isSubmitting}>Go back</AlertDialogCancel>
                    <AlertDialogAction disabled={isSubmitting} onClick={onAccept}>
                        {isSubmitting ? "Reserving…" : "Accept new price"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
