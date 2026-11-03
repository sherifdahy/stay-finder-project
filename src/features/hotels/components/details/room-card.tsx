import { BedDouble, ShieldCheck, ShieldX, Users } from "lucide-react";
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
                            Up to {room.maxGuests} guests
                        </p>
                        <p className="flex items-center gap-1">
                            {room.refundable ? (
                                <ShieldCheck className="size-4 text-emerald-600" aria-hidden />
                            ) : (
                                <ShieldX className="size-4" aria-hidden />
                            )}
                            {room.refundable ? "Refundable" : "Non-refundable"}
                        </p>
                    </div>
                    <p className="text-sm">
                        {soldOut ? (
                            <span className="font-medium text-destructive">Sold out</span>
                        ) : (
                            `${room.unitsLeft} left`
                        )}
                    </p>
                </div>

                <div className="text-right">
                    <p className="text-xs text-muted-foreground">Total for your stay</p>
                    <p className="text-xl font-bold">{formatMoney(room.quote.total)}</p>
                </div>
            </div>

            <Collapsible>
                <CollapsibleTrigger className="text-sm font-medium underline underline-offset-4">
                    Price per night
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 space-y-1 text-sm">
                    {room.quote.nights.map((night) => (
                        <div key={night.date} className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                {night.date}
                                {night.isWeekend && <Badge variant="secondary">Weekend</Badge>}
                            </span>
                            <span>{formatMoney(night.rate)}</span>
                        </div>
                    ))}
                    <div className="flex justify-between border-t pt-1">
                        <span>Subtotal</span>
                        <span>{formatMoney(room.quote.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>VAT 15%</span>
                        <span>{formatMoney(room.quote.vat)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
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
                    {isReserving ? "Reserving…" : "Reserve"}
                </Button>
                {!room.canAccommodate && (
                    <p className="text-sm text-muted-foreground">
                        Too small for {adults} guests
                    </p>
                )}
            </div>
        </Card>
    );
}
