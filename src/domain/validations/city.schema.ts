import { z } from "zod";

export const citySchema = z.enum([
    "riyadh",
    "jeddah",
    "dubai",
]);