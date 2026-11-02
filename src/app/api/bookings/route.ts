
import { createHoldSchema } from "@/src/domain/validations/create-hold.Schema";
import { toApiError } from "@/src/server/http/apiError";
import { createHold, getAllBookings } from "@/src/server/services/bookings";
import { withChaos } from "@/src/server/withChaos";

export const POST = withChaos(async (request: Request) => {
    try {
        const body: unknown = await request.json();

        const validation = createHoldSchema.safeParse(body);

        if (!validation.success) {
            return Response.json(
                {
                    error: {
                        code: "VALIDATION_ERROR",
                        message: "Invalid booking data.",
                        details: validation.error.issues,
                    },
                },
                { status: 422 }
            );
        }

        const result = createHold(validation.data);

        return Response.json(result, { status: 201 });
    } catch (error) {
        return toApiError(error);
    }
});

export const GET = withChaos(async () => {
    try {
        const bookings = getAllBookings();

        return Response.json({
            bookings,
            serverTime: new Date().toISOString(),
        });
    } catch (error) {
        return toApiError(error);
    }
});
