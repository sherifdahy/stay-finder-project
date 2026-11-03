import { API_ERROR_CODE } from "@/src/domain/constants/api-error-code";
import { hotelDetailsSearchSchema } from "@/src/domain/validations/hotel-details-search.schema";
import { errorResponse, toApiError } from "@/src/server/http/apiError";
import { getHotelDetails } from "@/src/server/services/hotels";
import { withChaos } from "@/src/server/withChaos";

export const GET = withChaos(
    async (request: Request, { params }: RouteContext<"/api/hotels/[hotelId]">) => {
        try {
            const { hotelId } = await params;
            const { searchParams } = new URL(request.url);

            const validation = hotelDetailsSearchSchema.safeParse(
                Object.fromEntries(searchParams)
            );

            if (!validation.success) {
                return errorResponse(
                    API_ERROR_CODE.VALIDATION_ERROR,
                    "Invalid hotel details parameters.",
                    400,
                    validation.error.issues
                );
            }

            const details = getHotelDetails(
                hotelId,
                validation.data.checkIn,
                validation.data.checkOut,
                validation.data.adults
            );

            if (!details) {
                return errorResponse(
                    API_ERROR_CODE.NOT_FOUND,
                    "Hotel was not found.",
                    404
                );
            }

            return Response.json(details);
        } catch (error) {
            return toApiError(error);
        }
    }
);
