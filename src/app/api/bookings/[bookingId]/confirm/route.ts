import { API_ERROR_CODE } from "@/src/domain/constants/api-error-code";
import { guestSchema } from "@/src/domain/validations/guest.schema";
import { ServiceError } from "@/src/server/errors/service-error";
import { parseInput } from "@/src/server/http/parse-input";
import { withApi } from "@/src/server/http/with-api";
import { confirmBooking } from "@/src/server/services/bookings";

export const POST = withApi(
    async (request: Request, { params }: RouteContext<"/api/bookings/[bookingId]/confirm">) => {
        const { bookingId } = await params;

        const idempotencyKey = request.headers.get("Idempotency-Key");

        if (!idempotencyKey) {
            throw new ServiceError(API_ERROR_CODE.VALIDATION_ERROR, "idempotencyKeyRequired", 422);
        }

        const guest = parseInput(guestSchema, await request.json(), 422);

        return Response.json(confirmBooking(bookingId, guest, idempotencyKey));
    },
    { errorTiming: "after" }
);
