import type { Context } from "hono";
import type { Env } from "../types";
import { getConnInfo } from "hono/cloudflare-workers";
import { ClientError, ErrorCodes } from "./client_error";

interface TurnstileSuccessResponse {
    success: true;
    challenge_ts: string;
    hostname: string;
    "error-codes": [];
    action: string;
    cdata: string;
    metadata: {
        ephemeral_id: string;
    }
}

interface TurnstileFailedResponse {
    success: false;
    "error-codes": (
        | "missing-input-secret"
        | "invalid-input-secret"
        | "missing-input-response"
        | "invalid-input-response"
        | "bad-request"
        | "timeout-or-duplicate"
        | "internal-error"
    )[]
}

export const checkTurnstile = async (c: Context<Env>, token: string | null | undefined): Promise<TurnstileSuccessResponse> => {
    if (!token) {
        throw new ClientError(ErrorCodes.BadRequest);
    }

    const fd = new FormData();
    fd.append("secret", c.env.TURNSTILE_SECRET);
    fd.append("response",  token);
    const { remote: { address } } = getConnInfo(c);
    if (address) {
        fd.append("remoteip", address);
    }

    const res = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            body: fd,
        }
    );

    const result = await res.json() as TurnstileSuccessResponse | TurnstileFailedResponse;

    if (!result.success) {
        if (
            result["error-codes"].includes("timeout-or-duplicate") ||
            result["error-codes"].includes("invalid-input-response")
        ) {
            throw new ClientError(ErrorCodes.InvalidTurnstile);
        } else {
            console.error(`Turnstile error: ${result["error-codes"].join(", ")}`);
            throw new ClientError(ErrorCodes.ServerError);
        }
    }

    return result;
}
