"use client";

import { CalendarDays } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import type { DateRange } from "react-day-picker";
import { ar, enUS } from "react-day-picker/locale";
import { getDirection } from "@/src/domain/constants/locale";
import { getDefaultStay } from "@/src/domain/dates/get-default-stay";
import { parseISODate } from "@/src/domain/utils/parse-iso-date";
import { Calendar } from "@/src/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/shared/ui/popover";
import { cn } from "cn";

interface StayDatePickerProps {
    checkIn: string;
    checkOut: string;
    onChange: (stay: { checkIn: string; checkOut: string }) => void;
    invalid?: boolean;
}

// The input can be empty or half-typed while a range is being picked.
function toDate(value: string): Date | undefined {
    try {
        return parseISODate(value);
    } catch {
        return undefined;
    }
}

const CALENDAR_LOCALES = { en: enUS, ar };

export default function StayDatePicker({ checkIn, checkOut, onChange, invalid }: StayDatePickerProps) {
    const t = useTranslations("Search");
    const locale = useLocale();
    const formatDay = new Intl.DateTimeFormat(locale, {
        timeZone: "UTC",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const [open, setOpen] = useState(false);
    const [picking, setPicking] = useState(false);
    const from = toDate(checkIn);
    const to = toDate(checkOut);
    const today = toDate(getDefaultStay().checkIn);

    // Every opening starts a fresh range instead of nudging the end of the old one.
    function handleSelect(_range: DateRange | undefined, day: Date) {
        const iso = day.toISOString().slice(0, 10);

        if (!picking || iso <= checkIn) {
            setPicking(true);
            onChange({ checkIn: iso, checkOut: "" });
            return;
        }

        onChange({ checkIn, checkOut: iso });
        setPicking(false);
        setOpen(false);
    }

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                setPicking(false);
            }}
        >
            <PopoverTrigger
                id="stay"
                aria-invalid={invalid}
                className={cn(
                    "flex h-8 w-full items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 text-start text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
                    !from && "text-muted-foreground",
                )}
            >
                <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">
                    {from ? formatDay.format(from) : t("checkIn")}
                    {" – "}
                    {to ? formatDay.format(to) : t("checkOut")}
                </span>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                    mode="range"
                    locale={CALENDAR_LOCALES[locale]}
                    dir={getDirection(locale)}
                    timeZone="UTC"
                    defaultMonth={from}
                    selected={{ from, to }}
                    onSelect={handleSelect}
                    disabled={today ? { before: today } : undefined}
                />
            </PopoverContent>
        </Popover>
    );
}
