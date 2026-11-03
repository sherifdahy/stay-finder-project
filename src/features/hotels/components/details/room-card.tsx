import { formatMoney } from "@/src/shared/lib/format-money";
import { Badge } from "@/src/shared/ui/badge";
import { Button } from "@/src/shared/ui/button";
import { Card } from "@/src/shared/ui/card";
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
        <Card className="p-4">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-lg font-semibold">{room.name}</h3>
                        <p className="text-sm text-muted-foreground">
                            Up to {room.maxGuests} guests ·{" "}
                            {room.refundable ? "Refundable" : "Non-refundable"}
                        </p>
                        <p className="text-sm">
                            {soldOut ? (
                                <span className="font-medium text-destructive">Sold out</span>
                            ) : (
                                `${room.unitsLeft} left`
                            )}
                        </p>
                    </div>

                    <div className="space-y-1 text-sm">
                        <p className="font-medium">Price per night</p>
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
                    </div>
                </div>

                <div className="flex flex-col items-end justify-between gap-4 text-right">
                    <div>
                        <p className="text-xs text-muted-foreground">Total for your stay</p>
                        <p className="text-xl font-bold">{formatMoney(room.quote.total)}</p>
                    </div>

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
                </div>
            </div>
        </Card>
    );
}
