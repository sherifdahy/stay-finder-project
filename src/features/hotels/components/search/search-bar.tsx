"use client";

import { MapPin, Search, Users } from "lucide-react";
import { useState, type FormEvent } from "react";
import { getDefaultStay } from "@/src/domain/dates/get-default-stay";
import type { City } from "@/src/domain/types/city";
import { hotelSearchSchema } from "@/src/domain/validations/hotel-search.schema";
import StayDatePicker from "./stay-date-picker";
import { Button } from "@/src/shared/ui/button";
import { Label } from "@/src/shared/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/shared/ui/select";

interface SearchValues {
    city: City;
    checkIn: string;
    checkOut: string;
    adults: number;
}

interface SearchBarProps extends SearchValues {
    onSearch: (values: SearchValues) => void;
}

const CITIES = [
    { value: "riyadh", label: "Riyadh" },
    { value: "jeddah", label: "Jeddah" },
    { value: "dubai", label: "Dubai" },
];

const ADULTS = [1, 2, 3, 4].map((count) => ({
    value: String(count),
    label: String(count),
}));

export function SearchBar(props: SearchBarProps) {
    const [city, setCity] = useState<string>(props.city);
    // No dates in the URL yet: start from today and the longest stay.
    const [checkIn, setCheckIn] = useState(() => props.checkIn || getDefaultStay().checkIn);
    const [checkOut, setCheckOut] = useState(() => props.checkOut || getDefaultStay().checkOut);
    const [adults, setAdults] = useState(String(props.adults));
    const [errors, setErrors] = useState<Record<string, string>>({});

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Same schema the API uses.
        const result = hotelSearchSchema.safeParse({
            city,
            checkIn,
            checkOut,
            adults,
        });

        if (!result.success) {
            const next: Record<string, string> = {};

            for (const issue of result.error.issues) {
                next[String(issue.path[0])] ??= issue.message;
            }

            setErrors(next);
            return;
        }

        setErrors({});
        props.onSearch({
            city: result.data.city,
            checkIn: result.data.checkIn,
            checkOut: result.data.checkOut,
            adults: result.data.adults,
        });
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="grid gap-4 rounded-xl border p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1.5fr_8rem_auto]"
            noValidate
        >
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="city">City</Label>
                <Select
                    modal={false}
                    items={CITIES}
                    value={city}
                    onValueChange={(value) => value && setCity(value)}
                >
                    <SelectTrigger id="city" className="w-full">
                        <span className="flex items-center gap-2">
                            <MapPin className="text-muted-foreground" />
                            <SelectValue />
                        </span>
                    </SelectTrigger>
                    <SelectContent>
                        {CITIES.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
                <Label htmlFor="stay">Check-in – Check-out</Label>
                <StayDatePicker
                    checkIn={checkIn}
                    checkOut={checkOut}
                    invalid={Boolean(errors.checkIn || errors.checkOut)}
                    onChange={(stay) => {
                        setCheckIn(stay.checkIn);
                        setCheckOut(stay.checkOut);
                    }}
                />
                {(errors.checkIn || errors.checkOut) && (
                    <p className="text-sm text-destructive">{errors.checkIn ?? errors.checkOut}</p>
                )}
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="adults">Adults</Label>
                <Select
                    modal={false}
                    items={ADULTS}
                    value={adults}
                    onValueChange={(value) => value && setAdults(value)}
                >
                    <SelectTrigger id="adults" className="w-full">
                        <span className="flex items-center gap-2">
                            <Users className="text-muted-foreground" />
                            <SelectValue />
                        </span>
                    </SelectTrigger>
                    <SelectContent>
                        {ADULTS.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-end">
                <Button type="submit" className="w-full lg:w-auto lg:px-6">
                    <Search data-icon="inline-start" />
                    Search
                </Button>
            </div>
        </form>
    );
}
