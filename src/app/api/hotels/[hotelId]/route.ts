import { API_ERROR_CODE } from "@/src/domain/constants/api-error-code";
import { hotelDetailsSearchSchema } from "@/src/domain/validations/hotel-details-search.schema";
import { ServiceError } from "@/src/server/errors/service-error";
import { parseInput } from "@/src/server/http/parse-input";
import { withApi } from "@/src/server/http/with-api";
import { getHotelDetails } from "@/src/server/services/hotels";

export const GET = withApi(
    async (request: Request, { params }: RouteContext<"/api/hotels/[hotelId]">, { locale }) => {
        const { hotelId } = await params;
        const { searchParams } = new URL(request.url);

        const query = parseInput(hotelDetailsSearchSchema, Object.fromEntries(searchParams), 400);

        const details = getHotelDetails(hotelId, query.checkIn, query.checkOut, query.adults, locale);

        if (!details) {
            throw new ServiceError(API_ERROR_CODE.NOT_FOUND, "hotelNotFound", 404);
        }

        return Response.json(details);
    }
);
