import { BedDouble, ShieldCheck, ShieldX, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { formatMoney } from "@/src/shared/lib/format-money";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Card } from "@/src/shared/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/src/shared/ui/collapsible";
import type { HotelRoom } from "../../dtos/details/hotel-room.dto";

interface RoomCardProps {
    room: HotelRoom;
    adults: number;
    isReserving: boolean;
    disabled: boolean;
    onReserve: () => void;
}

export function RoomCard({
    room,
    adults,
    isReserving,
    disabled,
    onReserve,
}: RoomCardProps) {
    const t = useTranslations();
    const soldOut = room.unitsLeft === 0;

    return (
        <Card className="gap-4 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                        <BedDouble className="size-5 text-muted-foreground" aria-hidden />
                        {room.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-1">
                            <Users className="size-4" aria-hidden />
                            {t("Hotel.upToGuests", { count: room.maxGuests })}
                        </p>
                        <p className="flex items-center gap-1">
                            {room.refundable ? (
                                <ShieldCheck className="size-4 text-emerald-600" aria-hidden />
                            ) : (
                                <ShieldX className="size-4" aria-hidden />
                            )}
                            {room.refundable ? t("Common.refundable") : t("Common.nonRefundable")}
                        </p>
                    </div>
                    <p className="text-sm">
                        {soldOut ? (
                            <span className="font-medium text-destructive">{t("Hotel.soldOut")}</span>
                        ) : (
                            t("Hotel.unitsLeft", { count: room.unitsLeft })
                        )}
                    </p>
                </div>

                <div className="text-end">
                    <p className="text-xs text-muted-foreground">{t("Hotel.totalForStay")}</p>
                    <p className="text-xl font-bold">{formatMoney(room.quote.total)}</p>
                </div>
            </div>

            <Collapsible>
                <CollapsibleTrigger className="text-sm font-medium underline underline-offset-4">
                    {t("Hotel.pricePerNight")}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-1 text-sm">
                    {room.quote.nights.map((night) => (
                        <div key={night.date} className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                {night.date}
                                {night.isWeekend && <Badge variant="secondary">{t("Hotel.weekend")}</Badge>}
                            </span>
                            <span>{formatMoney(night.rate)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between border-t pt-1">
                        <span>{t("Hotel.subtotal")}</span>
                        <span>{formatMoney(room.quote.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>{t("Hotel.vat")}</span>
                        <span>{formatMoney(room.quote.vat)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                        <span>{t("Common.total")}</span>
                        <span>{formatMoney(room.quote.total)}</span>
                    </div>
                </CollapsibleContent>
            </Collapsible>

            <div className="flex flex-col items-end gap-1">
                <Button
                    type="button"
                    disabled={!room.canAccommodate || soldOut || disabled}
                    onClick={onReserve}
                >
                    {isReserving ? t("Common.reserving") : t("Hotel.reserve")}
                </Button>
                {!room.canAccommodate && (
                    <p className="text-sm text-muted-foreground">
                        {t("Hotel.tooSmall", { count: adults })}
                    </p>
                )}
            </div>
        </Card>
    );
}
