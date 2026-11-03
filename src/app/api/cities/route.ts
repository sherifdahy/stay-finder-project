import { withApi } from "@/src/server/http/with-api";
import { listCities } from "@/src/server/services/cities";

export const GET = withApi(
    async (_request: Request, _context: unknown, { locale }) => Response.json({ cities: listCities(locale) }),
);
