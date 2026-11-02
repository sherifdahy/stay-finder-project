/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import type { Hotel } from "@/src/domain/types/hotel";
import { formatMoney } from "@/src/shared/lib/format-money";
import { Badge } from "@/src/shared/ui/badge";
import { buttonVariants } from "@/src/shared/ui/button";
import { Card } from "@/src/shared/ui/card";
import { hotelHref, type HotelSearchParams } from "../search-params";

interface HotelCardProps {
    hotel: Hotel & { fromTotal: number };
    stay: Pick<HotelSearchParams, "checkIn" | "checkOut" | "adults">;
}

export function HotelCard({ hotel, stay }: HotelCardProps) {
    return (
        <Card className="overflow-hidden sm:flex-row">
            <img
                src={hotel.image}
                alt={hotel.name}
                className="h-48 w-full object-cover sm:h-auto sm:w-60"
            />

            <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold">{hotel.name}</h2>
                        <span aria-label={`${hotel.stars} stars`}>
                            {"★".repeat(hotel.stars)}
                        </span>
                    </div>

                    <p className="text-sm capitalize text-muted-foreground">
                        {hotel.city} · Rating {hotel.rating}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {hotel.amenities.map((amenity) => (
                            <Badge key={amenity} variant="secondary">
                                {amenity}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-3 border-t pt-4">
                    <div>
                        <p className="text-xs text-muted-foreground">
                            Total for your stay
                        </p>
                        <p className="text-xl font-bold">
                            {formatMoney(hotel.fromTotal)}
                        </p>
                    </div>

                    <Link
                        href={hotelHref(hotel.id, stay)}
                        className={buttonVariants()}
                    >
                        View hotel
                    </Link>
                </div>
            </div>
        </Card>
    );
}
