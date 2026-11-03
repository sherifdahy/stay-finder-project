import { withApi } from "@/src/server/http/with-api";
import { getBooking } from "@/src/server/services/bookings";

export const GET = withApi(
    async (_request: Request, { params }: RouteContext<"/api/bookings/[bookingId]">) => {
        const { bookingId } = await params;

        return Response.json({
            booking: getBooking(bookingId),
            serverTime: new Date().toISOString(),
        });
    }
);
