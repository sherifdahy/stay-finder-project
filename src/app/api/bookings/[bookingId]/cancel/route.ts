import { withApi } from "@/src/server/http/with-api";
import { cancelBooking } from "@/src/server/services/bookings";

export const POST = withApi(
    async (_request: Request, { params }: RouteContext<"/api/bookings/[bookingId]/cancel">) => {
        const { bookingId } = await params;

        return Response.json({
            booking: cancelBooking(bookingId),
            serverTime: new Date().toISOString(),
        });
    }
);
