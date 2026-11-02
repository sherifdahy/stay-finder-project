import z from "zod";

export const starsSchema = z
    .string()
    .transform((value) =>
        value
            .split(",")
            .filter(Boolean)
            .map((star) => Number(star)),
    )
    .pipe(z.array(z.number().int().min(1).max(5)))
    .optional();
