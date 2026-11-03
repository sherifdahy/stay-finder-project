"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { guestSchema, type Guest } from "@/src/domain/validations/guest.schema";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";
import { Label } from "@/src/shared/ui/label";

interface GuestFormProps {
    disabled: boolean;
    isSubmitting: boolean;
    onSubmit: (guest: Guest) => void;
}

export function GuestForm({
    disabled,
    isSubmitting,
    onSubmit,
}: GuestFormProps) {
    const t = useTranslations("GuestForm");
    const locale = useLocale();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Same schema the API uses.
        const result = guestSchema.safeParse(
            { fullName, email, phone },
            { error: z.locales[locale]().localeError },
        );

        if (!result.success) {
            const next: Record<string, string> = {};

            for (const issue of result.error.issues) {
                next[String(issue.path[0])] ??= issue.message;
            }

            setErrors(next);
            return;
        }

        setErrors({});
        onSubmit(result.data);
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <fieldset disabled={disabled || isSubmitting} className="space-y-4">
                <div className="space-y-1.5">
                    <Label htmlFor="fullName">{t("fullName")}</Label>
                    <Input
                        id="fullName"
                        value={fullName}
                        aria-invalid={Boolean(errors.fullName)}
                        onChange={(event) => setFullName(event.target.value)}
                    />
                    {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName}</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="email">{t("email")}</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        aria-invalid={Boolean(errors.email)}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="phone">{t("phone")}</Label>
                    <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        aria-invalid={Boolean(errors.phone)}
                        onChange={(event) => setPhone(event.target.value)}
                    />
                    {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone}</p>
                    )}
                </div>

                <Button type="submit" className="w-full">
                    {isSubmitting ? t("confirming") : t("confirm")}
                </Button>
            </fieldset>
        </form>
    );
}
