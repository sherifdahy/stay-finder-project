import { hotelSearchSchema } from "@/src/domain/validations/hotel-search.schema";
import { errorResponse, toApiError } from "@/src/server/http/apiError";
import { searchHotels } from "@/src/server/services/hotels";
import { withChaos } from "@/src/server/withChaos";

export const GET = withChaos(async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);

        const validation = hotelSearchSchema.safeParse(
            Object.fromEntries(searchParams)
        );

        if (!validation.success) {
            return errorResponse(
                "VALIDATION_ERROR",
                "Invalid hotel search parameters.",
                400,
                validation.error.issues
            );
        }

        const hotels = searchHotels(validation.data);

        return Response.json({ hotels });
    } catch (error) {
        return toApiError(error);
    }
});
