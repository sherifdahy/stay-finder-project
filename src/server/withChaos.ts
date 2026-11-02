
type RouteHandler<TContext = unknown> = (
    request: Request,
    context: TContext
) => Promise<Response>;

interface ChaosOptions {
    simulateLostResponse?: boolean;
}

function getNumberEnv(name: string, fallback: number): number {
    const value = process.env[name];

    if (value === undefined) return fallback;

    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : fallback;
}

function isChaosEnabled(): boolean {
    return process.env.CHAOS_ENABLED !== "false";
}

function randomChance(rate: number): boolean {
    return Math.random() < Math.min(1, Math.max(0, rate));
}

function sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function serverError(): Response {
    return Response.json(
        {
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "An unexpected server error occurred.",
                details: null,
            },
        },
        { status: 500 }
    );
}

export function withChaos<TContext = unknown>(
    handler: RouteHandler<TContext>,
    options: ChaosOptions = {}
): RouteHandler<TContext> {
    return async (request, context): Promise<Response> => {
        if (!isChaosEnabled()) {
            return handler(request, context);
        }

        // 1. Simulate random latency.
        const maxLatency = Math.max(
            0,
            getNumberEnv("CHAOS_MAX_LATENCY_MS", 1500)
        );

        const delay = Math.floor(Math.random() * (maxLatency + 1));

        await sleep(delay);

        // 2. Simulate random server errors before executing the handler.
        const errorRate = getNumberEnv("CHAOS_ERROR_RATE", 0.1);

        if (randomChance(errorRate)) {
            return serverError();
        }

        // 3. Execute the actual API handler.
        const response = await handler(request, context);

        // 4. Simulate a lost response after successful execution.
        if (options.simulateLostResponse && response.ok) {
            const lostResponseRate = getNumberEnv(
                "CHAOS_LOST_RESPONSE_RATE",
                0.1
            );

            if (randomChance(lostResponseRate)) {
                return serverError();
            }
        }

        return response;
    };
}
