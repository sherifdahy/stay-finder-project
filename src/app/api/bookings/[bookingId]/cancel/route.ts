
import { toApiError } from "@/src/server/http/apiError";
import { cancelBooking } from "@/src/server/services/bookings";
import { withChaos } from "@/src/server/withChaos";

interface RouteContext {
    params: Promise<{
        bookingId: string;
    }>;
}

export const POST = withChaos(
    async (_request: Request, { params }: RouteContext) => {
        try {
            const { bookingId } = await params;

            const booking = cancelBooking(bookingId);

            return Response.json({
                booking,
                serverTime: new Date().toISOString(),
            });
        } catch (error) {
            return toApiError(error);
        }
    }
);
