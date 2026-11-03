import { hotelSearchSchema } from "@/src/domain/validations/hotel-search.schema";
import { parseInput } from "@/src/server/http/parse-input";
import { withApi } from "@/src/server/http/with-api";
import { searchHotels } from "@/src/server/services/hotels";

export const GET = withApi(async (request: Request, _context: unknown, { locale }) => {
    const { searchParams } = new URL(request.url);

    const params = parseInput(hotelSearchSchema, Object.fromEntries(searchParams), 400);

    return Response.json({ hotels: searchHotels(params, locale) });
});
