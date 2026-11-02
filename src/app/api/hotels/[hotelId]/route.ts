
import { hotelDetailsSearchSchema } from "@/src/domain/validations/hotel-details-search.schema";
import { toApiError } from "@/src/server/http/apiError";
import { getHotelDetails } from "@/src/server/services/hotels";
import { withChaos } from "@/src/server/withChaos";

export const GET = withChaos(
    async (request: Request, { params }: RouteContext<"/api/hotels/[hotelId]">) => {
        try {
            const { hotelId } = await params;
            const { searchParams } = new URL(request.url);

            const rawQuery = {
                checkIn: searchParams.get("checkIn") ?? undefined,
                checkOut: searchParams.get("checkOut") ?? undefined,
                adults: searchParams.has("adults")
                    ? Number(searchParams.get("adults"))
                    : undefined,
            };

            const validation =
                hotelDetailsSearchSchema.safeParse(rawQuery);

            if (!validation.success) {
                return Response.json(
                    {
                        error: {
                            code: "VALIDATION_ERROR",
                            message: "Invalid hotel details parameters.",
                            details: validation.error.issues,
                        },
                    },
                    { status: 400 }
                );
            }

            const hotel = getHotelDetails(
                hotelId,
                validation.data.checkIn,
                validation.data.checkOut,
                validation.data.adults
            );

            if (!hotel) {
                return Response.json(
                    {
                        error: {
                            code: "NOT_FOUND",
                            message: "Hotel was not found.",
                            details: null,
                        },
                    },
                    { status: 404 }
                );
            }

            return Response.json({ hotel });
        } catch (error) {
            return toApiError(error);
        }
    }
);
