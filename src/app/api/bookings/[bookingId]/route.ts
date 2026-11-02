
import { toApiError } from "@/src/server/http/apiError";
import { getBooking } from "@/src/server/services/bookings";
import { withChaos } from "@/src/server/withChaos";

export const GET = withChaos(
    async (_request: Request, { params }: RouteContext<"/api/bookings/[bookingId]">) => {
        try {
            const { bookingId } = await params;

            const booking = getBooking(bookingId);

            return Response.json({
                booking,
                serverTime: new Date().toISOString(),
            });
        } catch (error) {
            return toApiError(error);
        }
    }
);
