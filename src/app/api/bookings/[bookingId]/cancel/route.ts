import { toApiError } from "@/src/server/http/apiError";
import { cancelBooking } from "@/src/server/services/bookings";

interface RouteContext {
    params: Promise<{
        bookingId: string;
    }>;
}

export async function POST(
    _request: Request,
    { params }: RouteContext
) {
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