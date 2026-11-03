import { useTranslations } from "next-intl";
import type { BookingView } from "@/src/domain/types/booking";
import type { BookingStatus } from "@/src/domain/constants/booking-status";
import { formatMoney } from "@/src/shared/lib/format-money";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Card } from "@/src/shared/ui/card";

const STATUS_VARIANTS: Record<BookingStatus, "default" | "secondary" | "outline" | "destructive"> = {
    held: "outline",
    confirmed: "default",
    cancelled: "secondary",
    expired: "destructive",
};

interface BookingCardProps {
    booking: BookingView;
    onCancel: () => void;
}

export function BookingCard({ booking, onCancel }: BookingCardProps) {
    const t = useTranslations();
    const isConfirmed = booking.status === "confirmed";

    return (
        <Card className="gap-3 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold">{booking.hotelName}</h2>
                    <p className="text-sm text-muted-foreground">{booking.roomName}</p>
                    <p className="text-sm text-muted-foreground">
                        {booking.checkIn} → {booking.checkOut} · {t("Common.adults", { count: booking.adults })}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                        <Badge variant={STATUS_VARIANTS[booking.status]}>
                            {t(`Bookings.status.${booking.status}`)}
                        </Badge>
                        <Badge variant="outline">
                            {booking.refundable ? t("Common.refundable") : t("Common.nonRefundable")}
                        </Badge>
                    </div>
                </div>

                <div className="flex flex-col items-end justify-between gap-3 self-stretch">
                    <p className="text-xl font-bold">{formatMoney(booking.quote.total)}</p>

                    {isConfirmed && booking.refundable && (
                        <Button type="button" variant="destructive" onClick={onCancel}>
                            {t("Bookings.cancel")}
                        </Button>
                    )}
                </div>
            </div>

            {isConfirmed && !booking.refundable && (
                <p className="text-sm text-muted-foreground">
                    {t("Bookings.nonRefundableNote")}
                </p>
            )}
        </Card>
    );
}
