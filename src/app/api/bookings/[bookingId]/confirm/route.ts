
import { guestSchema } from "@/src/domain/validations/guest.schema";
import { errorResponse, toApiError } from "@/src/server/http/apiError";
import { confirmBooking } from "@/src/server/services/bookings";
import { withChaos } from "@/src/server/withChaos";

export const POST = withChaos(
    async (request: Request, { params }: RouteContext<"/api/bookings/[bookingId]/confirm">) => {
        try {
            const { bookingId } = await params;

            const idempotencyKey =
                request.headers.get("Idempotency-Key");

            if (!idempotencyKey) {
                return errorResponse(
                    "VALIDATION_ERROR",
                    "Idempotency-Key header is required.",
                    422
                );
            }

            const body: unknown = await request.json();

            const validation = guestSchema.safeParse(body);

            if (!validation.success) {
                return errorResponse(
                    "VALIDATION_ERROR",
                    "Invalid guest information.",
                    422,
                    validation.error.issues
                );
            }

            const result = confirmBooking(
                bookingId,
                validation.data,
                idempotencyKey
            );

            return Response.json(result);
        } catch (error) {
            return toApiError(error);
        }
    },
    { simulateLostResponse: true }
);
