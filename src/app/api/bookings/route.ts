import { createHoldSchema } from "@/src/domain/validations/create-hold.Schema";
import { parseInput } from "@/src/server/http/parse-input";
import { withApi } from "@/src/server/http/with-api";
import { createHold, getAllBookings } from "@/src/server/services/bookings";

export const POST = withApi(async (request: Request, _context: unknown, { chaos }) => {
    const input = parseInput(createHoldSchema, await request.json(), 422);

    const result = createHold(input, { changePrice: chaos.shouldChangePrice() });

    return Response.json(result, { status: 201 });
});

export const GET = withApi(async (_request: Request, _context: unknown, { locale }) => {
    return Response.json({
        bookings: getAllBookings(locale),
        serverTime: new Date().toISOString(),
    });
});
