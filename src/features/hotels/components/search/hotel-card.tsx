/* eslint-disable @next/next/no-img-element */

import { MapPin, Star } from "lucide-react";
import type { Hotel } from "@/src/domain/types/hotel";
import { Link } from "@/src/i18n/navigation";
import { formatMoney } from "@/src/shared/lib/format-money";
import { buttonVariants } from "@/src/shared/ui/button";
import { Card } from "@/src/shared/ui/card";
import { AmenityIcon } from "../amenity-icon";
import { hotelHref, type HotelSearchParams } from "../../search-params";

interface HotelCardProps {
    hotel: Hotel & { fromTotal: number };
    stay: Pick<HotelSearchParams, "checkIn" | "checkOut" | "adults">;
}

export function HotelCard({ hotel, stay }: HotelCardProps) {
    return (
        <Card className="gap-0 py-0 sm:flex-row">
            <img
                src={hotel.image}
                alt={hotel.name}
                className="h-48 w-full object-cover sm:h-auto sm:w-60 sm:rounded-none!"
            />

            <div className="flex flex-1 flex-col justify-between gap-4 p-4">
                <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold">{hotel.name}</h2>
                        <span aria-label={`${hotel.stars} stars`}>
                            {"★".repeat(hotel.stars)}
                        </span>
                    </div>

                    <p className="flex items-center gap-1 text-sm font-medium">
                        <Star className="size-4 fill-amber-400 text-amber-400" aria-hidden />
                        {hotel.rating}
                        <span className="sr-only">rating</span>
                    </p>

                    <p className="flex items-center gap-1 text-sm capitalize text-muted-foreground">
                        <MapPin className="size-4" aria-hidden />
                        {hotel.city}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                        {hotel.amenities.map((amenity) => (
                            <AmenityIcon key={amenity} amenity={amenity} />
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
