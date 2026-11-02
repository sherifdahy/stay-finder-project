import { createHoldSchema } from "@/src/domain/validations/create-hold.Schema";
import { errorResponse, toApiError } from "@/src/server/http/apiError";
import { createHold, getAllBookings } from "@/src/server/services/bookings";
import { withChaos } from "@/src/server/withChaos";

export const POST = withChaos(async (request: Request, _context: unknown, chaos) => {
    try {
        const body: unknown = await request.json();

        const validation = createHoldSchema.safeParse(body);

        if (!validation.success) {
            return errorResponse(
                "VALIDATION_ERROR",
                "Invalid booking data.",
                422,
                validation.error.issues
            );
        }

        const result = createHold(validation.data, {
            changePrice: chaos.shouldChangePrice(),
        });

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
