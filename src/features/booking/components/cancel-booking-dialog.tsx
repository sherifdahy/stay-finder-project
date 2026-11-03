import type { BookingView } from "@/src/domain/types/booking";
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

interface CancelBookingDialogProps {
    booking: BookingView | null;
    onConfirm: (booking: BookingView) => void;
    onClose: () => void;
}

export function CancelBookingDialog({ booking, onConfirm, onClose }: CancelBookingDialogProps) {
    return (
        <AlertDialog
            open={booking !== null}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) onClose();
            }}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {booking &&
                            `${booking.hotelName} · ${booking.roomName} · ${booking.checkIn} → ${booking.checkOut}`}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Keep booking</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={() => booking && onConfirm(booking)}
                    >
                        Cancel booking
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
