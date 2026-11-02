import { hotelSearchSchema } from "@/src/domain/validations/hotel-search.schema";
import { toApiError } from "@/src/server/http/apiError";
import { HotelSearchParams, searchHotels } from "@/src/server/services/hotels";
import { withChaos } from "@/src/server/withChaos";



export const GET = withChaos(async (request: Request) => {
    try {
        const { searchParams } = new URL(request.url);

        const rawQuery = {
            city: searchParams.get("city") ?? undefined,
            checkIn: searchParams.get("checkIn") ?? undefined,
            checkOut: searchParams.get("checkOut") ?? undefined,
            adults: searchParams.has("adults")
                ? Number(searchParams.get("adults"))
                : undefined,
            maxPrice: searchParams.has("maxPrice")
                ? Number(searchParams.get("maxPrice"))
                : undefined,
            stars: searchParams.has("stars")
                ? Number(searchParams.get("stars"))
                : undefined,
            sort: searchParams.get("sort") ?? undefined,
        };

        const validation = hotelSearchSchema.safeParse(rawQuery);

        if (!validation.success) {
            return Response.json(
                {
                    error: {
                        code: "VALIDATION_ERROR",
                        message: "Invalid hotel search parameters.",
                        details: validation.error.issues,
                    },
                },
                { status: 400 }
            );
        }

        const hotels = searchHotels(validation.data as HotelSearchParams);

        return Response.json({ hotels });
    } catch (error) {
        return toApiError(error);
    }
});