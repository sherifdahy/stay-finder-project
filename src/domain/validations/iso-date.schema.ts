import z from "zod";

// Messages are keys of the "Validation" translations, so the form shows them in the page language.
export const isoDateSchema = z
    .string()
    .min(1, "dateRequired")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "invalidDateFormat")
    .refine((value) => {
        const date = new Date(`${value}T00:00:00.000Z`);

        return (
            !Number.isNaN(date.getTime()) &&
            date.toISOString().slice(0, 10) === value
        );
    }, "invalidDate");
