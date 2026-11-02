
export interface ChaosControls {
    /** True when this request should see a higher room price. */
    shouldChangePrice: () => boolean;
}

type RouteHandler<TContext = unknown> = (
    request: Request,
    context: TContext,
    chaos: ChaosControls
) => Promise<Response>;

interface ChaosOptions {
    /** "before": fail without running the handler. "after": run it, then lose the response. */
    errorTiming?: "before" | "after";
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
                code: "INTERNAL_ERROR",
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
): (request: Request, context: TContext) => Promise<Response> {
    const errorTiming = options.errorTiming ?? "before";

    return async (request, context): Promise<Response> => {
        if (!isChaosEnabled()) {
            return handler(request, context, {
                shouldChangePrice: () => false,
            });
        }

        // 1. Random latency.
        const maxLatency = Math.max(
            0,
            getNumberEnv("CHAOS_MAX_LATENCY_MS", 1500)
        );

        await sleep(Math.floor(Math.random() * (maxLatency + 1)));

        const errorRate = getNumberEnv("CHAOS_ERROR_RATE", 0.1);
        const shouldFail = randomChance(errorRate);

        // 2. Random server error before the handler runs.
        if (shouldFail && errorTiming === "before") {
            return serverError();
        }

        // 3. Run the handler.
        const response = await handler(request, context, {
            shouldChangePrice: () =>
                randomChance(getNumberEnv("CHAOS_PRICE_CHANGE_RATE", 0.1)),
        });

        // 4. Random error after the handler ran (the work is already done).
        if (shouldFail && errorTiming === "after") {
            return serverError();
        }

        return response;
    };
}
