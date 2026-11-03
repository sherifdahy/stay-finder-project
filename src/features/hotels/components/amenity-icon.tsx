import {
    Check,
    Dumbbell,
    Flower2,
    SquareParking,
    Trees,
    Umbrella,
    Utensils,
    Waves,
    Wifi,
    type LucideIcon,
} from "lucide-react";
import type { HotelAmenity } from "@/src/domain/types/hotel";

const AMENITY_ICONS: Record<string, LucideIcon> = {
    beach: Umbrella,
    garden: Trees,
    gym: Dumbbell,
    parking: SquareParking,
    pool: Waves,
    restaurant: Utensils,
    spa: Flower2,
    wifi: Wifi,
};

// An amenity we have no icon for still shows up, with a check mark.
export function AmenityIcon({ amenity }: { amenity: HotelAmenity }) {
    const Icon = AMENITY_ICONS[amenity.code] ?? Check;

    return (
        <span
            title={amenity.label}
            className="inline-flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground"
        >
            <Icon className="size-4" aria-hidden />
            <span className="sr-only">{amenity.label}</span>
        </span>
    );
}
