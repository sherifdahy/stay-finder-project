import z from "zod";

export const guestSchema = z.object({
    fullName: z.string().trim().min(2).max(100),
    email: z.string().trim().email(),
    phone: z.string().trim().min(8).max(20),
});